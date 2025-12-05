import Joi from "joi";
import { requiredArray, requiredNumber, requiredString } from "./validationHelper";

export const recipeSchema = Joi.object({
  id: Joi.string().optional(),
  name: requiredString("Name"),
  description: requiredString("Description"),
  servings: Joi.number().allow(null).optional(),
  prepTime: Joi.number().allow(null).optional(),
  cookTime: Joi.number().allow(null).optional(),
  ovenTemp: Joi.number().allow(null).optional(),
  recipeTypeId: requiredString("recipeTypeId"),
  ingredients: requiredArray("ingredients"),
  steps: requiredArray("steps"),
  comments: Joi.array().optional(),
});
