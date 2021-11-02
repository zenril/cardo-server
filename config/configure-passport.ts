import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient, User, Deck, Card, Prisma } from "@prisma/client";
import { Authenticator, PassportStatic } from "passport";
import {
  buildGameDeck,
  cardSets,
  DeckName,
  defaultDeck,
  GameName,
} from "../src/utils/cards";

const prisma = new PrismaClient();

export const configurePassport = (passport: PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: (process.env.API! || '') + "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        if (!profile?.emails?.[0].value) {
          throw new Error(
            "Google Profile must have an email, what are you even doing????"
          );
        }

        const totalUsers = await prisma.user.count();

        const newUser: Partial<User> = {
          googleId: profile.id,
          name: "",
          displayName: `User${10000 + totalUsers + 1}`,
          email: profile.emails?.[0].value,
        };

        try {
          let user = await prisma.user.findFirst({
            where: {
              email: newUser.email,
            },
          });

          if (user) {
            done(null, user);
          } else {
            user = await prisma.user.create({
              data: newUser,
            });

            let newDeck = defaultDeck();

            let deck = await prisma.deck.create({
              data: {
                name: DeckName.classic,
                suits: newDeck.suits as Prisma.JsonValue,
                user: {
                  connect: { id: user.id },
                },
              },
            });
            let cards = buildGameDeck(deck) as Card[];
            let game = await prisma.game.create({
              data: {
                name: GameName.classic,
                deck: {
                  connect: {
                    id: deck.id,
                  },
                },
                users: {
                  connect: { id: user.id },
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

            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    const pUser = user as User;
    done(null, pUser.id);
  });

  passport.deserializeUser((id: number, done) => {
    prisma.user
      .findFirst({
        where: {
          id,
        },
      })
      .then((user) => {
        done(undefined, user);
      })
      .catch((error) => {
        done(error, undefined);
      });
  });
};
