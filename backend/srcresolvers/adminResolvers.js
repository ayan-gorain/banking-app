import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const adminResolvers = {
  Mutation: {
    adminLogin: async (_,{ email, password }) => {
      try {
        const existing = await Admin.findOne({ email });
        if(!existing) {
          console.log(`Admin login attempt failed: user not found for email ${email}`);
          throw new Error("Invalid credentials");
        }

        let passwordMatch = false;
        
        // Try bcrypt comparison first (for hashed passwords)
        try {
          passwordMatch = await bcrypt.compare(password, existing.password);
        } catch (bcryptError) {
          console.log("Bcrypt comparison failed, trying plain text");
        }
        
        // If bcrypt failed, try plain text comparison (for plain text passwords)
        if (!passwordMatch) {
          passwordMatch = existing.password === password;
        }

        if(!passwordMatch) {
          console.log(`Admin login attempt failed: wrong password for email ${email}`);
          throw new Error("Invalid credentials");
        }

        const token = jwt.sign(
          { userId: existing.id, role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '9h' }
        );
        
        console.log(`Admin login successful for email ${email}`);
        return { token, admin: existing };
      } catch (error) {
        console.error("Admin login error:", error.message);
        throw error;
      }
    }
  }
};
