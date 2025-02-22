import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import server from "./server";
import dotenv from "dotenv";
import { PORT } from "./variables";
// import Twilio from "twilio";
// import { getUserRecommendations } from "./controllers/recommendattions";
// import { registerSchema } from "./schema/users";

//SERVER INITIALIZATION FILE

//DATABASE INITIALIZATION
export const prismaClient = new PrismaClient({
  log: ["query"],
});
// .$extends({
//   query: {
//     //WHEN CREATING USER VALIDATE INPUTS WITH REGISTER SCHEMA
//     user: {
//       create({ args, query }) {
//         args.data = registerSchema.parse(args.data);
//         return query(args);
//       },
//     },
//   },
// });

// getUserRecommendations("cm4d3pv1l002c1339f4hi5n9x", 12);
// getUserRecommendations("cm4d3pq91001k1339cf0gd6x0", 12);
// getUserRecommendations("cm4d3pq94001y1339w6i2gmak", 12);
// getUserRecommendations("cm4d3pv1100291339v6rkxm1a", 12);

//CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

dotenv.config();

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
  //connect db
});
