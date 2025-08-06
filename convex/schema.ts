import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  resume: defineTable({
    userId: v.string(),
    fileName: v.string(),
    fileId: v.id("_storage"),
    size: v.number(),
    mimeType: v.string(),
    status: v.string(),
    uploadedAt: v.optional(v.number()),

    // Uploaded by user
    sampleJob: v.string(),
    role: v.string(),
    resumeScore: v.number(), // Overall ATS score
    matchedSkills: v.array(v.string()), // Skills they have
    missingSkills: v.array(v.string()), // Skills they need
    recommendations: v.array(v.string()),
    keywordSuggestions: v.array(v.string()),
    experienceGap: v.string(),
    aisummary: v.string(),
    skillsMatch: v.number(),
    experienceMatch: v.boolean(),
    keywordDensity: v.number(),
    strengths: v.array(v.string()),
    warnings: v.array(v.string()),
  }),
});
