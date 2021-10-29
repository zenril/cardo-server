import { PrismaClient } from ".prisma/client";
import { NextFunction, Request, Response } from "express";
const prisma = new PrismaClient();

export const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
};

export const ensureGuest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/log");
  }
};

export const ensureUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.passport?.user) {
    const userDelegate = await prisma.user.findFirst({
      where: {
        id: req.session.passport?.user,
      },
    });

    res.locals.user = userDelegate;
  }
  next();
};
