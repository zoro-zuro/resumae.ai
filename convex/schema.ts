import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  resume: defineTable({
    userId: v.string(),
    fileName: v.string(),
    fileId: v.id("_storage"),
    size: v.number(),
    mimeType: v.string(),
    status: v.string(),
    uploadedAt: v.optional(v.number()),

    // Todo : Upload user request form
    // Todo : Extracted information from the ai
  }),
});
