import UserService from "./user.service.js";
import { apiError, apiSuccess } from "../../utlis/apiResponse.js";
import { uploadOnCloudinary } from "../../utlis/cloudinary.utils.js";

const UserController = {
  createUser: async (req, res) => {
    try {
      if (req.body.email) {
        const existingUser = await UserService.isExistUser(req.body.email);

        if (existingUser) {
          const checkImageUpdates =
            req.body.photoURL && existingUser.photoURL !== req.body.photoURL;

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
    } catch (error) {
      return apiError(res, error, "Failed to create user", 400);
    }
  },

  getSingleUser: async (req, res) => {
    const { gmail } = req.query;
    try {
      const result = await UserService.getUserByEmail(gmail);
      return apiSuccess(res, result);
    } catch (error) {
      return apiError(res, error, "Failed to fetch user");
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const updateData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        photoURL: req.body.photoURL,
        address: {
          division: req.body.division,
          city: req.body.city,
          address: req.body.address,
        }
      };

      if (req.file) {
        const cloudHostedImage = await uploadOnCloudinary(req.file.path);

        if (!cloudHostedImage) {
          return res.status(500).json({
            success: false,
            message: "Failed to upload image",
          });
        }

        updateData.photoURL = cloudHostedImage.secure_url;
      }

      const updatedUser = await UserService.updateUserById(userId, updateData);
      return apiSuccess(res, updatedUser, "User updated");
    } catch (error) {
      return apiError(res, error, "Failed to update user");
    }
  },

  deleteUser: async (req, res) => {
    try {
      const result = await UserService.deleteUserById(req.params.id);
      return apiSuccess(res, result, "User deleted");
    } catch (error) {
      return apiError(res, error, "Failed to delete user");
    }
  },
};

export default UserController;
