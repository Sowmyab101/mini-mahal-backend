const express = require("express");
const multer = require("multer");
const streamifier = require("streamifier");

const cloudinary = require("../services/cloudinary");
const db = require("../services/firebase");

const router = express.Router();

// Store uploaded file in memory
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

// Upload Image
router.post("/upload", upload.single("image"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image selected."
            });
        }

        const { type, name, description } = req.body;

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `MiniMahal/${type}`
            },
            async (error, result) => {

                if (error) {
                    console.error(error);

                    return res.status(500).json({
                        success: false,
                        message: "Cloudinary upload failed."
                    });
                }

                let data = {
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                    createdAt: new Date()
                };

                if (type === "facilities") {
                    data.name = name;
                    data.description = description;
                }

                await db.collection(type).add(data);

                res.json({
                    success: true,
                    message: "Upload Successful",
                    imageUrl: result.secure_url
                });

            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

module.exports = router;