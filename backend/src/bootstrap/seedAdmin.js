import Admin from "../../models/Admin.js";

export async function seedAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    if (!adminEmail || !adminPassword) {
      console.log("ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping admin seed");
      return;
    }

    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
      await new Admin({ name: adminName, email: adminEmail, password: adminPassword, role: "admin" }).save();
      console.log(`Default admin created: ${adminEmail}`);
    } else {
      console.log(`Admin exists: ${adminEmail}`);
    }
  } catch (error) {
    console.error("Admin seed error:", error?.message || error);
  }
}


