import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/auth.js";

import { typeDefs, resolvers } from "./graphql/schema.js";
//import { authMiddleware } from './mid'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => {
      // Extract token from Authorization header
      const authHeader = req.headers?.authorization;
      const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

      let user = null;
      if (token) {
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET);
          user = payload;
        } catch (error) {
          user = null;
        }
      }
      
      return { user };
    },
  }));

  // MongoDB connection and server start
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}/graphql`);
      });
    })
    .catch((err) => console.error("MongoDB error:", err));
};

startServer();
