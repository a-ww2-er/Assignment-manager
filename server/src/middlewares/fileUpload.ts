import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";

export const uploadStream = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        allowed_formats: [
          "pdf",
          "doc",
          "docx",
          "jpg",
          "png",
          "gif",
          "webp",
          "svg",
        ],
        folder: "submissions",
        format: "jpg", // Default format for images
      },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    const allowedMimeTypes = [
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Allowed types: PDF, DOC/DOCX, JPG, PNG, GIF, WEBP, SVG"
        )
      );
    }
  },
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});
// Add this middleware to your route
export const uploadFile = upload.single("file");
