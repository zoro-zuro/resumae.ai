"use server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";

export const triggerDeleteResume = async (resumeId: Id<"resume">) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  try {
    const response = await convex.mutation(api.resume.deleteResume, {
      resumeId,
    });

    if (response.success) {
      return {
        success: true,
        message: "Resume deleted successfully",
      };
    }
  } catch (error) {
    console.error("Error deleting resume:", error);
    return {
      success: false,
      error: `Error deleting resume: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
