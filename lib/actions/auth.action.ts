"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";
const FIVE_DAYS = 60 * 60 * 24 * 5;

export async function SignUp(params: SignUpParams) {
  const { email, uid, name } = params;
  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }
    await db.collection("users").doc(uid).set({
      email,
      name,
    });
    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-exists") {
      return { success: false, message: "Email already in use." };
    }
    return { success: false, message: "Failed to create an account." };
  }
}
export async function SignIn(params: SignInParams) {
  const { email, idToken } = params;
  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account instead.",
      };
    }
    await setSessionCookie(idToken);
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-exists") {
      return { success: false, message: "Email already in use." };
    }
    return { success: false, message: "Failed to login to an account." };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: FIVE_DAYS * 1000,
  });
  cookieStore.set("session", sessionCookie, {
    maxAge: FIVE_DAYS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function isAuthenticated(){
  const user = await getCurrentUser()
  return !!user

}