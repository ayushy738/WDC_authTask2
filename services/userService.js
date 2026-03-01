import * as userModel from "../models/userModel.js";

export const getUserProfile = async (userId) => {
    return await userModel.findById(userId);
};

export const updateProfile = async (userId, data) => {

  const existingUser = await userModel.findById(userId);

  if (!existingUser) {
    throw new Error("User not found");
  }

  const updatedName = data.name ?? existingUser.name;
  const updatedBio = data.bio ?? existingUser.bio;
  const updatedContact = data.contact ?? existingUser.contact;

  await userModel.updateUserProfile(
    userId,
    updatedName,
    updatedBio,
    updatedContact
  );
};

export const deleteUser = async (userId) => {
    const existing = await userModel.findById(userId);
    if (!existing) throw new Error("User not found");

    await userModel.deleteUserById(userId);
};