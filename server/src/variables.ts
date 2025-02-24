//ENVIRONMENT VARIABLES EXPORTS
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT || 5000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;
export const JWT_TOKEN_EXPIRE = process.env.JWT_TOKEN_EXPIRE!;
export const JWT_REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_TOKEN_EXPIRE!;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
export const CLOUD_NAME = process.env.CLOUD_NAME!;
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY!;
export const CLOUD_SECRET_KEY = process.env.CLOUD_SECRET_KEY!;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
export const IPINFOTOKEN = process.env.IPINFOTOKEN!;
