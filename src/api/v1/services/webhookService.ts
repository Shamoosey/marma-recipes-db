import { RecipeDto } from "../types/recipeDto";

export async function sendRecipeWebhook(
  recipe: RecipeDto,
  recipeType: string,
  type: "update" | "create",
): Promise<void> {
  const maxDescriptionLength = 200;
  const truncatedDescription =
    recipe.description.length > maxDescriptionLength
      ? recipe.description.substring(0, maxDescriptionLength) + "..."
      : recipe.description;

  const embed: Record<string, unknown> = {
    title: `A Recipe has been ${type == "create" ? "Created" : "Updated"}.`,
    url: `${process.env.FRONTEND_URL}/recipes/${recipe.id}`,
    color: 0xf97316,
    fields: [
      { name: "Title", value: recipe.name, inline: true },
      { name: "Recipe Type", value: recipeType, inline: true },
      { name: "Created By", value: recipe.user.username, inline: true },
      { name: "Description", value: truncatedDescription, inline: false },
    ],
    timestamp: new Date(recipe.createdAt).toISOString(),
    footer: { text: `Recipe ${type}d` },
  };

  if (recipe.imageUrl) {
    embed.image = { url: recipe.imageUrl };
  }

  await fetch(process.env.WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });
}
