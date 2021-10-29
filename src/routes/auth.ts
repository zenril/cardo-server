import { PrismaClient, User } from "@prisma/client";
import { Request, Response, Router } from "express";
import passport from "passport";

const prisma = new PrismaClient();

export interface UserResponse extends Response {
  locals: {
    user: Partial<User>;
  };
}

export interface UserRequest extends Request {
  body: Partial<User>;
}

const authRouter = () => {
  const router = Router();

  router.get(
    "/google",
    (req, res, next) => {
      req.session.redirect = req.query.redirect as string;
      next();
    },
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect(req.session.redirect || "http://localhost:4200/");
    }
  );

  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("http://localhost:4200/");
  });

  router.get("/user", async (req: UserRequest, res) => {
    return res.json(res.locals.user);
  });

  router.put("/user", async (req: UserRequest, res) => {
    let data = req.body;

    if (!data) return res.sendStatus(400);
    if (data.displayName && data.displayName.length < 3) {
      return res.sendStatus(406);
    }
    if (data.email) return res.sendStatus(406);
    if (data.id) return res.sendStatus(406);
    if (data.uuid) return res.sendStatus(406);

    let user = await prisma.user.update({
      where: {
        id: res.locals.user.id,
      },
      data,
    });

    return res.json(user);
  });

  return router;
};

export { authRouter };
