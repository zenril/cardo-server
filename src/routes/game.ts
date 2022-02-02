import { Card, Game, PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { buildGameDeck, GameRequestBody } from "../utils/cards";
import { UserResponse } from "./auth";
import { Server } from "socket.io/dist/index";

interface GameRequest extends Request {
  body: GameRequestBody;
}

const gameRouter = (io: Server) => {
  const router = Router();
  const prisma = new PrismaClient();

  //create game
  router.post("/", async (req: GameRequest, res) => {
    try {
      let deck = await prisma.deck.findFirst({
        where: {
          id: Number(req.body.deck),
          userId: res.locals.user.id,
        },
      });

      if (!deck) {
        return res.sendStatus(412);
      }

      let cards = buildGameDeck(deck) as Card[];
      const game = await prisma.game.create({
        data: {
          name: req.body.name,
          open: true,
          deck: {
            connect: { id: deck.id },
          },
          users: {
            connect: { id: res.locals.user.id },
          },
          cards: {
            create: cards,
          },
          stats: {
            create: {
              totalCards: cards.length,
              playedCards: 0,
            },
          },
        },
      });

      // return res.sendStatus(500);
      return res.json(game);
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  });

  //add user to game
  router.put("/:game_uuid/user", async (req, res: UserResponse) => {
    await prisma.game.update({
      where: {
        uuid: req.params.game_uuid,
      },
      data: {
        users: {
          connect: { id: res.locals.user.id },
        },
      },
    });

    return res.sendStatus(200);
  });

  router.get("/", async (req, res: UserResponse) => {
    const games = await prisma.game.findMany({
      where: {
        users: {
          every: {
            id: res.locals.user.id,
          },
        },
      },
      include: {
        cards: true,
        stats: {
          include: {
            lastUser: true,
          },
        },
      },
    });

    return res.json(games);
  });

  //get a single game
  router.get("/:game_uuid", async (req, res: UserResponse) => {
    let date = new Date();

    let game = await prisma.game.findFirst({
      where: {
        uuid: req.params.game_uuid,
      },
      include: {
        users: true,
        cards: {
          include: {
            user: true,
          },
        },
        stats: {
          include: {
            lastUser: true,
          },
        },
      },
    });

    if (!game?.users.some((user) => user.id === res.locals.user.id)) {
      await prisma.game.update({
        where: {
          uuid: req.params.game_uuid,
        },
        data: {
          users: {
            connect: { id: res.locals.user.id },
          },
        },
      });
    }

    if (!game) return res.json({});

    return res.json(game);
  });

  //delete a game
  router.delete("/:game_uuid", async (req, res: UserResponse) => {
    let date = new Date();

    await prisma.card.deleteMany({
      where: {
        game: {
          uuid: req.params.game_uuid,
          users: {
            every: {
              id: res.locals.user.id,
            },
          },
        },
      },
    });

    let deleted = await prisma.game.deleteMany({
      where: {
        uuid: req.params.game_uuid,
        users: {
          every: {
            id: res.locals.user.id,
          },
        },
      },
    });

    if (!deleted.count) return res.sendStatus(404);

    return res.json(req.params.game_uuid);
  });

  //pick a new card
  router.get("/:game_uuid/pick", async (req, res: UserResponse) => {
    let date = new Date();

    //default response
    let card: Partial<Card> = {
      name: "",
      type: "",
      set: "",
      position: -1,
    };

    //make sure the game exists and get the id
    let game = await prisma.game.findFirst({
      where: {
        uuid: req.params.game_uuid,
        users: {
          some: {
            id: res.locals.user.id,
          },
        },
        open: true,
      },
    });

    //game doesnt exist, doesnt belong to you or is finished
    if (!game?.uuid) return res.json(card);

    //get all the cards
    let cards = await prisma.card.findMany({
      where: {
        gameId: game.id,
        userId: null,
      },
    });

    //there are cards to be plated?
    if (cards.length) {
      card = cards[(Math.random() * cards.length) << 0];

      card = await prisma.card.update({
        where: {
          id: card.id,
        },
        data: {
          userId: res.locals.user.id,
          played: new Date(),
        },
        include: {
          user: true,
        },
      });

      await prisma.stats.update({
        where: {
          gameId: game.id,
        },
        data: {
          playedCards: {
            increment: 1,
          },
          lastUser: {
            connect: {
              id: res.locals.user.id,
            },
          },
        },
      });
    }

    //there are no cards to be played
    if (!cards.length) {
      await prisma.game.update({
        where: {
          uuid: req.params.game_uuid,
        },
        data: {
          open: false,
        },
      });
    }

    //emit to socket connection
    io.to(game.uuid).emit("card", card);
    //return the card
    return res.json(card);
  });

  //reset a game
  router.post("/:game_uuid/reset", async (req, res: UserResponse) => {
    if (!req.params.game_uuid) {
      return res.sendStatus(500);
    }

    let game = await prisma.game.findFirst({
      where: {
        uuid: req.params.game_uuid,
        users: {
          every: {
            id: res.locals.user.id,
          },
        },
      },
    });

    if (!game) {
      return res.sendStatus(500);
    }

    await prisma.stats.updateMany({
      where: {
        gameId: game.id,
      },
      data: {
        playedCards: 0,
        lastUserId: null,
      },
    });

    let cards = await prisma.card.updateMany({
      where: {
        game: {
          uuid: req.params.game_uuid,
        },
        userId: res.locals.user.id,
      },
      data: {
        played: null,
        userId: null,
      },
    });

    if (!cards.count) {
      return res.sendStatus(500);
    }
    return res.sendStatus(200);
  });

  return router;
};

export { gameRouter };
