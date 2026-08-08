const cloudinary = require("./services/cloudinary");

console.log("Cloudinary Connected Successfully!");
console.log(cloudinary.config().cloud_name);