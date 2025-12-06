import prisma from "../../../../prisma/client";

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
