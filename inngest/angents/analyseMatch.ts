import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { gemini } from "inngest";
import z from "zod";

const matchingResume = createTool({
  name: "matchingResume",
  description: "Compare resume data against job requirements",
  parameters: z.object({
    jobPost: z
      .string()
      .describe(
        "Job post to check with the given skills, experience, education, jobTitles, keyAchievements, tools, keywords from resume",
      ),
    skills: z.array(z.string()).describe("Technical skills mentioned"),
    experience: z.string().describe("Years of experience"),
    education: z.string().describe("Degree, certifications"),
    jobTitles: z.array(z.string()).describe("Previous roles"),
    keyAchievements: z.array(z.string()).describe("Quantifiable results"),
    tools: z.array(z.string()).describe("Software, frameworks, languages"),
    keywords: z.array(z.string()).describe("Relevant keywords from job post"),
  }),
  handler: async (
    {
      skills,
      education,
      experience,
      jobTitles,
      keyAchievements,
      tools,
      keywords,
      jobPost,
    },
    { step },
  ) => {
    try {
      const result = await step?.ai.infer("resume_jobpost", {
        model: gemini({
          model: "gemini-2.5-flash",
          apiKey: process.env.GEMINI_API_KEY,
          defaultParameters: {
            generationConfig: {
              maxOutputTokens: 3094,
              temperature: 0.1,
              topP: 0.1,
            },
          },
        }),
        body: {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a precise ATS matching engine. Analyze the resume against job requirements and return ONLY a structured JSON response.

Required Output Structure:
{
  "overallScore": number,        // 0-100, overall match score
  "skillsMatch": number,         // 0-100, percentage of matched skills
  "experienceMatch": boolean,    // true if meets experience requirements
  "keywordDensity": number,      // 0-100, percentage of keywords found
  "matchedSkills": string[],     // Skills found in both resume and job post
  "missingSkills": string[],     // Required skills not found in resume
  "recommendations": string[],    // Specific actions to improve match
  "keywordSuggestions": string[], // Keywords to add from job description
  "strengths": string[],         // Strong matches with job requirements
  "warnings": string[],          // Gaps or misalignments found
  "experienceGap": string,       // Specific experience gap description
  "aisummary": string           // Concise match analysis
}

Rules:
1. All scores must be integers between 0-100
2. experienceMatch must be strictly boolean
3. All arrays must contain only strings
4. No empty arrays - use ["None found"] if empty
5. experienceGap must be a clear, specific string
6. aisummary must be under 100 words
7. You have a maxOutputTokens: 3094 try to answer consise within it.


Analyze these inputs:
Job Post: ${jobPost}
Skills: ${JSON.stringify(skills)}
Experience: ${experience}
Education: ${education}
Job Titles: ${JSON.stringify(jobTitles)}
Key Achievements: ${JSON.stringify(keyAchievements)}
Tools: ${JSON.stringify(tools)}
Keywords: ${JSON.stringify(keywords)}`,
                },
              ],
            },
          ],
        },
      });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const analyseMatch = createAgent({
  name: "analyseMatch",
  description: "Compare resume against job requirements",
  model: openai({
    model: "gpt-4o",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY_GPT_4o,
    defaultParameters: {
      max_completion_tokens: 3094,
    },
  }),
  system: `
You are an ATS matching engine with access to the matches-resume-to-job tool.

Available Tool:
- Name: matchingResume
- Purpose: Score resume against job requirements
- Input: Resume data and job post
- Output Format (JSON):
  {
    "overallScore": number,        // Range: 0-100
    "skillsMatch": number,         // Percentage (0-100)
    "experienceMatch": boolean,    // true/false
    "keywordDensity": number,      // Percentage (0-100)
    "matchedSkills": string[],     // Found skills
    "missingSkills": string[],     // Missing skills
    "recommendations": string[],    // Improvement suggestions
    "keywordSuggestions": string[], // Keywords to add
    "strengths": string[],         // Strong points
    "warnings": string[],          // Potential issues
    "experienceGap": string,       // Experience difference
    "aisummary": string           // Brief analysis
  }

Task:
1. Compare resume data against job requirements
2. Calculate all metrics accurately
3. Return JSON with exact structure above
4. Ensure all number values are within valid ranges
5. Provide actionable recommendations
6. You have a maxOutputTokens: 3094 try to answer consise within it.


No additional explanations - return only the structured JSON.
`,
  tools: [matchingResume],
});
