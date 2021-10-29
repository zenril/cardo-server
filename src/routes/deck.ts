import { Card, Game, PrismaClient, Prisma, User, Deck } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import {
  buildGameDeck,
  GameRequestBody,
  verifyDeck,
  DeckData,
} from "../utils/cards";
import { UserResponse } from "./auth";

interface DeckRequest extends Request {
  body: DeckData;
}

const deckRouter = () => {
  const router = Router();
  const prisma = new PrismaClient();

  router.post("/", async (req: DeckRequest, res) => {
    try {
      if (!verifyDeck(req.body)) {
        return res.sendStatus(412);
      }

      if (req.body.uuid) {
        return res.json(
          await prisma.deck.update({
            where: {
              uuid: req.body.uuid,
            },
            data: {
              suits: req.body.suits as Prisma.JsonValue,
              name: req.body.name,
            },
          })
        );
      }

      return res.json(
        await prisma.deck.create({
          data: {
            name: req.body.name,
            suits: req.body.suits as Prisma.JsonValue,
            user: {
              connect: {
                id: res.locals.user.id,
              },
            },
          },
        })
      );
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  });

  router.get("/", async (req, res: UserResponse) => {
    let date = new Date();

    let deck = await prisma.deck.findMany({
      where: {
        userId: res.locals.user.id,
      },
    });

    if (!deck) return res.json([]);

    return res.json(deck);
  });

  router.get("/:deck_uuid", async (req, res: UserResponse) => {
    let date = new Date();

    let deck = await prisma.deck.findFirst({
      where: {
        uuid: req.params.deck_uuid,
        userId: res.locals.user.id,
      },
    });

    if (!deck) return res.sendStatus(404);

    return res.json(deck);
  });

  router.delete("/:deck_uuid", async (req, res: UserResponse) => {
    let date = new Date();

    let deleted = await prisma.deck.deleteMany({
      where: {
        uuid: req.params.deck_uuid,
        userId: res.locals.user.id,
      },
    });

    if (!deleted.count) return res.sendStatus(404);

    return res.json(req.params.deck_uuid);
  });

  return router;
};

export { deckRouter };
