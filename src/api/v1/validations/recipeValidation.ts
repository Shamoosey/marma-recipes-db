import Joi from "joi";
import { requiredArray, requiredNumber, requiredString } from "./validationHelper";

export const recipeSchema = Joi.object({
  id: Joi.string().optional(),
  name: requiredString("Name"),
  description: requiredString("Description"),
  servings: Joi.number().optional(),
  prepTime: Joi.number().optional(),
  cookTime: Joi.number().optional(),
  ovenTemp: Joi.number().allow(null).optional(),
  recipeTypeId: requiredString("recipeTypeId"),
  ingredients: requiredArray("ingredients"),
  steps: requiredArray("steps"),
  comments: Joi.array().optional(),
});
