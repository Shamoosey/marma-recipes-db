import prisma from "./client";

// this method will add default values to the database
// IT WILL CLEAR THE DB WHEN INVOKED
// see https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
async function main() {
  await seedData();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function seedData() {
  // clear tables
  await prisma.userSavedRecipe.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipeStep.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.recipeType.deleteMany();
  await prisma.user.deleteMany();

  // Create 5 fake users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "user_1",
        username: "chef_mario",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_2",
        username: "baker_emma",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_3",
        username: "foodie_alex",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_4",
        username: "cook_sarah",
      },
    }),
    prisma.user.create({
      data: {
        id: "user_5",
        username: "grill_master_jake",
      },
    }),
  ]);
  console.log("Created 5 users");

  // Helper function to get random user
  const getRandomUser = () => users[Math.floor(Math.random() * users.length)];

  // Create recipe types
  const breakfast = await prisma.recipeType.create({
    data: {
      name: "Breakfast",
      description: "Morning meals and brunch dishes",
    },
  });
  const lunch = await prisma.recipeType.create({
    data: {
      name: "Lunch",
      description: "Midday meals and light dishes",
    },
  });
  const dinner = await prisma.recipeType.create({
    data: {
      name: "Dinner",
      description: "Evening meals and main courses",
    },
  });
  const dessert = await prisma.recipeType.create({
    data: {
      name: "Dessert",
      description: "Sweet treats and after-dinner delights",
    },
  });
  const beverage = await prisma.recipeType.create({
    data: {
      name: "Beverage",
      description: "Drinks and refreshments",
    },
  });
  console.log("Created recipe types");

  // Create recipes with nested ingredients and steps, assigned to random users
  await prisma.recipe.create({
    data: {
      name: "Chocolate Chip Cookies",
      description:
        "The ultimate soft and chewy chocolate chip cookies with perfectly crispy edges and gooey centers. These bakery-style cookies are loaded with chocolate chips and have that perfect balance of brown butter flavor and vanilla sweetness that makes them irresistible.",
      servings: 36,
      prepTime: 15,
      cookTime: 10,
      ovenTemp: 375,
      recipeTypeId: dessert.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2¼ cups all-purpose flour" },
          { description: "1 cup softened butter" },
          { description: "¾ cup brown sugar" },
          { description: "¾ cup white sugar" },
          { description: "2 large eggs" },
          { description: "2 tsp vanilla extract" },
          { description: "1 tsp baking soda" },
          { description: "1 tsp salt" },
          { description: "2 cups chocolate chips" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Preheat your oven to 375°F (190°C) and line two large baking sheets with parchment paper or silicone baking mats.",
          },
          {
            description:
              "In a large mixing bowl, cream together the softened butter, brown sugar, and white sugar using an electric mixer on medium speed for 3-4 minutes until the mixture is light and fluffy.",
          },
          {
            description:
              "Beat in the eggs one at a time, ensuring each is fully incorporated before adding the next. Mix in the vanilla extract until well combined.",
          },
          {
            description:
              "In a separate bowl, whisk together the flour, baking soda, and salt. Gradually add the dry ingredients to the wet ingredients, mixing on low speed until just combined. Don't overmix.",
          },
          {
            description:
              "Gently fold in the chocolate chips using a wooden spoon or spatula, distributing them evenly throughout the dough.",
          },
          {
            description:
              "Using a cookie scoop or tablespoon, drop rounded spoonfuls of dough onto the prepared baking sheets, spacing them about 2 inches apart to allow for spreading.",
          },
          {
            description:
              "Bake for 9-11 minutes until the edges are golden brown but the centers still look slightly underbaked. The cookies will continue cooking on the hot pan after removal.",
          },
          {
            description:
              "Let cookies cool on the baking sheet for 5 minutes before transferring to a wire rack to cool completely.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Chicken Caesar Salad",
      description:
        "A restaurant-quality Caesar salad featuring perfectly grilled chicken breast, crisp romaine lettuce, homemade croutons, and fresh Parmesan cheese, all tossed in a creamy, tangy Caesar dressing. This protein-packed salad makes for a satisfying and healthy meal.",
      servings: 4,
      prepTime: 10,
      cookTime: 15,
      ovenTemp: null,
      recipeTypeId: lunch.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2 chicken breasts (6-8oz each)" },
          { description: "2 heads romaine lettuce, chopped" },
          { description: "½ cup freshly grated parmesan cheese" },
          { description: "1 cup homemade or store-bought croutons" },
          { description: "½ cup caesar dressing" },
          { description: "2 tbsp olive oil" },
          { description: "Salt and freshly ground black pepper to taste" },
          { description: "1 tsp garlic powder" },
          { description: "½ tsp paprika" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Remove chicken from refrigerator 15 minutes before cooking to bring to room temperature. Pat dry with paper towels and season both sides generously with salt, pepper, garlic powder, and paprika.",
          },
          {
            description:
              "Preheat grill or grill pan to medium-high heat. Brush chicken breasts with olive oil to prevent sticking.",
          },
          {
            description:
              "Grill chicken for 6-7 minutes on the first side without moving it, then flip and cook for another 6-7 minutes until internal temperature reaches 165°F (74°C). Look for nice grill marks and clear juices.",
          },
          {
            description:
              "Transfer chicken to a cutting board and let rest for 5 minutes to allow juices to redistribute, then slice diagonally into ½-inch thick strips.",
          },
          {
            description:
              "While chicken rests, wash and thoroughly dry the romaine lettuce, then chop into bite-sized pieces and place in a large salad bowl.",
          },
          {
            description:
              "Drizzle the caesar dressing over the lettuce and toss well to coat every leaf. Add half the Parmesan cheese and toss again.",
          },
          {
            description:
              "Divide the dressed salad among 4 plates, top each with sliced chicken, remaining Parmesan cheese, and croutons. Serve immediately with lemon wedges if desired.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Pancakes",
      description:
        "Light, fluffy buttermilk pancakes that are golden brown on the outside and incredibly tender on the inside. These classic American-style pancakes have the perfect balance of sweetness and tang from the buttermilk, making them ideal for weekend breakfast or brunch with maple syrup and fresh berries.",
      servings: 4,
      prepTime: 5,
      cookTime: 15,
      ovenTemp: null,
      recipeTypeId: breakfast.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2 cups all-purpose flour" },
          { description: "2 tbsp granulated sugar" },
          { description: "2 tsp baking powder" },
          { description: "1 tsp salt" },
          { description: "2 large eggs" },
          { description: "1¾ cups buttermilk" },
          { description: "¼ cup melted butter, slightly cooled" },
          { description: "1 tsp vanilla extract" },
        ],
      },
      steps: {
        create: [
          {
            description: "In a large bowl, whisk together flour, sugar, baking powder, and salt.",
          },
          {
            description: "In a separate bowl, beat eggs then whisk in buttermilk, melted butter, and vanilla extract.",
          },
          {
            description:
              "Pour wet ingredients into dry ingredients and stir until just combined. Don't overmix - lumps are okay.",
          },
          {
            description:
              "Heat a griddle or large skillet over medium heat and lightly grease with butter or cooking spray.",
          },
          {
            description:
              "Pour ¼ cup of batter onto the griddle for each pancake. Cook until bubbles form on surface and edges look dry, about 2-3 minutes.",
          },
          {
            description: "Flip and cook for another 2-3 minutes until golden brown and cooked through.",
          },
          {
            description: "Keep finished pancakes warm in a 200°F oven while cooking remaining batter.",
          },
          {
            description: "Serve hot with butter, maple syrup, and fresh berries.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Caprese Salad",
      description:
        "A simple yet elegant Italian salad showcasing the perfect harmony of ripe tomatoes, fresh mozzarella, and aromatic basil leaves. Drizzled with high-quality olive oil and balsamic glaze, this colorful salad celebrates the beauty of fresh, seasonal ingredients.",
      servings: 4,
      prepTime: 20,
      cookTime: 0,
      ovenTemp: null,
      recipeTypeId: lunch.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "4 large ripe tomatoes, sliced 1/4 inch thick" },
          { description: "1 lb fresh mozzarella, sliced 1/4 inch thick" },
          { description: "1/2 cup fresh basil leaves" },
          { description: "1/4 cup extra virgin olive oil" },
          { description: "2 tbsp balsamic glaze" },
          { description: "Sea salt and freshly cracked black pepper" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Choose the ripest, most flavorful tomatoes available and slice them into 1/4-inch thick rounds. Lay on paper towels and sprinkle lightly with salt.",
          },
          {
            description: "Let tomatoes sit for 10 minutes to draw out excess moisture, then pat dry with paper towels.",
          },
          {
            description: "Slice fresh mozzarella into 1/4-inch thick rounds, similar in size to the tomato slices.",
          },
          {
            description:
              "On a large platter or individual plates, alternate slices of tomato and mozzarella in an overlapping pattern.",
          },
          {
            description:
              "Tuck fresh basil leaves between and around the tomato and mozzarella slices for color and aroma.",
          },
          {
            description:
              "Drizzle the extra virgin olive oil evenly over the entire salad, allowing it to pool slightly.",
          },
          {
            description: "Follow with a light drizzle of balsamic glaze in a decorative pattern.",
          },
          {
            description: "Finish with a sprinkle of sea salt and freshly cracked black pepper to taste.",
          },
          {
            description:
              "Let the salad sit at room temperature for 15-20 minutes before serving to allow flavors to meld.",
          },
          { description: "Serve with crusty Italian bread for a complete light meal." },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Chicken Noodle Soup",
      description:
        "A comforting, homemade chicken noodle soup with tender shredded chicken, hearty vegetables, and perfectly cooked egg noodles in a rich, golden broth. This soul-warming classic is perfect for cold days or when you need a bowl of comfort food.",
      servings: 8,
      prepTime: 20,
      cookTime: 90,
      ovenTemp: null,
      recipeTypeId: dinner.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "1 whole chicken (3-4 lbs)" },
          { description: "12 cups water" },
          { description: "2 bay leaves" },
          { description: "1 large onion, diced" },
          { description: "3 carrots, sliced" },
          { description: "3 celery stalks, diced" },
          { description: "3 cloves garlic, minced" },
          { description: "8 oz wide egg noodles" },
          { description: "2 tbsp olive oil" },
          { description: "1 tsp dried thyme" },
          { description: "Salt and pepper to taste" },
          { description: "Fresh parsley for garnish" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Place whole chicken in a large pot with water and bay leaves. Bring to a boil, then reduce heat and simmer for 1 hour until chicken is tender.",
          },
          {
            description:
              "Remove chicken from pot and let cool. Strain the broth through a fine-mesh sieve and return to pot. Discard solids.",
          },
          {
            description:
              "When chicken is cool enough to handle, remove and discard skin and bones. Shred meat into bite-sized pieces and set aside.",
          },
          {
            description:
              "Heat olive oil in the same pot over medium heat. Add diced onion, carrots, and celery. Cook for 5-7 minutes until vegetables begin to soften.",
          },
          {
            description: "Add minced garlic and thyme, cooking for another minute until fragrant.",
          },
          {
            description: "Pour the strained chicken broth back into the pot with vegetables and bring to a boil.",
          },
          {
            description: "Add egg noodles and cook according to package directions until tender, usually 8-10 minutes.",
          },
          {
            description: "Return shredded chicken to the pot and simmer for 5 minutes to heat through.",
          },
          {
            description: "Season with salt and pepper to taste. Remove bay leaves if any remain.",
          },
          {
            description:
              "Ladle into bowls and garnish with fresh chopped parsley. Serve hot with crackers or crusty bread.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Garlic Bread",
      description:
        "Crispy, golden garlic bread with a perfect balance of butter, garlic, and herbs. This classic side dish features a crunchy exterior and soft, flavorful interior that pairs beautifully with pasta dishes, soups, or can be enjoyed on its own as an appetizer.",
      servings: 8,
      prepTime: 10,
      cookTime: 12,
      ovenTemp: 425,
      recipeTypeId: lunch.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "1 large French bread loaf" },
          { description: "1/2 cup butter, softened" },
          { description: "4 cloves garlic, minced" },
          { description: "2 tbsp fresh parsley, chopped" },
          { description: "1/4 tsp salt" },
          { description: "1/4 cup grated Parmesan cheese" },
          { description: "1/4 tsp red pepper flakes (optional)" },
        ],
      },
      steps: {
        create: [
          {
            description: "Preheat oven to 425°F (220°C) and line a baking sheet with parchment paper.",
          },
          {
            description:
              "Using a sharp serrated knife, slice the French bread loaf in half lengthwise, creating two long pieces.",
          },
          {
            description:
              "In a medium bowl, combine softened butter, minced garlic, chopped parsley, salt, and red pepper flakes if using. Mix until well combined and creamy.",
          },
          {
            description:
              "Spread the garlic butter mixture evenly over both cut sides of the bread, making sure to reach all the way to the edges.",
          },
          {
            description: "Sprinkle grated Parmesan cheese evenly over the buttered surfaces.",
          },
          { description: "Place bread cut-side up on the prepared baking sheet." },
          {
            description: "Bake for 10-12 minutes until edges are golden brown and the surface is bubbly and fragrant.",
          },
          {
            description:
              "For extra crispiness, broil for 1-2 minutes at the end, watching carefully to prevent burning.",
          },
          {
            description:
              "Remove from oven and let cool for 2-3 minutes before slicing into individual portions with a sharp knife.",
          },
          {
            description: "Serve immediately while hot and crispy for the best texture and flavor.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Beef Tacos",
      description:
        "Authentic, flavorful beef tacos with perfectly seasoned ground beef, fresh toppings, and warm tortillas. These street-style tacos feature a blend of Mexican spices and can be customized with your favorite toppings for a delicious, satisfying meal.",
      servings: 4,
      prepTime: 15,
      cookTime: 20,
      ovenTemp: null,
      recipeTypeId: dinner.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "1 lb ground beef (80/20)" },
          { description: "1 onion, diced" },
          { description: "3 cloves garlic, minced" },
          { description: "1 tbsp chili powder" },
          { description: "1 tsp ground cumin" },
          { description: "1 tsp paprika" },
          { description: "1/2 tsp oregano" },
          { description: "1/2 tsp salt" },
          { description: "1/4 tsp black pepper" },
          { description: "1/4 tsp cayenne pepper" },
          { description: "1/2 cup beef broth" },
          { description: "8 small corn or flour tortillas" },
          {
            description: "Toppings: diced tomatoes, lettuce, cheese, sour cream, salsa, cilantro, lime wedges",
          },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Heat a large skillet over medium-high heat. Add ground beef and cook, breaking it apart with a wooden spoon, until browned and cooked through, about 6-8 minutes.",
          },
          {
            description: "Add diced onion to the beef and cook for 4-5 minutes until softened and translucent.",
          },
          {
            description: "Add minced garlic and cook for another minute until fragrant.",
          },
          {
            description:
              "Stir in chili powder, cumin, paprika, oregano, salt, black pepper, and cayenne pepper. Cook for 1-2 minutes until spices are aromatic.",
          },
          {
            description:
              "Pour in beef broth and simmer for 5-7 minutes, stirring occasionally, until liquid has mostly evaporated and flavors have melded.",
          },
          {
            description: "Taste and adjust seasoning with additional salt, pepper, or spices as needed.",
          },
          {
            description:
              "While beef finishes cooking, warm tortillas in a dry skillet for 30 seconds per side, or wrap in damp paper towels and microwave for 30 seconds.",
          },
          { description: "Keep tortillas warm by wrapping in a clean kitchen towel." },
          {
            description:
              "Prepare all toppings by dicing tomatoes, shredding lettuce and cheese, and arranging in serving bowls.",
          },
          {
            description:
              "Serve the seasoned beef with warm tortillas and all desired toppings, allowing everyone to build their own tacos.",
          },
          {
            description: "Provide lime wedges for squeezing over finished tacos for extra brightness and flavor.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Apple Pie",
      description:
        "A classic American apple pie with tender, spiced apples encased in a flaky, golden pastry crust. This timeless dessert features a perfect balance of sweet and tart apples with cinnamon and nutmeg, creating the ultimate comfort food dessert that's perfect for any occasion.",
      servings: 8,
      prepTime: 30,
      cookTime: 55,
      ovenTemp: 425,
      recipeTypeId: dessert.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2 pie crusts (homemade or store-bought)" },
          { description: "6 large Granny Smith apples, peeled and sliced" },
          { description: "2 large Honeycrisp apples, peeled and sliced" },
          { description: "3/4 cup granulated sugar" },
          { description: "1/4 cup brown sugar" },
          { description: "2 tbsp all-purpose flour" },
          { description: "1 tsp ground cinnamon" },
          { description: "1/4 tsp ground nutmeg" },
          { description: "1/4 tsp salt" },
          { description: "2 tbsp butter, cut into small pieces" },
          { description: "1 egg, beaten for wash" },
          { description: "1 tbsp coarse sugar for sprinkling" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Preheat oven to 425°F (220°C). Roll out bottom pie crust and place in a 9-inch pie dish, trimming edges to 1-inch overhang.",
          },
          {
            description:
              "In a large bowl, combine sliced apples with granulated sugar, brown sugar, flour, cinnamon, nutmeg, and salt. Toss until apples are evenly coated.",
          },
          {
            description: "Let the apple mixture sit for 15 minutes to allow juices to develop, then toss again.",
          },
          {
            description:
              "Arrange the seasoned apples in the prepared pie crust, mounding them slightly in the center. Dot with small pieces of butter.",
          },
          {
            description:
              "Roll out the top pie crust and place over the filling. Trim to 1-inch overhang and crimp edges to seal.",
          },
          {
            description: "Cut 4-5 small slits in the top crust to allow steam to escape during baking.",
          },
          {
            description:
              "Brush the top crust with beaten egg and sprinkle with coarse sugar for a golden, sparkly finish.",
          },
          {
            description: "Place pie on a baking sheet to catch any drips and bake for 15 minutes at 425°F.",
          },
          {
            description:
              "Reduce temperature to 375°F (190°C) and continue baking for 35-40 minutes until crust is golden brown and filling is bubbling.",
          },
          {
            description:
              "If edges brown too quickly, cover with strips of aluminum foil during the last 15 minutes of baking.",
          },
          {
            description: "Cool on a wire rack for at least 2 hours before serving to allow filling to set properly.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Vegetable Soup",
      description:
        "A hearty, nutritious vegetable soup packed with fresh seasonal vegetables in a flavorful herb-infused broth. This healthy, comforting soup is perfect for using up garden vegetables and provides a warming, satisfying meal that's both filling and wholesome.",
      servings: 6,
      prepTime: 20,
      cookTime: 35,
      ovenTemp: null,
      recipeTypeId: dinner.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2 tbsp olive oil" },
          { description: "1 large onion, diced" },
          { description: "3 carrots, diced" },
          { description: "3 celery stalks, diced" },
          { description: "2 cloves garlic, minced" },
          { description: "1 can diced tomatoes (14.5oz)" },
          { description: "6 cups vegetable broth" },
          { description: "2 cups green beans, chopped" },
          { description: "2 cups corn kernels" },
          { description: "1 zucchini, diced" },
          { description: "1 tsp dried oregano" },
          { description: "1 tsp dried basil" },
          { description: "1/2 tsp thyme" },
          { description: "Salt and pepper to taste" },
          { description: "Fresh parsley for garnish" },
        ],
      },
      steps: {
        create: [
          {
            description: "Heat olive oil in a large pot or Dutch oven over medium heat.",
          },
          {
            description:
              "Add diced onion, carrots, and celery. Cook for 5-7 minutes, stirring occasionally, until vegetables begin to soften.",
          },
          {
            description: "Add minced garlic and cook for another minute until fragrant.",
          },
          {
            description:
              "Stir in diced tomatoes with their juices, scraping up any browned bits from the bottom of the pot.",
          },
          {
            description: "Pour in vegetable broth and add oregano, basil, and thyme. Bring mixture to a boil.",
          },
          {
            description: "Add green beans and corn to the pot. Reduce heat to medium-low and simmer for 15 minutes.",
          },
          {
            description:
              "Add diced zucchini and continue simmering for another 10-15 minutes until all vegetables are tender.",
          },
          {
            description: "Season with salt and pepper to taste, adjusting herbs as needed.",
          },
          {
            description: "Remove from heat and let stand for 5 minutes to allow flavors to meld.",
          },
          { description: "Ladle into bowls and garnish with fresh chopped parsley." },
          {
            description: "Serve hot with crusty bread or crackers for a complete, satisfying meal.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Lemonade",
      description:
        "Fresh, tangy homemade lemonade with the perfect balance of sweet and tart flavors. Made with real lemon juice and simple syrup, this refreshing beverage is ideal for hot summer days, picnics, or any time you need a bright, thirst-quenching drink.",
      servings: 6,
      prepTime: 15,
      cookTime: 5,
      ovenTemp: null,
      recipeTypeId: beverage.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "1 cup fresh lemon juice (about 6-8 lemons)" },
          { description: "1 cup granulated sugar" },
          { description: "1 cup water for simple syrup" },
          { description: "4-5 cups cold water" },
          { description: "Ice cubes" },
          { description: "Lemon slices for garnish" },
          { description: "Fresh mint sprigs (optional)" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Roll lemons on the counter while pressing down to help release more juice, then cut in half and juice them. Strain out seeds but leave pulp for texture.",
          },
          {
            description:
              "In a small saucepan, combine 1 cup sugar with 1 cup water. Bring to a boil, stirring until sugar completely dissolves.",
          },
          {
            description: "Remove from heat and let the simple syrup cool to room temperature, about 30 minutes.",
          },
          {
            description:
              "In a large pitcher, combine the fresh lemon juice with the cooled simple syrup and stir well.",
          },
          {
            description:
              "Add 4 cups of cold water and stir thoroughly. Taste and adjust sweetness or tartness by adding more water, sugar, or lemon juice as desired.",
          },
          { description: "Chill in refrigerator for at least 1 hour before serving." },
          { description: "Fill glasses with ice cubes and pour lemonade over the ice." },
          {
            description: "Garnish each glass with a lemon slice and a sprig of fresh mint if desired.",
          },
          { description: "Stir before serving as ingredients may settle." },
          {
            description: "Store leftover lemonade in the refrigerator for up to 1 week, stirring before each use.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Meatloaf",
      description:
        "A classic, comforting meatloaf with a tender, moist interior and a caramelized glaze on top. This family-friendly dinner combines ground beef with vegetables and seasonings, then is topped with a sweet and tangy ketchup glaze that creates a delicious crust while baking.",
      servings: 8,
      prepTime: 20,
      cookTime: 65,
      ovenTemp: 350,
      recipeTypeId: dinner.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2 lbs ground beef (80/20)" },
          { description: "1 onion, finely diced" },
          { description: "2 cloves garlic, minced" },
          { description: "1/2 cup breadcrumbs" },
          { description: "1/2 cup milk" },
          { description: "2 large eggs" },
          { description: "2 tbsp Worcestershire sauce" },
          { description: "1 tsp salt" },
          { description: "1/2 tsp black pepper" },
          { description: "1/2 tsp dried thyme" },
          {
            description: "For glaze: 1/2 cup ketchup, 2 tbsp brown sugar, 1 tbsp Worcestershire sauce",
          },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Preheat oven to 350°F (175°C). Line a 9x5 inch loaf pan with parchment paper or lightly grease.",
          },
          {
            description: "In a small bowl, combine breadcrumbs with milk and let soak for 5 minutes until softened.",
          },
          {
            description:
              "In a large mixing bowl, combine ground beef, diced onion, minced garlic, soaked breadcrumbs, eggs, Worcestershire sauce, salt, pepper, and thyme.",
          },
          {
            description:
              "Using clean hands or a wooden spoon, gently mix ingredients until just combined. Don't overmix as this will make the meatloaf tough.",
          },
          {
            description: "Transfer meat mixture to prepared loaf pan and shape into an even loaf, smoothing the top.",
          },
          {
            description:
              "For the glaze, whisk together ketchup, brown sugar, and Worcestershire sauce in a small bowl.",
          },
          {
            description: "Spread half of the glaze evenly over the top of the raw meatloaf.",
          },
          {
            description:
              "Bake for 45 minutes, then brush with remaining glaze and continue baking for 15-20 minutes until internal temperature reaches 160°F (71°C).",
          },
          {
            description: "Let meatloaf rest in the pan for 10 minutes before slicing to allow juices to redistribute.",
          },
          {
            description: "Slice with a sharp knife and serve hot with mashed potatoes and green vegetables.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Iced Coffee",
      description:
        "Smooth, refreshing iced coffee with a rich coffee flavor and customizable sweetness. This cold brew-style preparation creates a less acidic, smoother taste than traditional hot coffee poured over ice, making it perfect for hot days or coffee lovers who prefer a mellow flavor.",
      servings: 4,
      prepTime: 5,
      cookTime: 0,
      ovenTemp: null,
      recipeTypeId: beverage.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "1 cup coarsely ground coffee" },
          { description: "4 cups cold water" },
          { description: "Ice cubes" },
          { description: "Milk or cream to taste" },
          { description: "Sugar or simple syrup to taste" },
          { description: "Vanilla extract (optional)" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "In a large jar or pitcher, combine coarsely ground coffee with cold water, stirring to ensure all grounds are saturated.",
          },
          {
            description:
              "Cover and let steep in refrigerator for 12-24 hours for best flavor development. The longer it steeps, the stronger it will be.",
          },
          {
            description:
              "After steeping, strain the coffee concentrate through a fine-mesh sieve lined with cheesecloth or a coffee filter to remove all grounds.",
          },
          {
            description: "The resulting concentrate can be stored in the refrigerator for up to 2 weeks.",
          },
          {
            description:
              "To serve, fill glasses with ice cubes and pour coffee concentrate over ice, filling glasses about 2/3 full.",
          },
          {
            description: "Add cold milk or cream to taste, starting with 2-3 tablespoons and adjusting as desired.",
          },
          {
            description: "Sweeten with sugar, simple syrup, or your preferred sweetener, stirring well to dissolve.",
          },
          {
            description: "Add a few drops of vanilla extract if desired for extra flavor depth.",
          },
          {
            description: "Stir well and taste, adjusting milk and sweetness as needed.",
          },
          {
            description: "Serve immediately with a straw and enjoy this smooth, refreshing coffee drink.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Spaghetti Bolognese",
      description:
        "An authentic Italian Bolognese sauce featuring slowly simmered ground beef in a rich, wine-enhanced tomato base with aromatic vegetables. This hearty, comforting pasta dish develops deep, complex flavors through long, gentle cooking and is perfect for family dinners or entertaining guests.",
      servings: 6,
      prepTime: 15,
      cookTime: 45,
      ovenTemp: null,
      recipeTypeId: dinner.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "1 lb ground beef (80/20 blend preferred)" },
          { description: "1 large onion, finely diced" },
          { description: "2 carrots, finely diced" },
          { description: "2 celery stalks, finely diced" },
          { description: "4 cloves garlic, minced" },
          { description: "1 can crushed tomatoes (28oz)" },
          { description: "3 tbsp tomato paste" },
          { description: "1 cup dry red wine (like Chianti)" },
          { description: "1 lb spaghetti" },
          { description: "2 tbsp olive oil" },
          { description: "1 tsp dried oregano" },
          { description: "1 tsp dried basil" },
          { description: "2 bay leaves" },
          { description: "Salt and freshly ground black pepper" },
          { description: "Fresh Parmesan cheese for serving" },
        ],
      },
      steps: {
        create: [
          {
            description: "Heat olive oil in a large, heavy-bottomed Dutch oven or deep skillet over medium-high heat.",
          },
          {
            description:
              "Add the ground beef and cook, breaking it up with a wooden spoon, until well-browned and no longer pink, about 6-8 minutes. Don't crowd the meat - brown in batches if necessary.",
          },
          {
            description:
              "Add the diced onion, carrots, and celery (this mixture is called soffritto) to the pot and cook, stirring occasionally, until vegetables are softened and lightly caramelized, about 8-10 minutes.",
          },
          {
            description: "Add minced garlic and cook for another minute until fragrant, being careful not to burn it.",
          },
          {
            description:
              "Stir in the tomato paste and cook for 2 minutes, stirring constantly, until it darkens slightly and becomes aromatic.",
          },
          {
            description:
              "Pour in the red wine and scrape up any browned bits from the bottom of the pot. Let the wine simmer and reduce by about half, approximately 5 minutes.",
          },
          {
            description:
              "Add the crushed tomatoes, oregano, basil, bay leaves, 1 teaspoon salt, and ½ teaspoon black pepper. Bring to a gentle simmer.",
          },
          {
            description:
              "Reduce heat to low, partially cover the pot, and let the sauce simmer gently for 30-45 minutes, stirring occasionally. The sauce should bubble very gently and reduce to a rich, thick consistency.",
          },
          {
            description:
              "About 15 minutes before the sauce is done, bring a large pot of salted water to boil and cook spaghetti according to package directions until al dente. Reserve 1 cup pasta water before draining.",
          },
          {
            description:
              "Remove bay leaves from the sauce and taste, adjusting seasoning with salt and pepper as needed.",
          },
          {
            description:
              "Toss the drained pasta with the Bolognese sauce, adding pasta water as needed to achieve the perfect consistency. Serve immediately with freshly grated Parmesan cheese.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Green Smoothie",
      description:
        "A vibrant, nutrient-packed green smoothie that tastes like a tropical treat while delivering a powerful dose of vitamins and minerals. The sweetness from banana and pineapple perfectly masks the earthy flavor of spinach, making this an ideal way to sneak more greens into your diet.",
      servings: 2,
      prepTime: 5,
      cookTime: 0,
      ovenTemp: null,
      recipeTypeId: beverage.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2 cups fresh baby spinach, packed" },
          { description: "1 large ripe banana, peeled and frozen for thickness" },
          { description: "1 cup fresh or frozen pineapple chunks" },
          { description: "1 cup coconut water (or regular water)" },
          { description: "1 tbsp raw honey or maple syrup" },
          { description: "½ cup ice cubes" },
          { description: "1 tbsp fresh lime juice (optional, for extra zing)" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Prepare your ingredients by washing the spinach thoroughly and patting it dry. If using fresh pineapple, core and chunk it into 1-inch pieces.",
          },
          {
            description:
              "Add the coconut water and honey to your blender first - liquids on the bottom help the blender work more efficiently.",
          },
          {
            description:
              "Layer in the spinach, breaking it up with your hands as you add it to help it blend more easily.",
          },
          {
            description: "Add the frozen banana (broken into chunks), pineapple pieces, and lime juice if using.",
          },
          {
            description: "Add the ice cubes last, on top of the other ingredients.",
          },
          {
            description:
              "Start blending on low speed for 30 seconds, then gradually increase to high speed and blend for 1-2 minutes until completely smooth and creamy.",
          },
          {
            description:
              "Stop and scrape down the sides of the blender if needed, then blend again until no green specks remain and the texture is silky smooth.",
          },
          {
            description:
              "Taste and adjust sweetness with additional honey if needed, or thin with more coconut water if too thick.",
          },
          {
            description:
              "Pour into chilled glasses and serve immediately for the best flavor and nutritional value. Garnish with a pineapple wedge or lime slice if desired.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Classic Beef Chili",
      description:
        "A hearty, warming chili with perfectly spiced ground beef, kidney beans, and tomatoes. This comfort food classic develops rich, complex flavors through slow simmering and is perfect for cold days or feeding a crowd. Serve with cornbread and your favorite toppings.",
      servings: 8,
      prepTime: 20,
      cookTime: 60,
      ovenTemp: null,
      recipeTypeId: dinner.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "2 lbs ground beef (80/20 blend)" },
          { description: "1 large onion, diced" },
          { description: "1 bell pepper, diced" },
          { description: "4 cloves garlic, minced" },
          { description: "2 cans kidney beans (15oz each), drained and rinsed" },
          { description: "1 can diced tomatoes (28oz)" },
          { description: "1 can tomato sauce (15oz)" },
          { description: "2 tbsp tomato paste" },
          { description: "2 tbsp chili powder" },
          { description: "1 tbsp ground cumin" },
          { description: "1 tsp paprika" },
          { description: "1 tsp oregano" },
          { description: "1/2 tsp cayenne pepper" },
          { description: "2 cups beef broth" },
          { description: "Salt and pepper to taste" },
          { description: "2 tbsp olive oil" },
        ],
      },
      steps: {
        create: [
          {
            description: "Heat olive oil in a large Dutch oven or heavy pot over medium-high heat.",
          },
          {
            description:
              "Add ground beef and cook, breaking it up with a wooden spoon, until well-browned and cooked through, about 8-10 minutes. Drain excess fat if needed.",
          },
          {
            description:
              "Add diced onion and bell pepper to the pot and cook until softened, about 5-7 minutes, stirring occasionally.",
          },
          {
            description: "Add minced garlic and cook for another minute until fragrant.",
          },
          {
            description: "Stir in tomato paste and cook for 2 minutes, stirring constantly to prevent burning.",
          },
          {
            description:
              "Add chili powder, cumin, paprika, oregano, and cayenne pepper. Stir and cook for 1 minute until spices are fragrant.",
          },
          {
            description:
              "Pour in diced tomatoes, tomato sauce, and beef broth. Stir in kidney beans and bring mixture to a boil.",
          },
          {
            description:
              "Reduce heat to low, partially cover, and simmer for 45 minutes to 1 hour, stirring occasionally, until chili has thickened.",
          },
          {
            description:
              "Season with salt and pepper to taste. Serve hot with shredded cheese, sour cream, chopped green onions, and cornbread.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Banana Bread",
      description:
        "Moist, tender banana bread with a perfectly golden crust and rich banana flavor throughout. This classic quick bread uses overripe bananas for maximum sweetness and flavor, creating a comforting treat that's perfect for breakfast, snacks, or dessert.",
      servings: 10,
      prepTime: 15,
      cookTime: 60,
      ovenTemp: 350,
      recipeTypeId: dessert.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "3 very ripe bananas, mashed" },
          { description: "1/3 cup melted butter" },
          { description: "3/4 cup sugar" },
          { description: "1 large egg, beaten" },
          { description: "1 tsp vanilla extract" },
          { description: "1 tsp baking soda" },
          { description: "1/2 tsp salt" },
          { description: "1 1/2 cups all-purpose flour" },
          { description: "1/2 cup chopped walnuts (optional)" },
        ],
      },
      steps: {
        create: [
          {
            description: "Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan or line with parchment paper.",
          },
          {
            description:
              "In a large mixing bowl, mash the ripe bananas with a fork until mostly smooth with just a few small lumps remaining.",
          },
          {
            description: "Stir the melted butter into the mashed bananas until well combined.",
          },
          {
            description:
              "Mix in sugar, beaten egg, and vanilla extract until the mixture is smooth and well incorporated.",
          },
          {
            description: "Sprinkle baking soda and salt over the mixture and stir until evenly distributed.",
          },
          {
            description:
              "Add flour and gently fold in with a wooden spoon until just combined. Don't overmix - a few flour streaks are okay.",
          },
          { description: "If using walnuts, fold them in gently at this stage." },
          {
            description:
              "Pour batter into the prepared loaf pan and spread evenly. Tap the pan gently on the counter to release air bubbles.",
          },
          {
            description:
              "Bake for 55-65 minutes, until a toothpick inserted in the center comes out clean or with just a few moist crumbs.",
          },
          {
            description:
              "Cool in the pan for 10 minutes, then turn out onto a wire rack to cool completely before slicing.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Greek Salad",
      description:
        "A fresh, vibrant Mediterranean salad featuring crisp vegetables, creamy feta cheese, and Kalamata olives, all tossed in a zesty lemon-oregano dressing. This healthy, colorful salad captures the essence of Greek cuisine and pairs perfectly with grilled meats or crusty bread.",
      servings: 6,
      prepTime: 15,
      cookTime: 0,
      ovenTemp: null,
      recipeTypeId: lunch.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "4 large tomatoes, cut into wedges" },
          { description: "1 large cucumber, sliced thick" },
          { description: "1 red onion, thinly sliced" },
          { description: "1 green bell pepper, cut into strips" },
          { description: "1/2 cup Kalamata olives" },
          { description: "6 oz feta cheese, cubed" },
          { description: "1/4 cup extra virgin olive oil" },
          { description: "2 tbsp fresh lemon juice" },
          { description: "1 tsp dried oregano" },
          { description: "1/2 tsp salt" },
          { description: "1/4 tsp black pepper" },
          { description: "Fresh parsley for garnish" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Prepare all vegetables by washing and cutting tomatoes into wedges, cucumber into thick rounds, red onion into thin slices, and bell pepper into strips.",
          },
          {
            description:
              "Arrange the cut vegetables in a large serving bowl or on a platter, distributing colors evenly for visual appeal.",
          },
          {
            description: "Scatter the Kalamata olives and cubed feta cheese over the vegetables.",
          },
          {
            description:
              "In a small bowl, whisk together olive oil, fresh lemon juice, oregano, salt, and black pepper until well combined.",
          },
          {
            description: "Drizzle the dressing evenly over the salad just before serving.",
          },
          {
            description:
              "Gently toss the salad with clean hands or salad servers to coat all ingredients with dressing.",
          },
          {
            description: "Garnish with fresh parsley and serve immediately at room temperature.",
          },
          {
            description:
              "For best flavor, let the salad sit for 10-15 minutes after dressing to allow flavors to meld together.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "French Toast",
      description:
        "Golden, crispy-outside and custardy-inside French toast made with thick slices of brioche bread soaked in a rich vanilla-cinnamon custard. This indulgent breakfast treat is perfect for weekend mornings and special occasions, served with maple syrup and fresh berries.",
      servings: 4,
      prepTime: 10,
      cookTime: 15,
      ovenTemp: null,
      recipeTypeId: breakfast.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "8 thick slices brioche or challah bread" },
          { description: "4 large eggs" },
          { description: "1 cup whole milk" },
          { description: "2 tbsp heavy cream" },
          { description: "2 tbsp sugar" },
          { description: "1 tsp vanilla extract" },
          { description: "1/2 tsp ground cinnamon" },
          { description: "1/4 tsp salt" },
          { description: "3 tbsp butter for cooking" },
          { description: "Maple syrup and berries for serving" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Allow bread slices to sit out for 30 minutes to slightly stale, or lightly toast them for 1-2 minutes to remove excess moisture.",
          },
          {
            description:
              "In a shallow dish large enough for dipping bread, whisk together eggs, milk, heavy cream, sugar, vanilla, cinnamon, and salt until smooth and well combined.",
          },
          {
            description:
              "Heat a large skillet or griddle over medium heat and add 1 tablespoon of butter, allowing it to melt and coat the surface.",
          },
          {
            description:
              "Working with one slice at a time, dip bread into the custard mixture, allowing each side to soak for 20-30 seconds. Don't oversoak or bread will fall apart.",
          },
          {
            description:
              "Lift the soaked bread slice, allowing excess custard to drip off, and place immediately in the heated skillet.",
          },
          {
            description:
              "Cook for 2-3 minutes on the first side until golden brown and slightly crispy, then flip and cook for another 2-3 minutes.",
          },
          {
            description:
              "Transfer cooked French toast to a warm plate and repeat with remaining slices, adding more butter to the pan as needed.",
          },
          { description: "Keep finished slices warm in a 200°F oven while cooking the rest." },
          {
            description:
              "Serve immediately with warm maple syrup, fresh berries, and a dusting of powdered sugar if desired.",
          },
        ],
      },
    },
  });

  await prisma.recipe.create({
    data: {
      name: "Chicken Stir Fry",
      description:
        "A colorful, healthy stir fry featuring tender chicken and crisp vegetables in a savory garlic-ginger sauce. This quick and nutritious dinner comes together in under 20 minutes and can be customized with your favorite vegetables. Serve over steamed rice for a complete meal.",
      servings: 4,
      prepTime: 15,
      cookTime: 12,
      ovenTemp: null,
      recipeTypeId: dinner.id,
      userId: getRandomUser().id,
      ingredients: {
        create: [
          { description: "1 lb boneless chicken breast, sliced thin" },
          { description: "2 tbsp vegetable oil, divided" },
          { description: "1 red bell pepper, sliced" },
          { description: "1 yellow bell pepper, sliced" },
          { description: "1 cup snap peas" },
          { description: "1 cup broccoli florets" },
          { description: "3 cloves garlic, minced" },
          { description: "1 tbsp fresh ginger, grated" },
          { description: "3 tbsp soy sauce" },
          { description: "2 tbsp oyster sauce" },
          { description: "1 tbsp cornstarch" },
          { description: "1 tbsp sesame oil" },
          { description: "2 green onions, chopped" },
          { description: "Cooked rice for serving" },
        ],
      },
      steps: {
        create: [
          {
            description:
              "Slice chicken breast into thin, uniform strips against the grain for tenderness. Pat dry with paper towels.",
          },
          {
            description:
              "In a small bowl, whisk together soy sauce, oyster sauce, cornstarch, and sesame oil to create the stir fry sauce. Set aside.",
          },
          {
            description:
              "Heat 1 tablespoon of vegetable oil in a large wok or skillet over high heat until shimmering.",
          },
          {
            description:
              "Add chicken pieces in a single layer, being careful not to overcrowd. Cook for 2-3 minutes without stirring to develop browning.",
          },
          {
            description:
              "Stir-fry chicken for another 2-3 minutes until cooked through and no longer pink. Remove chicken to a plate.",
          },
          {
            description:
              "Add remaining oil to the same pan and immediately add bell peppers, snap peas, and broccoli. Stir-fry for 3-4 minutes until vegetables are crisp-tender.",
          },
          {
            description:
              "Create a well in the center of vegetables and add minced garlic and ginger. Cook for 30 seconds until fragrant.",
          },
          {
            description:
              "Return chicken to the pan and pour the prepared sauce over everything. Toss quickly to coat all ingredients evenly.",
          },
          {
            description:
              "Cook for another 1-2 minutes until sauce has thickened slightly and everything is heated through.",
          },
          {
            description:
              "Remove from heat, garnish with chopped green onions, and serve immediately over steamed rice.",
          },
        ],
      },
      comments: {
        create: [
          {
            userId: users[1].id,
            text: "Yummy!",
          },
          {
            userId: users[3].id,
            text: "Tastes Good!",
          },
        ],
      },
    },
  });

  console.log("Seeded 19 recipes assigned to 5 random users");
}
