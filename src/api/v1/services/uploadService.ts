import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BadRequestError } from "routing-controllers";

const { SPACES_KEY, SPACES_SECRET, SPACES_BUCKET, SPACES_REGION } = process.env;
const PUBLIC_BASE = `https://${SPACES_BUCKET}.${SPACES_REGION}.cdn.digitaloceanspaces.com`;

const s3 = new S3Client({
  endpoint: `https://${SPACES_REGION}.digitaloceanspaces.com`,
  region: "us-east-1",
  forcePathStyle: false,
  requestChecksumCalculation: "WHEN_REQUIRED",
  credentials: { accessKeyId: SPACES_KEY!, secretAccessKey: SPACES_SECRET! },
});

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 10 * 1024 * 1024;

const userPrefix = (userId: string) => `recipes/${userId}/`;

export async function createUploadSignature(userId: string, contentType: string, size: number) {
  const ext = EXTENSIONS[contentType];
  if (!ext) throw new BadRequestError("Unsupported image type");
  if (!Number.isInteger(size) || size <= 0 || size > MAX_BYTES) {
    throw new BadRequestError("Image must be less than 10MB");
  }

  const key = `${userPrefix(userId)}${randomUUID()}.${ext}`;
  const command = new PutObjectCommand({
    Bucket: SPACES_BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
    ACL: "public-read",
  });
  console.log(key);

  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: 300,
    signableHeaders: new Set(["content-type", "content-length"]),
    unhoistableHeaders: new Set(["x-amz-acl"]),
  });

  return {
    uploadUrl,
    key,
    url: `${PUBLIC_BASE}/${key}`,
    headers: { "Content-Type": contentType, "x-amz-acl": "public-read" },
  };
}

export function resolveImage(userId: string, imageKey: string | null | undefined) {
  if (!imageKey) return { imageKey: null, imageUrl: null };
  if (!imageKey.startsWith(userPrefix(userId))) throw new BadRequestError("Invalid image key");
  return { imageKey, imageUrl: `${PUBLIC_BASE}/${imageKey}` };
}

export async function deleteImage(imageKey: string) {
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: SPACES_BUCKET, Key: imageKey }));
  } catch (error) {
    console.error(`Failed to delete image ${imageKey}`, error);
  }
}
