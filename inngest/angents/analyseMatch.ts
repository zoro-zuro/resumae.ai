import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { gemini } from "inngest";
import z from "zod";

const matchingResume = createTool({
  name: "mathches-resumetojob",
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
You are an ATS matching engine.

Evaluate how well a candidate’s resume matches the provided job post. Respond ONLY with a JSON object in the following structure:

{
  "overallScore": 0–100,
  "skillsMatch": % of matched skills,
  "experienceMatch": true or false,
  "keywordDensity": % of job keywords found in resume,
  "matchedSkills": [List of matched skills],
  "missingSkills": [List of missing or weak skills],
  "recommendations": [How to improve alignment],
  "keywordSuggestions": [Extra keywords to include],
  "strengths": [Highlights relevant to the job],
  "warnings": [Potential gaps or issues],
  "experienceGap": "Explanation of missing experience if any",
  "aisummary": "Brief natural language summary comparing resume to job"
}

Be objective, concise, and accurate. Base scores only on the provided data. No extra explanation.No gibbreish.

Example Input:
Job Post: "Looking for a backend engineer skilled in Node.js, PostgreSQL, and AWS with 3+ years of experience."
Skills: ["Node.js", "Express.js", "MongoDB"]
Experience: "2 years"
Education: "BTech in Computer Science"
Job Titles: ["Backend Developer"]
Key Achievements: ["Reduced API latency by 40%"]
Tools: ["Git", "MongoDB"]
Keywords: ["Node.js", "PostgreSQL", "AWS"]

Expected Output:
{
  "overallScore": 65,
  "skillsMatch": 50,
  "experienceMatch": false,
  "keywordDensity": 33,
  "matchedSkills": ["Node.js"],
  "missingSkills": ["PostgreSQL", "AWS"],
  "recommendations": ["Gain experience in AWS and PostgreSQL", "Highlight relevant projects"],
  "keywordSuggestions": ["PostgreSQL", "AWS"],
  "strengths": ["Strong Node.js experience"],
  "warnings": ["Experience below required"],
  "experienceGap": "Requires 3+ years, candidate has 2",
  "aisummary": "Candidate is a strong backend developer but lacks required experience and PostgreSQL/AWS exposure."
}

Inputs:
- Job Post: ${jobPost}
- Skills: ${skills}
- Experience: ${experience}
- Education: ${education}
- Job Titles: ${jobTitles}
- Key Achievements: ${keyAchievements}
- Tools: ${tools}
- Keywords: ${keywords}
`,
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
  name: "generateMatch",
  description:
    "Score resume against job requirements and provide recommendations",
  model: openai({
    model: "gpt-4o",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY,
    defaultParameters: {
      max_completion_tokens: 3094,
    },
  }),
  system: `
You are an ATS evaluation agent. Your task is to evaluate how well a candidate's resume matches a job post. You must use a scoring rubric that includes:

- Skills Match %: Based on overlap of skills/tools between resume and job post.
- Experience Match: Boolean, based on required vs actual years of experience.
- Keyword Density: % of job keywords appearing in resume.
- Overall ATS Score: Weighted average of the above metrics (range 0–100).

You should also identify:
- Strengths in the resume relevant to the job.
- Gaps or mismatches (warnings).
- Recommendations to improve the resume for better alignment.
- Suggested keywords to include.

Respond in structured JSON format only.
`,
  tools: [matchingResume],
});
