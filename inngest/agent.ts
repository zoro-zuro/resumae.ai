import {
  createNetwork,
  getDefaultRoutingAgent,
  openai,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import Events from "./constants";
import { analyseDoc } from "./angents/analyseDoc";
import { analyseMatch } from "./angents/analyseMatch";
import { saveToDb } from "./angents/saveToDb";
import { Id } from "@/convex/_generated/dataModel";

const agentNetwork = createNetwork({
  name: "Agent Team",
  agents: [analyseDoc, analyseMatch, saveToDb],
  defaultModel: openai({
    model: "gpt-4.1",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY_GPT_4,
  }),
  defaultRouter: ({ network }) => {
    const saved = network.state.kv.get("saved_to_db");
    if (saved) {
      return undefined;
    }

    return getDefaultRoutingAgent();
  },
});

export const getAnalysedResume = inngest.createFunction(
  { id: "Analyse the Resume" },
  { event: Events.SCAN_RESUME_ANALYSE_CTC },
  async ({ event }) => {
    const response = await agentNetwork.run(`
RESUME ANALYSIS WORKFLOW MAP

Available Agents and Their Tasks:
1. agent: analyseDoc
   - Tool: parseDoc
   - Purpose: Extract structured data from resume PDF
   - Output: JSON with skills, experience, education, etc.

2. agent: analyseMatch
   - Tool: matchingResume
   - Purpose: Compare resume data with job requirements
   - Input: Resume data from analyseDoc + job post
   - Output: JSON with matching scores ,recommendations,etc.

3.agent: saveToDb
   - Tool: save-resume-analysis.
   - Purpose: Save analysis and send email notification.
   - Input: Combined data from previous steps.
   - Output: Success/failure status.

Execution Flow:
1. Call analyseDoc → Parse PDF
2. Call analyseMatch → Compare with job
3. Call saveToDb → Store results and notify

Input Parameters:
resumeUrl: "${event.data.url}"
jobPost: ${JSON.stringify(event.data.jobPost)}
resumeId: "${event.data.resumeId}"
userEmail: "${event.data.userMail || "Not_provided"}"

Required: Follow exact execution order and pass complete data between steps.
If any errors you must give a valid log.
`);

    return response.state.kv.get("resumeId") as Id<"resume">;
  },
);
