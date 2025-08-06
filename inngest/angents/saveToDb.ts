import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

const connectDB = createTool({
  name: "connectdb",
  description: "Connect to DB to save resume analysis results.",
  parameters: z.object({
    resumeId: z
      .string()
      .describe("Resume id for referring the resume data in db"),
    sampleJobPost: z
      .string()
      .describe("The sample post matched with the user resume"),
    role: z.string().describe("The role user applying for from sample post"),
    resumeScore: z.number().describe("Overall ATS score like '85%'"),

    matchedSkills: z
      .array(z.string())
      .describe("Skills that match the job post"),
    missingSkills: z.array(z.string()).describe("Skills that are missing"),
    recommendations: z
      .array(z.string())
      .describe("Suggestions to improve alignment"),
    keywordSuggestions: z
      .array(z.string())
      .describe("Keywords to add to improve ATS match"),
    experienceGap: z.string().describe("Summary of the experience gap if any"),
    aisummary: z.string().describe("Overall summary of resume"),

    skillsMatch: z
      .number()
      .describe("Percentage of job-required skills matched"),
    experienceMatch: z
      .boolean()
      .describe("Whether the experience matches the job requirements"),
    keywordDensity: z
      .number()
      .describe("Percentage of job keywords present in the resume"),
    strengths: z.array(z.string()).describe("Strong areas in the resume"),
    warnings: z.array(z.string()).describe("Gaps or risks in the resume"),
  }),

  handler: async (params, context) => {
    const {
      resumeId,
      resumeScore,
      matchedSkills,
      missingSkills,
      recommendations,
      keywordSuggestions,
      experienceGap,
      sampleJobPost,
      role,
      aisummary,
      skillsMatch,
      experienceMatch,
      keywordDensity,
      strengths,
      warnings,
    } = params;

    const result = await context.step?.run("save_resume_analysis", async () => {
      try {
        await convex.mutation(api.resume.updateResume, {
          id: resumeId as Id<"resume">,
          sampleJobPost,
          role,
          resumeScore,
          matchedSkills,
          missingSkills,
          recommendations,
          keywordSuggestions,
          experienceGap,
          aisummary,
          skillsMatch,
          experienceMatch,
          keywordDensity,
          strengths,
          warnings,
          status: "completed",
        });

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    if (result?.success) {
      context.network?.state.kv.set("saved_to_db", true);
    }

    return result;
  },
});

export const saveToDb = createAgent({
  name: "savetodb",
  description: "Save analysis results to database",
  model: openai({
    model: "gpt-4o",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY,
  }),
  system: `
You are a resume analysis saving agent. Your only task is to call the "connectdb" tool with the provided resume evaluation results.

Ensure all of the following fields are included exactly as described and also check there is no gibberish: 

- resumeId: string
- sampleJobPost: string
- role: string
- resumeScore: number (0–100)
- matchedSkills: array of strings
- missingSkills: array of strings
- recommendations: array of strings
- keywordSuggestions: array of strings
- experienceGap: string
- aisummary: string
- skillsMatch: number (0–100)
- experienceMatch: boolean
- keywordDensity: number (0–100)
- strengths: array of strings
- warnings: array of strings

DO NOT generate or explain anything outside the tool call.
Only respond with the correct tool and parameters.
`,

  tools: [connectDB],
});
