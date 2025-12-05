import "reflect-metadata";
import { Request, Response } from "express";
import * as RecipeService from "../services/recipeService";
import { errorResponse, successResponse } from "../models/responseModel";
import { Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";
import { recipeSchema } from "../validations/recipeValidation";
import { validateRequest } from "../middleware/validate";
import { getAuth, requireAuth } from "@clerk/express";
import * as UserService from "../services/userService";
import { findOrUpsertUser } from "../middleware/findOrUpsertUser";
import { recipeCommentSchema } from "../validations/recipeCommentValidation";

@Controller()
@UseBefore(requireAuth(), findOrUpsertUser)
export class RecipeController {
  @Get("/recipes")
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const recipes = await RecipeService.fetchAllRecipes();
      return res.status(200).json(successResponse(recipes, "Recipes retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Get("/recipes/:id")
  async getById(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const recipe = await RecipeService.getRecipeById(id);
      if (recipe) {
        return res.status(200).json(successResponse(recipe, "Recipe retrieved successfully"));
      } else {
        return res.status(404).json(errorResponse("Recipe not found"));
      }
    } catch (error) {
      throw error;
    }
  }

  @Get("/user-saved-recipes")
  async getAllUserSavedRecipes(@Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId;
      if (!userId) {
        res.status(403).json(errorResponse("Cannot fetch user saved recipes, userId is not set"));
      } else {
        const recipeIds = await RecipeService.fetchUserSavedRecipeIds(userId);
        return res.status(200).json(successResponse(recipeIds, "User saved RecipeIds retrieved successfully"));
      }
    } catch (error) {
      throw error;
    }
  }

  @Post("/user-saved-recipes/:id")
  async toggleUserSavedRecipe(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId ?? "";
      const user = await UserService.getUserById(userId);
      if (user) {
        await RecipeService.toggleUserSavedRecipe(id, user.id);
        res.status(200).json(successResponse("User save recipe toggled succesfully"));
      } else {
        res.status(403).json(errorResponse("Unauthorized"));
      }
    } catch (error) {
      throw error;
    }
  }

  @Post("/recipes")
  @UseBefore(validateRequest(recipeSchema))
  async createRecipe(@Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId ?? "";
      const user = await UserService.getUserById(userId);
      if (user) {
        const newRecipe = await RecipeService.createRecipe(req.body, user.id);
        res.status(201).json(successResponse(newRecipe, "Recipe created succesfully"));
      } else {
        res.status(403).json(errorResponse("Unauthorized"));
      }
    } catch (error) {
      throw error;
    }
  }

  @Put("/recipes/:id")
  @UseBefore(validateRequest(recipeSchema))
  async updateRecipe(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId;
      const recipe = await RecipeService.getRecipeById(id);
      if (recipe?.userId != userId) {
        res.status(403).json(errorResponse("Unauthorized"));
      } else {
        const updatedRecipe = await RecipeService.updateRecipe(id, req.body);
        res.status(201).json(successResponse(updatedRecipe, "Recipe updated succesfully"));
      }
    } catch (error) {
      throw error;
    }
  }

  @Delete("/recipes/:id")
  async deleteRecipe(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId;
      const recipe = await RecipeService.getRecipeById(id);
      if (userId != recipe?.userId) {
        res.status(403).json(errorResponse("Cannot delete recipe, userId does not match"));
      } else {
        await RecipeService.deleteRecipe(id);
        res.status(200).json(successResponse(null, "Recipe deleted succesfully"));
      }
    } catch (error) {
      throw error;
    }
  }

  @Post("/recipe-comment")
  @UseBefore(validateRequest(recipeCommentSchema))
  async createRecipeComment(@Req() req: Request, @Res() res: Response) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId ?? "";
      const user = await UserService.getUserById(userId);
      if (user) {
        await RecipeService.createRecipeComment(user.id, req.body.text, req.body.recipeId);
        const recipe = await RecipeService.getRecipeById(req.body.recipeId);
        res.status(201).json(successResponse(recipe, "Recipe comment created succesfully"));
      } else {
        res.status(403).json(errorResponse("Unauthorized"));
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
        await RecipeService.deleteRecipeComment(id, user.id);
        res.status(201).json(successResponse("Recipe comment deleted succesfully"));
      } else {
        res.status(403).json(errorResponse("Unauthorized"));
      }
    } catch (error) {
      throw error;
    }
  }
}
