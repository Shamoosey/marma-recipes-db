export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  [key: string]: any;
}

export interface UploadResponse {
  success: boolean;
  data?: any;
  error?: string;
}
