"use server";

import { currentUser } from "@clerk/nextjs/server";
import Groq from "groq-sdk"; // Make sure you installed with: npm install groq-sdk

export const generateSampleJobPost = async (description: string) => {
  if (description.length > 120) {
    return {
      success: false,
      error: "Prompt is too long — send only job description",
    };
  }

  if (!description) {
    return {
      success: false,
      error: "No description provided",
    };
  }

  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      error: "User not authenticated",
    };
  }

  try {
    const client = new Groq({
      // baseURL: process.env.GROQ_BASE_URL,
      apiKey: process.env.GROQ_API_KEY!,
    });

    const prompt = `
Extract ONLY the essential ATS information from this job role: "${description}"

Return ONLY:
1. **Role** (job role)
2. **Required Skills** (5-8 specific technical skills)
3. **Experience Level** (Junior/Mid/Senior + years)
4. **Key Responsibilities** (3-5 main duties)
5. **Must-Have Qualifications** (education, certifications, tools)

Format as a clean, structured list. No company info, benefits, or fluff.
Keep it under 200 words total.
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    const samplePost = response.choices[0]?.message?.content;

    if (!samplePost) {
      return {
        success: false,
        error: "No response provided from the AI",
      };
    }

    return {
      success: true,
      data: samplePost.trim(),
    };
  } catch (error) {
    console.error("Error generating sample job post", error);
    return {
      success: false,
      error: `Error generating sample job post: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};
