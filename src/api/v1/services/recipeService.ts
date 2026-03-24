import prisma from "../../../../prisma/client";
import { RecipeCommentDto } from "../types/recipeCommentDto";
import { RecipeDto } from "../types/recipeDto";
import { CloudinaryService } from "./cloudinaryService";

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

const handleImageUpload = async (imageBase64?: string): Promise<{ imageUrl?: string; cloudinaryId?: string }> => {
  if (!imageBase64) {
    return {};
  }

  const result = await CloudinaryService.uploadImage(imageBase64, "recipes");
  return {
    imageUrl: result.secure_url,
    cloudinaryId: result.public_id,
  };
};

const formatRecipeData = (data: any): RecipeDto => {
  return {
    ...data,
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

export const createRecipe = async (
  recipeDto: RecipeDto,
  createUserId: string,
  imageBase64?: string,
): Promise<RecipeDto> => {
  const { ingredients, steps, comments, updatedAt, createdAt, userId, user, imageUrl, cloudinaryId, ...recipeData } =
    recipeDto;

  const { imageUrl: uploadedImageUrl, cloudinaryId: uploadedCloudinaryId } = await handleImageUpload(imageBase64);

  const data = await prisma.recipe.create({
    data: {
      ...recipeData,
      userId: createUserId,
      imageUrl: uploadedImageUrl,
      cloudinaryId: uploadedCloudinaryId,
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

export const updateRecipe = async (id: string, recipeDto: RecipeDto, imageBase64?: string): Promise<RecipeDto> => {
  const { ingredients, steps, comments, updatedAt, createdAt, imageUrl, user, cloudinaryId, ...recipeData } = recipeDto;

  const existingRecipe = await prisma.recipe.findUnique({ where: { id } });

  let uploadedImageUrl = imageUrl;
  let uploadedCloudinaryId = existingRecipe?.cloudinaryId;

  if (existingRecipe?.cloudinaryId && !imageUrl) {
    await CloudinaryService.deleteImage(existingRecipe.cloudinaryId);
  }
  if (imageBase64) {
    const result = await handleImageUpload(imageBase64);
    uploadedImageUrl = result.imageUrl;
    uploadedCloudinaryId = result.cloudinaryId;
  }
  const data = await prisma.recipe.update({
    where: { id },
    data: {
      ...recipeData,
      ...(uploadedCloudinaryId && { cloudinaryId: uploadedCloudinaryId }),
      imageUrl: uploadedImageUrl ?? null,
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
  const existingRecipe = await prisma.recipe.findUnique({ where: { id } });

  if (existingRecipe?.cloudinaryId) {
    await CloudinaryService.deleteImage(existingRecipe.cloudinaryId);
  }

  await prisma.recipe.delete({
    where: {
      id: id,
    },
  });
};
