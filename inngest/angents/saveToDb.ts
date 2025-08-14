import { api } from "@/convex/_generated/api";
import convex from "@/lib/convexClient";
import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { Id } from "@/convex/_generated/dataModel";
import z from "zod";
import { sendBrevo } from "@/lib/bervo/sendMail";

const connectDB = createTool({
  name: "connectDB",
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
    userMail: z.string().describe("Email address of the user"),
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
      userMail,
    } = params;

    const result = await context.step?.run("save-to-db", async () => {
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
      if (userMail !== null) {
        await sendBrevo({
          to: userMail,
          subject: `Your Resume Analysis for ${role}`,
          html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Resume Analysis Results</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #4f46e5;
      color: #ffffff;
      padding: 24px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 24px;
      line-height: 1.6;
    }
    .field {
      margin-bottom: 20px;
    }
    .label {
      font-weight: bold;
      color: #111827;
      font-size: 16px;
      margin-bottom: 8px;
      display: block;
    }
    .value {
      color: #374151;
      font-size: 14px;
      background-color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      border-left: 4px solid #4f46e5;
    }
    .button-container {
      text-align: center;
      padding: 20px 24px;
      background-color: #f8fafc;
    }
    .cta-button {
      display: inline-block;
      background-color: #4f46e5;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      padding: 14px 28px;
      font-size: 16px;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    .cta-button:hover {
      background-color: #4338ca;
    }
    .footer {
      background-color: #f3f4f6;
      color: #6b7280;
      text-align: center;
      padding: 16px;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
    
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0 10px;
      }
      .content {
        padding: 20px 16px;
      }
      .header {
        padding: 20px 16px;
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      🎯 Your Resume Analysis Results
    </div>
    
    <div class="content">
      <div class="field">
        <span class="label">Applied Role:</span>
        <div class="value">${role}</div>
      </div>

      <div class="field">
        <span class="label">AI Summary:</span>
        <div class="value">${aisummary}</div>
      </div>
    </div>
    
    <div class="button-container">
      <a href="https://resumae-ai.vercel.app/resume/${resumeId}" class="cta-button">
        📊 View Full Detailed Report
      </a>
    </div>
    
    <div class="footer">
      <p>Generated by Resume Analysis AI • ${new Date().toLocaleDateString()}</p>
      <p>Need help? Contact our support team</p>
    </div>
  </div>
</body>
</html>`,
        });
      }

      context.network?.state.kv.set("saved_to_db", true);
    }

    return result;
  },
});

export const saveToDb = createAgent({
  name: "saveToDb",
  description: "Save analysis results and send notifications",
  model: openai({
    model: "gpt-4.1-nano",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY_GPT_4o_MINI,
  }),
  system: `
You are a database operations agent with access to the save-resume-analysis tool.

Available Tool:
- Name: connectDB
- Purpose: Save analysis results and send email
- Input Parameters:
  {
    resumeId: string,              // Database ID
    userMail: string,              // Email address
    sampleJobPost: string,         // Job description
    role: string,                  // Job title
    resumeScore: number,           // Range: 0-100
    matchedSkills: string[],       // Matched skills
    missingSkills: string[],       // Missing skills
    recommendations: string[],      // Improvements
    keywordSuggestions: string[],  // Keywords
    experienceGap: string,         // Experience analysis
    aisummary: string,            // Overall summary
    skillsMatch: number,           // Range: 0-100
    experienceMatch: boolean,      // true/false
    keywordDensity: number,        // Range: 0-100
    strengths: string[],           // Strong points
    warnings: string[]             // Issues found
  }
- Output: { success: boolean, error?: string }

Task:
1. Validate all input parameters
2. Call save-resume-analysis with exact parameter structure
3. Handle email sending when userMail is provided
4. Return operation status

Do not modify data - pass through exactly as received.

`,

  tools: [connectDB],
});
