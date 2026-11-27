import prisma from "../../../../prisma/client";
import { RecipeCommentDto } from "../types/recipeCommentDto";
import { RecipeDto } from "../types/recipeDto";
import * as UploadService from "./uploadService";

const recipeInclude = {
  ingredients: true,
  steps: true,
  user: true,
  userSavedRecipes: true,
  comments: {
    include: {
      user: true,
    },
  },
};

const removeStoredImage = async (imageKey?: string | null, imageUrl?: string | null): Promise<void> => {
  if (!imageKey) return;

  await UploadService.deleteImage(imageKey);
};

const formatRecipeData = (data: any): RecipeDto => {
  const { userSavedRecipes, ...recipeData } = data;

  return {
    ...recipeData,
    steps: data.steps.map((x: any) => x.description),
    ingredients: data.ingredients.map((x: any) => x.description),
    likeCount: data.userSavedRecipes.length,
    comments: data.comments.map(
      (x: any) =>
        ({
          id: x.id,
          userId: x.userId,
          username: x.user.username,
          userProfileUrl: x.user.imageUrl,
          text: x.text,
          createdAt: x.createdAt,
        }) as RecipeCommentDto,
    ),
  } as RecipeDto;
};

export const fetchAllRecipes = async (): Promise<RecipeDto[]> => {
  const data = await prisma.recipe.findMany({
    include: {
      ...recipeInclude,
    },
  });

  return data.map(formatRecipeData);
};

export const fetchUserSavedRecipeIds = async (userId: string): Promise<string[]> => {
  const userSavedRecipes = await prisma.userSavedRecipe.findMany({
    where: {
      userId: userId,
    },
  });

  const data = await prisma.recipe.findMany({
    where: {
      id: { in: userSavedRecipes.map((x) => x.recipeId) },
    },
  });

  return data.map((x) => x.id);
};

export const getRecipeById = async (id: string): Promise<RecipeDto | null> => {
  try {
    const data = await prisma.recipe.findUnique({
      where: {
        id: id,
      },
      include: {
        ...recipeInclude,
      },
    });

    if (!data) {
      return null;
    }

    return formatRecipeData(data);
  } catch (error) {
    throw new Error(`Failed to fetch Recipe with id ${id}`);
  }
};

export const toggleUserSavedRecipe = async (recipeId: string, userId: string): Promise<void> => {
  const existingRecord = await prisma.userSavedRecipe.findFirst({
    where: {
      recipeId: recipeId,
      userId: userId,
    },
  });

  if (existingRecord) {
    await prisma.userSavedRecipe.delete({
      where: {
        id: existingRecord.id,
      },
    });
  } else {
    await prisma.userSavedRecipe.create({
      data: {
        recipeId,
        userId,
      },
    });
  }
};

export const createRecipe = async (recipeDto: RecipeDto, createUserId: string): Promise<RecipeDto> => {
  const {
    id,
    ingredients,
    steps,
    comments,
    likeCount,
    updatedAt,
    createdAt,
    userId,
    user,
    imageUrl,
    imageKey,
    ...recipeData
  } = recipeDto;

  const image = UploadService.resolveImage(createUserId, imageKey);

  const data = await prisma.recipe.create({
    data: {
      ...recipeData,
      ...image,
      userId: createUserId,
      ingredients: {
        createMany: {
          data: ingredients.map((description) => ({ description })),
        },
      },
      steps: {
        createMany: {
          data: steps.map((description) => ({ description })),
        },
      },
    },
    include: { ...recipeInclude, recipeType: true },
  });
  return formatRecipeData(data);
};

export const updateRecipe = async (id: string, recipeDto: RecipeDto): Promise<RecipeDto> => {
  const {
    id: _id,
    ingredients,
    steps,
    comments,
    likeCount,
    updatedAt,
    createdAt,
    userId,
    user,
    imageUrl,
    imageKey,
    ...recipeData
  } = recipeDto;

  const existing = await prisma.recipe.findUniqueOrThrow({ where: { id } });

  // Unchanged images (including old Cloudinary ones) are left as they are
  const imageChanged = (imageKey ?? null) !== existing.imageKey;
  const image = imageChanged ? UploadService.resolveImage(existing.userId, imageKey) : {};

  const data = await prisma.recipe.update({
    where: { id },
    data: {
      ...recipeData,
      ...image,
      ingredients: {
        deleteMany: {},
        createMany: {
          data: ingredients.map((description) => ({ description })),
        },
      },
      steps: {
        deleteMany: {},
        createMany: {
          data: steps.map((description) => ({ description })),
        },
      },
    },
    include: { ...recipeInclude, recipeType: true },
  });

  const { recipeType, ...updatedRecipe } = data;
  return formatRecipeData(updatedRecipe);
};

export const deleteRecipe = async (id: string): Promise<void> => {
  const deleted = await prisma.recipe.delete({ where: { id } });
  await removeStoredImage(deleted.imageKey, deleted.imageUrl);
};
