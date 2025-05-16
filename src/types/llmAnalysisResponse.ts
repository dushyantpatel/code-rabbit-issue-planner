export interface LLMAnalysisResponse {
    labels: string[];
    assignedTo: string;
    confidence: number;
    priority?: 'low' | 'medium' | 'high';
}
