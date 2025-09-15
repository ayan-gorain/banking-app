import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { seedAdmin } from "./bootstrap/seedAdmin.js";
import accountRoutes from "./routes/accountRoutes.js"
import { typeDefs, resolvers } from "./graphql/schema.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/accounts",accountRoutes)
// app.use("/api/accounts",loanR)

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => {
     
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

  
  mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
      console.log("MongoDB connected");
      await seedAdmin();

      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}/graphql`);
      });
    })
    .catch((err) => console.error("MongoDB error:", err));
};

startServer();
