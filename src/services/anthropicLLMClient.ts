import { Issue } from '../types/issue.js';
import { LLMClient } from '../types/llmClient.js';
import { LLMAnalysisResponse } from '../types/llmAnalysisResponse.js';
import { LLMIssuePlanResponse } from '../types/llmIssuePlanResponse.js';
import { log } from '../common/logger.js';
import config from '../common/configLoader.js';

/**
 * Implementation of the LLMClient interface using Anthropic's Claude API.
 */
export class AnthropicLLMClient implements LLMClient {
    private readonly apiKey: string;
    private readonly model: string;
    private readonly baseUrl: string;
    private readonly maxRetries: number;

    constructor() {
        // Initialize with default values
        this.apiKey = '';
        this.model = 'claude-3-opus-20240229';
        this.baseUrl = 'https://api.anthropic.com/v1/messages';
        this.maxRetries = 3;

        // Get config values using our typed config
        const anthropicConfig = config.llm.anthropic;

        // Use the typed config values
        this.apiKey = anthropicConfig.apiKey;
        this.model = anthropicConfig.model;
        this.maxRetries = anthropicConfig.maxRetries;

        if (!this.apiKey) {
            throw new Error('Anthropic API key is not configured');
        }

        log.info('Initialized AnthropicLLMClient', 'AnthropicLLMClient');
    }

    /**
     * Analyzes an issue using Anthropic's Claude and returns analysis results
     */
    async analyzeIssue(input: Issue): Promise<LLMAnalysisResponse> {
        log.info(`Starting analysis for issue: ${input.id}`, 'AnthropicLLMClient');

        const prompt = this.createAnalysisPrompt(input);

        try {
            const result = await this.callAnthropicAPI(prompt);
            log.debug(`Received raw response from Anthropic`, 'AnthropicLLMClient');

            // Extract structured data from the response
            const parsedResponse = this.parseAnalysisResponse(result);
            log.info(`Completed analysis for issue: ${input.id}`, 'AnthropicLLMClient');

            return parsedResponse;
        } catch (error) {
            log.error(
                `Error analyzing issue with Anthropic: ${error instanceof Error ? error.message : String(error)}`,
                'AnthropicLLMClient',
            );
            throw error;
        }
    }

    /**
     * Generates a plan for an issue using Anthropic's Claude
     */
    async planIssue(input: Issue): Promise<LLMIssuePlanResponse> {
        log.info(`Starting plan generation for issue: ${input.id}`, 'AnthropicLLMClient');

        const prompt = this.createPlanningPrompt(input);

        try {
            const result = await this.callAnthropicAPI(prompt);
            log.debug(`Received raw response from Anthropic for planning`, 'AnthropicLLMClient');

            // Extract the plan from the response
            const plan = this.parsePlanningResponse(result);
            log.info(`Completed plan generation for issue: ${input.id}`, 'AnthropicLLMClient');

            return { plan };
        } catch (error) {
            log.error(
                `Error generating plan with Anthropic: ${error instanceof Error ? error.message : String(error)}`,
                'AnthropicLLMClient',
            );
            throw error;
        }
    }

    /**
     * Creates a structured prompt for issue analysis
     */
    private createAnalysisPrompt(issue: Issue): string {
        return `
You are an AI assistant that helps analyze software development issues. 
Please analyze the following issue and provide:
1. Appropriate labels (from: bug, feature, enhancement, documentation, refactoring, testing)
2. A suggested assignee (choose from: alice@example.com, bob@example.com, charlie@example.com)
3. A confidence score (between 0.5 and 1.0)
4. Priority level (low, medium, or high)

Issue ID: ${issue.id}
Title: ${issue.title}
Description: ${issue.description}
Author: ${issue.author}
Created At: ${String(issue.createdAt)}

Format your response as JSON with the following structure:
{
  "labels": ["label1", "label2"],
  "assignedTo": "email@example.com",
  "confidence": 0.X,
  "priority": "low|medium|high"
}
`;
    }

    /**
     * Creates a structured prompt for issue planning
     */
    private createPlanningPrompt(issue: Issue): string {
        return `
You are an AI assistant that helps plan software development tasks.
Please generate a detailed plan for the following issue:

Issue ID: ${issue.id}
Title: ${issue.title}
Description: ${issue.description}
Author: ${issue.author}
Created At: ${String(issue.createdAt)}

Provide a step-by-step plan to implement this issue. 
Format your response as a numbered list with clear, actionable steps.
`;
    }

    /**
     * Makes an API call to Anthropic's Claude
     */
    private async callAnthropicAPI(prompt: string, attempt = 1): Promise<string> {
        try {
            log.debug(
                `Making Anthropic API call (attempt ${String(attempt)})`,
                'AnthropicLLMClient',
            );

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1024,
                }),
            });

            if (!response.ok) {
                const errorData = (await response.json()) as Record<string, unknown>;
                throw new Error(
                    `Anthropic API error: ${String(response.status)} ${JSON.stringify(errorData)}`,
                );
            }

            const data = (await response.json()) as { content: { text: string }[] };
            return data.content[0].text;
        } catch (error) {
            if (attempt < this.maxRetries) {
                // Exponential backoff
                const delay = Math.pow(2, attempt) * 1000;
                log.warn(`API call failed, retrying in ${String(delay)}ms`, 'AnthropicLLMClient');
                await new Promise((resolve) => setTimeout(resolve, delay));
                return this.callAnthropicAPI(prompt, attempt + 1);
            } else {
                throw error;
            }
        }
    }

    /**
     * Parses the analysis response from Claude into structured format
     */
    private parseAnalysisResponse(response: string): LLMAnalysisResponse {
        try {
            // Try to extract JSON from the response
            const jsonMatch = /\{[\s\S]*\}/.exec(response);
            if (jsonMatch) {
                const jsonStr = jsonMatch[0];
                const parsed = JSON.parse(jsonStr) as LLMAnalysisResponse;

                // Validate the response structure
                if (
                    !Array.isArray(parsed.labels) ||
                    typeof parsed.assignedTo !== 'string' ||
                    typeof parsed.confidence !== 'number' ||
                    !['low', 'medium', 'high'].includes(parsed.priority ?? 'low')
                ) {
                    throw new Error('Invalid response structure');
                }

                return parsed;
            }

            throw new Error('Could not extract JSON from response');
        } catch (error) {
            log.error(
                `Failed to parse analysis response: ${error instanceof Error ? error.message : String(error)}`,
                'AnthropicLLMClient',
            );
            log.debug(`Raw response: ${response}`, 'AnthropicLLMClient');

            // Fallback to default values
            return {
                labels: ['bug'],
                assignedTo: 'alice@example.com',
                confidence: 0.5,
                priority: 'medium',
            };
        }
    }

    /**
     * Parses the planning response from Claude
     */
    private parsePlanningResponse(response: string): string {
        // Clean the response to extract just the plan
        // Remove any explanatory text that may appear before or after the plan
        let plan = response.trim();

        // Ensure the plan starts with "1."
        if (!plan.startsWith('1.')) {
            const planStart = plan.indexOf('1.');
            if (planStart >= 0) {
                plan = plan.substring(planStart);
            }
        }

        return plan;
    }
}
