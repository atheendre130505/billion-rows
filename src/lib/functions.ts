"use server";

import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase-admin";

export async function triggerTestRunner(filePath: string, userId: string) {
  const processFile = httpsCallable(functions, "processFile");
  try {
    const result = await processFile({ filePath, userId });
    return result.data;
  } catch (error) {
    console.error("Error calling processFile function:", error);
    throw new Error("Failed to trigger test runner.");
  }
}
