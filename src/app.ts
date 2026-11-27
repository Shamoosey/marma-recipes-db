import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import setupSwagger from "./config/swagger";
import corsOptions from "./config/cors";
import { useExpressServer } from "routing-controllers";
import { RecipeController } from "./api/v1/controllers/recipeController";
import { RecipeTypeController } from "./api/v1/controllers/recipeTypeController";
import { RecipeCommentController } from "./api/v1/controllers/recipeCommentController";
import { clerkMiddleware } from "@clerk/express";
import { UploadController } from "./api/v1/controllers/UploadController";

const app: Express = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(morgan("combined"));

app.use(clerkMiddleware());

useExpressServer(app, {
  routePrefix: "/api/v1",
  controllers: [RecipeController, RecipeTypeController, RecipeCommentController, UploadController],
  cors: corsOptions,
  defaultErrorHandler: false,
});

dotenv.config();

setupSwagger(app);

app.get("/", (_req, res) => {
  res.send("Got response from backend!");
});

export default app;
