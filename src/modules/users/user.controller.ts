import type { Request, Response } from "express";
import UserService from "./user.service.js";
import { apiError, apiSuccess } from "../../utlis/apiResponse.js";
import { uploadOnCloudinary } from "../../utlis/cloudinary.utils.js";

const UserController = {
  createUser: async (req: Request, res: Response) => {
    try {
      if (req.body.email) {
        const existingUser = await UserService.isExistUser(req.body.email);

        if (existingUser) {
          const checkImageUpdates = req.body.photoURL && existingUser.photoURL !== req.body.photoURL;
          console.log('checkImageUpdates', checkImageUpdates);

          if (checkImageUpdates) {
            existingUser.photoURL = req.body.photoURL;
            const result = await existingUser.save();
            return apiSuccess(res, result, "User updated with new photoURL", 200);
          }
          return apiSuccess(res, existingUser, "User already exists", 200);
        }
      }
      const payload = {
        ...req.body,
        role: "user",
      };

      const result = await UserService.createUser(payload);
      return apiSuccess(res, result, "User created", 201);
    } catch (error: any) {
      console.log(error);
      return apiError(res, error, "Failed to create user", 400);
    }
  },

  getSingleUser: async (req: Request, res: Response) => {
    const { gmail } = req.query;
    console.log('mail is', gmail);

    try {
      const result = await UserService.getUserByEmail(gmail as string);
      return apiSuccess(res, result);
    } catch (error: any) {
      return apiError(res, error, "Failed to fetch user");
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const updateData: any = { ...req.body };

      if (req.file) {
        const cloudHostedImage = await uploadOnCloudinary(req.file?.path);

        if (!cloudHostedImage) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload image",
          });
        }
        updateData.photoURL = cloudHostedImage.secure_url
      }

      const updatedUser = await UserService.updateUserById(userId as string, updateData)

      // const result = await UserService.updateUserById(req.params.id as string, req.body);
      return apiSuccess(res, updatedUser, "User updated");
    } catch (error: any) {
      return apiError(res, error, "Failed to update user");
    }
  },


  deleteUser: async (req: Request, res: Response) => {
    try {
      const result = await UserService.deleteUserById(req.params.id as string);
      return apiSuccess(res, result, "User deleted");
    } catch (error: any) {
      return apiError(res, error, "Failed to delete user");
    }
  },
};

export default UserController;
