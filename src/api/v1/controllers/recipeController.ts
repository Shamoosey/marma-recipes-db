import "reflect-metadata";
import { Request, Response } from "express";
import * as RecipeService from "../services/recipeService";
import { errorResponse, successResponse } from "../models/responseModel";
import { Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseBefore } from "routing-controllers";
import { recipeSchema } from "../validations/recipeValidation";
import { validateRequest } from "../middleware/validate";
import { getAuth, requireAuth } from "@clerk/express";
import * as UserService from "../services/userService";
import { findOrUpsertUser } from "../middleware/findOrUpsertUser";
import { upload } from "../middleware/fileUpload";

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
        return res.status(403).json(errorResponse("Cannot fetch user saved recipes, userId is not set"));
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
        return res.status(200).json(successResponse("User save recipe toggled succesfully"));
      } else {
        return res.status(403).json(errorResponse("Unauthorized"));
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

      if (!user) {
        return res.status(403).json(errorResponse("Unauthorized"));
      }

      const { imageBase64, ...recipeData } = req.body;
      const newRecipe = await RecipeService.createRecipe(recipeData, user.id, imageBase64);

      return res.status(201).json(successResponse(newRecipe, "Recipe created successfully"));
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
        return res.status(403).json(errorResponse("Unauthorized"));
      } else {
        const { imageBase64, ...recipeData } = req.body;
        const updatedRecipe = await RecipeService.updateRecipe(id, recipeData, imageBase64);
        return res.status(201).json(successResponse(updatedRecipe, "Recipe updated successfully"));
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
        return res.status(403).json(errorResponse("Cannot delete recipe, userId does not match"));
      } else {
        await RecipeService.deleteRecipe(id);
        return res.status(200).json(successResponse(null, "Recipe deleted succesfully"));
      }
    } catch (error) {
      throw error;
    }
  }
}
