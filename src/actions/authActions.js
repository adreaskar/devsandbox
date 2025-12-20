"use server";

import { signIn, signOut } from "@/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const providedToken = formData.get("token");

  try {
    if (providedToken !== process.env.REGISTRATION_TOKEN) {
      return { error: "Invalid secret token." };
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return { error: "Email or Username already taken." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong." };
  }
}

export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard/overview",
    });
  } catch (error) {
    if (error.type === "CredentialsSignin") {
      return { error: "Invalid credentials." };
    }
    throw error; // Essential for the redirect to work
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/" });
}
