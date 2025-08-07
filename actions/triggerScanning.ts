"use server";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { inngest } from "@/inngest/client";
import Events from "@/inngest/constants";

import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";

export const triggerScanning = async (
  resumeId: Id<"resume"> | undefined,
  resumePdfId: Id<"_storage"> | undefined,
  jobPost: string,
) => {
  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      error: "Authentcation failed",
    };
  }
  if (!resumePdfId || !jobPost) {
    return {
      success: false,
      error: "resume id or jobpost is missing",
    };
  }
  try {
    const resumelUrl = await convex.query(api.resume.generateDownloadUrl, {
      resumeId: resumePdfId,
    });
    if (!resumelUrl) {
      return {
        success: false,
        error: `Error in generating url for resume ${resumelUrl}`,
      };
    }
    await inngest.send({
      name: Events.SCAN_RESUME_ANALYSE_CTC,
      data: {
        url: resumelUrl,
        jobPost,
        resumeId,
      },
    });

    await convex.mutation(api.resume.updateStatus, {
      resumeId: resumeId as Id<"resume">,
    });

    return {
      success: true,
      data: {
        resumeId,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Cant trigger the scanning ${error}`,
    };
  }
};
