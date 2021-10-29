import express, { Response } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import { gameRouter } from "./routes/game";
import passport from "passport";
import cors from "cors";
import { configurePassport } from "../config/configure-passport";
import { ensureUser } from "./middleware/auth";

import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { deckRouter } from "./routes/deck";

declare module "express-session" {
  interface SessionUser {
    user: number;
  }

  interface SessionData {
    passport: SessionUser;
    redirect: string;
  }
}

dotenv.config();
const pgSession = connectPg(session);
const prisma = new PrismaClient();

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});
// io.to(['a']).emit('asd')

configurePassport(passport);
app.use(cors({ origin: ["http://localhost:4200"], credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "This is a secret for the session 324234252rkm",
    resave: true,
    saveUninitialized: false,
    store: new pgSession({
      tableName: "Session",
    }),
  })
);
app.use(passport.initialize());
app.use(ensureUser);
app.use("/decks", deckRouter());
app.use("/games", gameRouter(io));
app.use("/auth", authRouter());
app.get("/", (req, res) => {
  res.sendStatus(200);
});

io.on("connection", async (socket) => {
  const req = socket.handshake.query;

  let game = await prisma.game.findFirst({
    where: {
      uuid: req.room as string,
    },
  });

  console.log(`joined game room ${game?.name}`);
  socket.rooms.forEach((room) => {
    socket.leave(room);
  });
  socket.join(req.room as string);

  socket.on("move", async (state) => {
    socket.to(req.room as string).emit("nextSceneMove", state);
  });
});

const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});
