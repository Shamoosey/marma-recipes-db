import { RecipeCommentDto } from "./recipeCommentDto";
import { UserDto } from "./userDto";

export interface RecipeDto {
  id?: string;
  name: string;
  description: string;
  recipeTypeId: string;

  imageUrl?: string;
  imageKey?: string;

  ingredients: string[];
  steps: string[];

  servings: number;
  prepTime: number;
  cookTime: number;
  ovenTemp?: number;
  updatedAt: Date;
  createdAt: Date;
  userId: string;
  user: UserDto;

  likeCount: number;

  comments: RecipeCommentDto[];
}
