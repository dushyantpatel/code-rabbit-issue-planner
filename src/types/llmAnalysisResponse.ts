/**
 * Interface representing an LLM analysis response.
 */
export interface LLMAnalysisResponse {
    labels: string[];
    assignedTo: string;
    confidence: number;
    priority?: 'low' | 'medium' | 'high';
}
