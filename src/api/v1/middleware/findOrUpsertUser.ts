import * as userService from "../services/userService";
import { Request, Response, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";

export const findOrUpsertUser = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (userId) {
      const user = await clerkClient.users.getUser(userId);
      let backendUser = await userService.getUserById(userId);

      if (!backendUser && user.username) {
        backendUser = await userService.createUser(user.id, user.username, user.imageUrl);
      } else if (backendUser) {
        if (backendUser.username !== user.username || backendUser.imageUrl !== user.imageUrl) {
          backendUser = await userService.updateUser(user.id, user.username || backendUser.username, user.imageUrl);
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
