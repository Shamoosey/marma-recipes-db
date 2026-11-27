import { getAuth, requireAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { Controller, HttpError, Post, Req, Res, UseBefore } from "routing-controllers";
import * as UploadService from "../services/uploadService";
import { errorResponse, successResponse } from "../models/responseModel";

@Controller()
export class UploadController {
  @Post("/uploads/sign")
  @UseBefore(requireAuth())
  async signUpload(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = getAuth(req).userId!; // guaranteed by requireAuth
      const { contentType, size } = req.body ?? {};
      const signature = await UploadService.createUploadSignature(userId, contentType, size);
      return res.status(200).json(successResponse(signature, "Upload signature created"));
    } catch (error) {
      if (error instanceof HttpError) {
        return res.status(error.httpCode).json(errorResponse(error.message));
      }
      throw error;
    }
  }
}
