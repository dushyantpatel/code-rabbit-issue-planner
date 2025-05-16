import { Issue } from '../types/issue.js';
import { LLMClient } from '../types/llmClient.js';
import { LLMAnalysisResponse } from '../types/llmAnalysisResponse.js';
import { LLMIssuePlanResponse } from '../types/llmIssuePlanResponse.js';
import { log } from '../common/logger.js';

/**
 * A mock implementation of the LLMClient interface for testing purposes.
 * This can be replaced with a real LLM service integration later.
 */
class MockLLMClient implements LLMClient {
    private readonly assignees = ['alice@example.com', 'bob@example.com', 'charlie@example.com'];

    private readonly labels = [
        'bug',
        'feature',
        'enhancement',
        'documentation',
        'refactoring',
        'testing',
    ];

    /**
     * Analyzes an issue and returns mocked analysis results
     */
    async analyzeIssue(input: Issue): Promise<LLMAnalysisResponse> {
        log.info(`Starting analysis for issue: ${input.id}`, 'MockLLMClient');

        // Simulate some async work
        log.debug('Simulating LLM processing time', 'MockLLMClient');
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Calculate a deterministic response based on the input
        const hash = this.hashString(input.id + input.title + input.description);
        log.debug(`Generated hash for issue ${input.id}: ${hash.toString()}`, 'MockLLMClient');

        // Select 1-3 labels based on the hash
        const labelCount = (hash % 3) + 1;
        const selectedLabels = this.selectRandomItems(this.labels, labelCount, hash);
        log.debug(
            `Selected ${labelCount.toString()} labels: ${selectedLabels.join(', ')}`,
            'MockLLMClient',
        );

        // Select an assignee
        const assigneeIndex = hash % this.assignees.length;
        const assignedTo = this.assignees[assigneeIndex];
        log.debug(`Selected assignee: ${assignedTo}`, 'MockLLMClient');

        // Generate a confidence score (0.5-1.0)
        const confidence = 0.5 + (hash % 50) / 100;

        // Determine priority based on confidence
        const priority = confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low';
        log.debug(
            `Determined priority: ${priority} with confidence: ${confidence.toString()}`,
            'MockLLMClient',
        );

        log.info(`Completed analysis for issue: ${input.id}`, 'MockLLMClient');
        return {
            labels: selectedLabels,
            assignedTo,
            confidence,
            priority,
        };
    }

    /**
     * Generates a mock plan for an issue
     */
    async planIssue(input: Issue): Promise<LLMIssuePlanResponse> {
        log.info(`Starting plan generation for issue: ${input.id}`, 'MockLLMClient');

        // Simulate some async work
        log.debug('Simulating LLM processing time for planning', 'MockLLMClient');
        await new Promise((resolve) => setTimeout(resolve, 500));

        const plan = this.generatePlan(input);
        log.debug(`Generated plan for issue ${input.id}`, 'MockLLMClient');
        log.info(`Completed plan generation for issue: ${input.id}`, 'MockLLMClient');

        return {
            plan,
        };
    }

    /**
     * Generates a simple hash from a string for deterministic results
     */
    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    /**
     * Selects n random items from an array using a seed for deterministic results
     */
    private selectRandomItems<T>(items: T[], n: number, seed: number): T[] {
        const selected: T[] = [];
        const available = [...items];

        for (let i = 0; i < n && available.length > 0; i++) {
            const index = seed % available.length;
            selected.push(available[index]);
            available.splice(index, 1);
        }

        return selected;
    }

    /**
     * Generates a mock plan based on the issue content
     */
    private generatePlan(issue: Issue): string {
        const plans = [
            `1. Review the requirements\n2. Create test cases\n3. Implement the solution\n4. Update documentation`,
            `1. Analyze impact\n2. Design solution\n3. Implement changes\n4. Test thoroughly\n5. Deploy`,
            `1. Investigate root cause\n2. Develop fix\n3. Add regression tests\n4. Submit PR`,
        ];

        const planIndex = this.hashString(issue.id + issue.title) % plans.length;
        return plans[planIndex];
    }
}

export { MockLLMClient };
