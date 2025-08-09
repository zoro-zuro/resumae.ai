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
            },
          },
        }),
        body: {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a resume parsing assistant. Analyze the attached PDF and extract the following structured information in JSON format:

{
  "skills": ["List of technical skills like React, Node.js, Python"],
  "experience": "Summary of total and relevant experience (e.g., 5 years total, 3 years React)",
  "education": "Highest degree, major, institution, and GPA (if available)",
  "jobTitles": ["Previous job titles held"],
  "companies": ["Associated companies for each role (if available)"],
  "achievements": ["Key accomplishments with measurable results"],
  "certifications": ["Professional certifications or licenses"],
  "keywords": ["Industry-relevant keywords or buzzwords"]
}

Respond only with a well-formatted JSON object.
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

export const analyeseDoc = createAgent({
  name: "Analyse Doc",
  description: "Extract key resume data for ATS analysis",
  system: `
You are a resume intelligence agent specializing in parsing resumes for Applicant Tracking Systems (ATS). Your role is to extract key structured data points that help in automated screening and job matching.

Extract and return ONLY the following elements:

- Technical Skills: Specific tools, languages, or frameworks.
- Experience: Total years and years per major technology/role.
- Education: Degree(s), institutions, and GPA (if stated).
- Roles & Companies: Previous job titles and associated companies.
- Achievements: Results-backed statements (e.g., "increased efficiency by 30%").
- Certifications: Any listed technical or professional credentials.
- Industry Keywords: Common buzzwords relevant to the domain or job type.

Avoid general summaries. Return concise, factual data points that can be used directly in downstream systems.
`,

  model: openai({
    model: "gpt-4o",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY,
    defaultParameters: {
      // max_completion_tokens: 3094,
    },
  }),
  tools: [parseDoc],
});
