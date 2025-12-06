import cloudinary from "../../../config/cloudinary";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

export class CloudinaryService {
  static async uploadImage(imageBase64: string, folder: string = "recipes"): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(imageBase64, {
        folder: folder,
        resource_type: "auto",
        transformation: [{ width: 1000, height: 1000, crop: "limit" }, { quality: "auto" }],
      });

      return result;
    } catch (error) {
      console.error("Cloudinary error details:", error);
      throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete failed:", error);
    }
  }
}
