"use server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";

export const updateError = async (resumeId: Id<"resume">) => {
  try {
    // Call the Convex mutation to update the error status
    await convex.mutation(api.resume.updateErrorStatus, { resumeId });
  } catch (error) {
    console.error("Error updating error status:", error);
    throw new Error("Failed to update error status");
  }
};
