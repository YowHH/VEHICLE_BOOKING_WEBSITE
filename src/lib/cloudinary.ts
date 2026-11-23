
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (
    file: Blob
): Promise<string | null> => {

    if (!file || file.size === 0) {
        return null;
    }

    try {
        // Check Cloudinary environment variables
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error("Cloudinary environment variables are missing.");
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const result = await new Promise<string>((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "partner-documents",
                },
                (error, result) => {

                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        reject(error);
                        return;
                    }

                    if (!result?.secure_url) {
                        reject(new Error("Cloudinary returned no secure URL."));
                        return;
                    }

                    resolve(result.secure_url);
                }
            );

            uploadStream.end(buffer);
        });

        return result;

    } catch (error: any) {

        console.error("=== CLOUDINARY UPLOAD ERROR ===");
        console.error("Error name:", error?.name);
        console.error("Error message:", error?.message);
        console.error("HTTP code:", error?.http_code);
        console.error("Cloudinary details:", error?.error);

        throw error;
    }
};

export default uploadOnCloudinary;
