import "reflect-metadata";
import { Request, Response } from "express";
import * as RecipeTypeService from "../services/recipeTypeService";
import { successResponse } from "../models/responseModel";
import { Controller, Delete, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";
import { validateRequest } from "../middleware/validate";
import { recipeTypeSchema } from "../validations/recipeTypeValidation";
import { requireAuth } from "@clerk/express";

@Controller()
@UseBefore(requireAuth())
export class RecipeTypeController {
  @Get("/recipeTypes")
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const recipes = await RecipeTypeService.fetchAllRecipeTypes();
      return res.status(200).json(successResponse(recipes, "RecipeTypes retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }
  // @Post("/recipeTypes/create")
  // @UseBefore(validateRequest(recipeTypeSchema))
  // async createRecipeType(@Req() req: Request, @Res() res: Response) {
  //   try {
  //     const newRecipe = await RecipeTypeService.createRecipeType(req.body);
  //     return res.status(201).json(successResponse(newRecipe, "RecipeType created succesfully"));
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Put("/recipeTypes/update/:id")
  // @UseBefore(validateRequest(recipeTypeSchema))
  // async updateRecipeType(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
  //   try {
  //     const updatedRecipe = await RecipeTypeService.updateRecipeType(id, req.body);
  //     return res.status(201).json(successResponse(updatedRecipe, "RecipeType updated succesfully"));
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @Delete("/recipeTypes/delete/:id")
  // async deleteRecipeType(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
  //   try {
  //     await RecipeTypeService.deleteRecipeType(id);
  //     return res.status(200).json(successResponse(null, "RecipeType deleted succesfully"));
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
