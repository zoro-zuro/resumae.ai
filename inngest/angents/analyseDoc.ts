import { createAgent, createTool, openai } from "@inngest/agent-kit";
import z from "zod";
import { gemini } from "inngest";

const parseDoc = createTool({
  name: "ParseDoc",
  description:
    "You are a resume parser. Extract ONLY these key elements from the resume",
  parameters: z.object({
    docUrl: z.string().describe("The url of resume pdf to analyze."),
  }),
  handler: async ({ docUrl }, { step }) => {
    try {
      const response = await fetch(docUrl);
      if (!response.ok) {
        throw new Error(
          `Error in fetching the resume from url ${response.statusText}`,
        );
      }

      const pdfBuffer = await response.arrayBuffer();
      const ExtractedResume = Buffer.from(pdfBuffer).toString("base64");

      const result = await step?.ai.infer("pdf_parser", {
        model: gemini({
          model: "gemini-2.5-flash",
          apiKey: process.env.GEMINI_API_KEY,
          defaultParameters: {
            generationConfig: {
              // maxOutputTokens: 3094,
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
                  text: `You are a precise resume parsing system. Extract ONLY the following information from the PDF and return it in a strict JSON format.

Required Output Structure:
{
  "skills": string[],       // Technical skills, frameworks, programming languages
  "experience": string,     // Format: "X years total, Y years in [technology]"
  "education": string,      // Format: "Degree, Major, Institution, GPA"
  "jobTitles": string[],   // Previous positions held
  "companies": string[],    // Employers for each role
  "achievements": string[], // Quantifiable results (numbers, percentages)
  "certifications": string[], // Professional certifications only
  "keywords": string[]     // Industry-specific terms
}

Rules:
1. Return ONLY the JSON object - no explanations
2. Ensure all arrays contain strings
3. Keep experience as a single formatted string
4. Include only verifiable technical skills
5. Format education as a single comprehensive string
6. Include only measurable achievements
7. Extract only relevant industry keywords
8. Ensure all the feild are extracted everything is must

DO NOT:
- Add additional fields
- Include personal information
- Add explanatory text
- Modify the JSON structure
`,
                },
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: ExtractedResume,
                  },
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

export const analyseDoc = createAgent({
  name: "analyseDoc",
  description: "Extract key resume data for ATS analysis",
  system: `
You are a PDF resume parser with access to the ParseDoc tool.

Available Tool:
- Name: ParseDoc
- Purpose: Extract structured data from resume PDF
- Input: PDF document URL
- Output Format (JSON):
  {
    "skills": string[],       // Technical skills list
    "experience": string,     // Total years and tech-specific experience
    "education": string,      // Highest degree details
    "jobTitles": string[],    // Previous job titles
    "companies": string[],    // Previous employers
    "achievements": string[], // Measurable accomplishments
    "certifications": string[], // Professional certifications
    "keywords": string[]     // Industry-relevant terms
  }

Task:
1. Use ParseDoc tool to analyze the PDF
2. Extract ONLY the specified data points
3. Return structured JSON exactly as specified
4. Ensure all arrays are properly formatted
5. Validate data types before returning
6. all of the above metioned output is must needed

Do not include additional information or explanations.
`,

  model: openai({
    model: "gpt-4.1-mini",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY_GPT_4_MINI,
    defaultParameters: {
      // max_completion_tokens: 3094,
    },
  }),
  tools: [parseDoc],
});
