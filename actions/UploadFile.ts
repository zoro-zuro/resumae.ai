"use server";
import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { currentUser } from "@clerk/nextjs/server";

export const UploadFile = async (formData: FormData) => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      error: "Not Authenticated",
    };
  }
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "NO file provided",
      };
    }

    if (
      !file.type.includes("pdf") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return { success: false, error: "Only PDF files are allowed" };
    }

    const UploadUrl = await convex.mutation(api.resume.generateUploadUrl, {});
    const fileBuffer = await file.arrayBuffer();

    const UploadResponse = await fetch(UploadUrl, {
      method: "POST",
      headers: {
        "Content-type": file.type,
      },
      body: new Uint8Array(fileBuffer),
    });

    if (!UploadResponse.ok) {
      throw new Error(
        `Failed to Upload file to convex 
        ${UploadResponse.statusText}`,
      );
    }

    const { storageId } = await UploadResponse.json();

    const resumeId = await convex.mutation(api.resume.storeResume, {
      fileId: storageId,
      fileName: file.name,
      userId: user.id!,
      mimeType: file.type,
      size: file.size,
    });

    const pdfUrl = await convex.query(api.resume.generateDownloadUrl, {
      resumeId: storageId,
    });
    return {
      success: true,
      data: {
        resumeId,
        fileName: file?.name,
        fileId: storageId,
        pdfUrl,
      },
    };
  } catch (error) {
    console.error("Failed to upload resume", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error ocured",
    };
  }
};
