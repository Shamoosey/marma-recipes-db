import "reflect-metadata";
import { Request, Response } from "express";
import * as RecipeCommentService from "../services/recipeCommentService";
import * as RecipeService from "../services/recipeService";
import { errorResponse, successResponse } from "../models/responseModel";
import { Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";
import { validateRequest } from "../middleware/validate";
import { getAuth, requireAuth } from "@clerk/express";
import * as UserService from "../services/userService";
import { findOrUpsertUser } from "../middleware/findOrUpsertUser";
import { recipeCommentSchema } from "../validations/recipeCommentValidation";

@Controller()
@UseBefore(requireAuth(), findOrUpsertUser)
export class RecipeCommentController {
  @Post("/recipe-comment")
  @UseBefore(validateRequest(recipeCommentSchema))
  async createRecipeComment(@Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId ?? "";
      const user = await UserService.getUserById(userId);
      if (user) {
        await RecipeCommentService.createRecipeComment(user.id, req.body.text, req.body.recipeId);
        const recipe = await RecipeService.getRecipeById(req.body.recipeId);
        return res.status(201).json(successResponse(recipe, "Recipe comment created succesfully"));
      } else {
        return res.status(403).json(errorResponse("Unauthorized"));
      }
    } catch (error) {
      throw error;
    }
  }
  @Delete("/recipe-comment/:id")
  async deleteRecipeComment(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId ?? "";
      const user = await UserService.getUserById(userId);
      if (user) {
        await RecipeCommentService.deleteRecipeComment(id, user.id);
        return res.status(201).json(successResponse("Recipe comment deleted succesfully"));
      } else {
        return res.status(403).json(errorResponse("Unauthorized"));
      }
    } catch (error) {
      throw error;
    }
  }
}
