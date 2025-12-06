import Joi from "joi";
import { requiredArray, requiredString } from "./validationHelper";

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
  imageUrl: Joi.any().optional(),
  cloudinaryId: Joi.any().optional(),
  imageBase64: Joi.string().optional(),
});
