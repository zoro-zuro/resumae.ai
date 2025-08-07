"use server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";

export const UpdateResumePdf = async (
  resumePdfId: Id<"_storage">,
  resumeId: Id<"resume">,
  formData: FormData,
) => {
  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      error: "Authentcation failed to User",
    };
  }

  try {
    const file = formData.get("file") as File;

    if (!file || !resumeId) {
      return {
        success: false,
        error: `File or resume id is not provided resumeId:${resumeId} , file:${file}`,
      };
    }

    const uploadUrl = await convex.mutation(api.resume.delAndGenerateUrl, {
      resumeStroageId: resumePdfId,
    });
    if (!uploadUrl) {
      return {
        success: false,
        error: `Error generating upload url`,
      };
    }

    const fileBuffer = await file.arrayBuffer();
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "content-type": file.type,
      },
      body: new Uint8Array(fileBuffer),
    });
    if (!response.ok) {
      return {
        success: false,
        error: `Error in posting the file ${response.statusText}`,
      };
    }

    const { storageId } = await response.json();

    // updating resume to current file storage id

    await convex.mutation(api.resume.updateFile, {
      fileId: storageId,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
      resumeId,
    });
    const pdfUrl = await convex.query(api.resume.generateDownloadUrl, {
      resumeId: storageId,
    });
    return {
      success: true,
      data: {
        resumeId,
        fileName: file.name,
        fileId: storageId,
        pdfUrl,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Error in updating the resume file ${error}`,
    };
  }
};
