import {
  createNetwork,
  getDefaultRoutingAgent,
  openai,
} from "@inngest/agent-kit";
import { inngest } from "./client";
import Events from "./constants";
import { analyeseDoc } from "./angents/analyseDoc";
import { analyseMatch } from "./angents/analyseMatch";
import { saveToDb } from "./angents/saveToDb";

const agentNetwork = createNetwork({
  name: "Agent Team",
  agents: [analyeseDoc, analyseMatch, saveToDb],
  defaultModel: openai({
    model: "gpt-4o",
    baseUrl: process.env.OPENAI_BASEURL,
    apiKey: process.env.OPENAI_API_KEY,
  }),
  defaultRouter: ({ network }) => {
    const savedToDb = network.state.kv.get("saved_to_db");
    if (savedToDb) {
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
TASK: Analyze resume for ATS compatibility

STEP 1: Extract key data from resume at: ${event.data.url}
STEP 2: Compare against job requirements: ${event.data.jobPost}  
STEP 3: Generate ATS score and recommendations
STEP 4: Save results to database with ID: ${event.data.resumeId}

Focus on:
- Skills matching
- Experience level alignment  
- ATS keyword optimization
- Specific improvement suggestions

Once saved to database, mark as complete.
`);

    return response.state.kv.get("resumeId");
  },
);
