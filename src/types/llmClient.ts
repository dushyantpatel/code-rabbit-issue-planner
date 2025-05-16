import { Issue } from './issue.js';
import { LLMAnalysisResponse } from './llmAnalysisResponse.js';
import { LLMIssuePlanResponse } from './llmIssuePlanResponse.js';

export interface LLMClient {
    analyzeIssue(input: Issue): Promise<LLMAnalysisResponse>;
    planIssue(input: Issue): Promise<LLMIssuePlanResponse>;
}
