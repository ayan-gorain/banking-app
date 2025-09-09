import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
export const userResolvers = {
  User: {
    createdAt: (parent) => {
      try {
        return new Date(parent.createdAt).toISOString();
      } catch {
        return parent.createdAt;
      }
    },
  },
  Query: {
    users: async (_, __, { user: authUser }) => {
      if (!authUser) throw new Error("Authentication failed");
      try {
        return await User.find();
      } catch (error) {
        throw new Error("Error fetching users: " + error.message);
      }
    },
    user: async (_, { id }, { user: authUser }) => {
      if (!authUser) throw new Error("Authentication required");
      try {
        const foundUser = await User.findById(id);
        return foundUser;
      } catch (error) {
        throw new Error("Failed to fetch user: " + error.message);
      }
    },
    getUser: async (_, __, { user: authUser }) => {
      if (!authUser) throw new Error("Authentication required");
      try {
        const foundUser = await User.findById(authUser.userId);
        if (!foundUser) throw new Error("User not found");
        return foundUser;
      } catch (error) {
        throw new Error("Failed to fetch current user: " + error.message);
      }
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { error } = userSchema.validate(input);
      if (error) throw new Error(error.details[0].message);

      try {
        const newUser = new User(input);
        return await newUser.save();
      } catch (error) {
        if (error.code === 11000) {
          throw new Error("Email address is already in use");
        }
        throw new Error("Failed to create user: " + error.message);
      }
    },

    updateUser: async (_, { id, input }, { user: authUser }) => {
      if (!authUser) throw new Error("Authentication required");
      
      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, {
          new: true,
        });
        if (!updatedUser) throw new Error("User not found for update");
        return updatedUser;
      } catch (error) {
        throw new Error("Failed to update user: " + error.message);
      }
    },

    deleteUser: async (_, { id }, { user: authUser }) => {
      if (!authUser) throw new Error("Authentication required");
      
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) throw new Error("User not found for deletion");
        return true;
      } catch (error) {
        throw new Error("Failed to delete user: " + error.message);
      }
    },

    login: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email });
      if (!existingUser) throw new Error("Invalid credentials");

      const isMatch = await existingUser.comparePassword(password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign(
        { userId: existingUser.id, role: existingUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return { token, user: existingUser };
    },
  },
};
