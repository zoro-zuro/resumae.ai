import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const storeResume = mutation({
  args: {
    userId: v.string(),
    fileName: v.string(),
    fileId: v.id("_storage"),
    size: v.number(),
    mimeType: v.string(),
  },
  handler: async (ctx, args) => {
    const resumeId = await ctx.db.insert("resume", {
      userId: args.userId,
      fileId: args.fileId,
      fileName: args.fileName,
      size: args.size,
      mimeType: args.mimeType,
      status: "pending",
      uploadedAt: Date.now(),
    });

    return resumeId;
  },
});
