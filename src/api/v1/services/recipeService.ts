import prisma from "../../../../prisma/client";
import { RecipeCommentDto } from "../types/recipeCommentDto";
import { RecipeDto } from "../types/recipeDto";

const recipeInclude = {
  ingredients: true,
  steps: true,
  user: true,
  comments: {
    include: {
      user: true,
    },
  },
};

const formatRecipeData = (data: any): RecipeDto => {
  return {
    ...data,
    steps: data.steps.map((x: any) => x.description),
    ingredients: data.ingredients.map((x: any) => x.description),
    comments: data.comments.map(
      (x: any) =>
        ({
          id: x.id,
          userId: x.userId,
          username: x.user.username,
          userProfileUrl: x.user.imageUrl,
          text: x.text,
          createdAt: x.createdAt,
        } as RecipeCommentDto)
    ),
  } as RecipeDto;
};

export const fetchAllRecipes = async (): Promise<RecipeDto[]> => {
  const data = await prisma.recipe.findMany({
    include: recipeInclude,
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
      include: recipeInclude,
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

export const createRecipe = async (recipeDto: RecipeDto, user: string): Promise<RecipeDto> => {
  const { ingredients, steps, comments, updatedAt, createdAt, userId, ...recipeData } = recipeDto;

  const data = await prisma.recipe.create({
    data: {
      ...recipeData,
      userId: user,
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
    include: recipeInclude,
  });

  return formatRecipeData(data);
};

export const updateRecipe = async (id: string, recipeDto: RecipeDto): Promise<RecipeDto> => {
  const { ingredients, steps, comments, updatedAt, createdAt, ...recipeData } = recipeDto;

  const data = await prisma.recipe.update({
    where: { id },
    data: {
      ...recipeData,
      ingredients: {
        deleteMany: {},
        createMany: {
          data: ingredients.map((x) => ({ description: x })),
        },
      },
      steps: {
        deleteMany: {},
        createMany: {
          data: steps.map((x) => ({ description: x })),
        },
      },
    },
    include: recipeInclude,
  });

  return formatRecipeData(data);
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await prisma.recipe.delete({
    where: {
      id: id,
    },
  });
};

export const createRecipeComment = async (userId: string, text: string, recipeId: string): Promise<void> => {
  await prisma.recipeComment.create({
    data: {
      text,
      userId,
      recipeId,
    },
  });
};

export const deleteRecipeComment = async (id: string, userId: string): Promise<void> => {
  const comment = await prisma.recipeComment.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (comment != undefined) {
    await prisma.recipeComment.delete({
      where: {
        id: id,
      },
    });
  }
};
