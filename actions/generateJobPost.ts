"use server";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

export const generateSampleJobPost = async (description: string) => {
  if (description.length > 120) {
    return {
      success: false,
      error: "Prompt is too long does'nt send only jobdescription",
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
    const openai = new OpenAI({
      baseURL: process.env.OPENAI_BASEURL,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Extract ONLY the essential ATS information from this job role: "${description}"

Return ONLY:
1.**Role** (job role)
2. **Required Skills** (5-8 specific technical skills)
3. **Experience Level** (Junior/Mid/Senior + years)
4. **Key Responsibilities** (3-5 main duties)
5. **Must-Have Qualifications** (education, certifications, tools)

Format as a clean, structured list. No company info, benefits, or fluff.
Keep it under 200 words total.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    const samplePost = response.choices[0].message.content;

    if (!samplePost) {
      return {
        success: false,
        error: "No response provided from the AI",
      };
    }

    return {
      success: true,
      data: samplePost,
    };
  } catch (error) {
    console.error("Error generating sample job post", error);
    return {
      success: false,
      error: `Error generating sample job post: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
