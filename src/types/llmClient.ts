import { Issue } from './issue';
import { LLMAnalysisResponse } from './llmAnalysisResponse';
import { LLMIssuePlanResponse } from './llmIssuePlanResponse';

export interface LLMClient {
    analyzeIssue(input: Issue): Promise<LLMAnalysisResponse>;
    planIssue(input: Issue): Promise<LLMIssuePlanResponse>;
}
