import { Issue } from './issue.js';
import { LLMAnalysisResponse } from './llmAnalysisResponse.js';
import { LLMIssuePlanResponse } from './llmIssuePlanResponse.js';

/**
 * LLMClient interface for interacting with a Large Language Model (LLM) service.
 */
export interface LLMClient {
    analyzeIssue(input: Issue): Promise<LLMAnalysisResponse>;
    planIssue(input: Issue): Promise<LLMIssuePlanResponse>;
}
