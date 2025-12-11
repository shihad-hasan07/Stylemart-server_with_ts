import { UserModel } from "./user.model.js";

const UserService = {
  createUser: async (payload) => {
    return await UserModel.create(payload);
  },

  getUserByEmail: async (email) => {
    return await UserModel.findOne({ email });
  },

  getAllUsers: async () => {
    return await UserModel.find();
  },

  isExistUser: async (email) => {
    return await UserModel.findOne({ email });
  },

  updateUserById: async (id, data) => {
    return await UserModel.findByIdAndUpdate(id, data, { new: true });
  },

  deleteUserById: async (id) => {
    return await UserModel.findByIdAndDelete(id);
  },
};

export default UserService;
