import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const generateDownloadUrl = query({
  args: {
    resumeId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.resumeId);
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
      status: "processing",
      uploadedAt: Date.now(),

      // Placeholder values until AI fills them in
      sampleJob: "",
      role: "",
      resumeScore: 0,
      matchedSkills: [],
      missingSkills: [],
      recommendations: [],
      keywordSuggestions: [],
      experienceGap: "",
      aisummary: "",

      // ✅ Added new AI fields
      skillsMatch: 0,
      experienceMatch: false,
      keywordDensity: 0,
      strengths: [],
      warnings: [],
    });

    return resumeId;
  },
});

export const getAllResume = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const resumeList = await ctx.db
      .query("resume")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
    return resumeList;
  },
});

export const updateResume = mutation({
  args: {
    id: v.id("resume"),
    sampleJobPost: v.string(),
    role: v.string(),
    resumeScore: v.number(),
    matchedSkills: v.array(v.string()),
    missingSkills: v.array(v.string()),
    recommendations: v.array(v.string()),
    keywordSuggestions: v.array(v.string()),
    experienceGap: v.string(),
    aisummary: v.string(),

    // ✅ Newly added fields
    skillsMatch: v.number(),
    experienceMatch: v.boolean(),
    keywordDensity: v.number(),
    strengths: v.array(v.string()),
    warnings: v.array(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Cant find the resume");
    }

    await ctx.db.patch(args.id, {
      // User-provided
      sampleJob: args.sampleJobPost,

      // AI-generated fields
      role: args.role,
      resumeScore: args.resumeScore,
      matchedSkills: args.matchedSkills,
      missingSkills: args.missingSkills,
      recommendations: args.recommendations,
      keywordSuggestions: args.keywordSuggestions,
      experienceGap: args.experienceGap,
      aisummary: args.aisummary,

      // ✅ Newly added
      skillsMatch: args.skillsMatch,
      experienceMatch: args.experienceMatch,
      keywordDensity: args.keywordDensity,
      strengths: args.strengths,
      warnings: args.warnings,
      status: args.status,
    });
  },
});

export const updateStatus = mutation({
  args: {
    resumeId: v.id("resume"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("No resume found");
    }
    await ctx.db.patch(args.resumeId, {
      status: "completed",
    });
  },
});

export const getResumeById = query({
  args: {
    resumeId: v.id("resume"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error(
        `No resume found for the given resume id ${args.resumeId}`,
      );
    }
    return resume;
  },
});

export const updateErrorStatus = mutation({
  args: {
    resumeId: v.id("resume"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) {
      throw new Error("No resume found");
    }
    await ctx.db.patch(args.resumeId, {
      status: "failed",
    });
  },
});

export const deleteResume = mutation({
  args: {
    resumeId: v.id("resume"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.resumeId);

    if (!resume) {
      throw new Error("No resume found");
    }
    await ctx.storage.delete(resume.fileId);
    await ctx.db.delete(args.resumeId);
    return { success: true, message: "Resume deleted successfully" };
  },
});

export const delAndGenerateUrl = mutation({
  args: {
    resumeStroageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.resumeStroageId);
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateFile = mutation({
  args:{
    resumeId:v.id("resume"),
    fileId:v.id("_storage"),
    fileName:v.string(),
    size:v.number(),
    mimeType:v.string()
  },
  handler: async(ctx,args)=>{
    const resume = await ctx.db.get(args.resumeId);
    if(!resume){
      throw new Error("Resume Not found")
    }

    await ctx.db.patch(args.resumeId,{
      fileId:args.fileId,
      fileName:args.fileName,
      size:args.size,
      mimeType:args.mimeType
    })
  }
})