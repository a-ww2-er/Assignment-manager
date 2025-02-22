// import multer from "multer";
import path from "path";
// import { v4 as uuidv4 } from 'uuid';

// export const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//        if(file.fieldname =="image")
//        {
//         cb(null, path.join(__dirname, "../../public/images"));
//     }
//        if(file.fieldname =="profilePhoto")
//        {
//         cb(null, path.join(__dirname, "../../public/profilePhotos"));
//     }
// },
//     filename: function (req, file, cb) {
//         const imageExt = file.mimetype.split("/")[1];
//       const id = uuidv4();
//         cb(null, "product_image_" + id + "." + imageExt);
//     },
// })

// const fileFilter = (req: any, file: any, cb: any) => {
//     const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'svg', 'tiff'];

//     const extname = require('path').extname(file.originalname).toLowerCase();
//     const isImage = allowedExtensions.includes(extname.slice(1));

//     if (isImage) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };

// export const imageUpload = multer({ storage ,fileFilter})
