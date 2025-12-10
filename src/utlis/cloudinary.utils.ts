import fs from 'fs';
import cloudinary from '../config/cloudirany.config.js';
import type { UploadApiResponse } from 'cloudinary';

export const uploadOnCloudinary = async (localFilePath: string): Promise<UploadApiResponse | null> => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // Delete local file after successful upload
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log(
            'Upload failed:',
            error instanceof Error ? error.message : error
        );
        // Delete local file even if upload failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.log(
            'Delete failed:',
            error instanceof Error ? error.message : error
        );
        return null;
    }
};
