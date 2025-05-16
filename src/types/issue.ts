import { throwHttpError } from '../common/errors.js';
import { IssueComment } from './issueComment.js';

/**
 * Interface representing an issue
 */
interface Issue {
    id: string;
    title: string;
    description: string;
    author: string;
    createdAt: string | Date;
    comments?: IssueComment[];
    labels?: string;
    assignedTo?: string;
    confidence?: number;
    priority?: 'low' | 'medium' | 'high';
    plan?: string;
}

/**
 * Class representing an issue
 */
class IssueClass implements Issue {
    id: string;
    title: string;
    description: string;
    author: string;
    createdAt: Date;
    comments?: IssueComment[];
    labels?: string;
    assignedTo?: string;
    confidence?: number;
    priority?: 'low' | 'medium' | 'high';
    plan?: string;

    constructor(
        id: string,
        title: string,
        description: string,
        author: string,
        createdAt: string,
        comments?: IssueComment[],
        labels?: string,
        assignedTo?: string,
        confidence?: number,
        priority?: 'low' | 'medium' | 'high',
        plan?: string,
    ) {
        // Validate mandatory fields
        if (!id || !title || !description || !author || !createdAt) {
            const missing = [
                !id && 'id',
                !title && 'title',
                !description && 'description',
                !author && 'author',
                !createdAt && 'createdAt',
            ]
                .filter(Boolean)
                .join(', ');

            throwHttpError(
                400,
                `Please ensure issue has all required fields - missing: ${missing}`,
            );
        }

        // set fields
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.createdAt = new Date(createdAt);
        this.comments = comments;
        this.labels = labels;
        this.assignedTo = assignedTo;
        this.confidence = confidence;
        this.priority = priority;
        this.plan = plan;
    }

    static fromJson(input: unknown): IssueClass {
        if (!input || typeof input !== 'object') {
            throwHttpError(400, 'Invalid issue data: must be an object');
        }

        const json = input as Record<string, unknown>;

        // Validate required fields
        if (!json.id || typeof json.id !== 'string') {
            throwHttpError(400, 'Invalid issue data: id must be a string');
        }
        if (!json.title || typeof json.title !== 'string') {
            throwHttpError(400, 'Invalid issue data: title must be a string');
        }
        if (!json.description || typeof json.description !== 'string') {
            throwHttpError(400, 'Invalid issue data: description must be a string');
        }
        if (!json.author || typeof json.author !== 'string') {
            throwHttpError(400, 'Invalid issue data: author must be a string');
        }
        if (!json.createdAt || typeof json.createdAt !== 'string') {
            throwHttpError(400, 'Invalid issue data: createdAt must be a string');
        }

        // Type check optional fields
        if (json.labels !== undefined && typeof json.labels !== 'string') {
            throwHttpError(400, 'Invalid issue data: labels must be a string');
        }
        if (json.assignedTo !== undefined && typeof json.assignedTo !== 'string') {
            throwHttpError(400, 'Invalid issue data: assignedTo must be a string');
        }
        if (json.confidence !== undefined && typeof json.confidence !== 'number') {
            throwHttpError(400, 'Invalid issue data: confidence must be a number');
        }
        if (
            json.priority !== undefined &&
            !['low', 'medium', 'high'].includes(json.priority as string)
        ) {
            throwHttpError(400, 'Invalid issue data: priority must be low, medium, or high');
        }
        if (json.plan !== undefined && typeof json.plan !== 'string') {
            throwHttpError(400, 'Invalid issue data: plan must be a string');
        }

        return new IssueClass(
            json.id,
            json.title,
            json.description,
            json.author,
            json.createdAt,
            Array.isArray(json.comments) ? json.comments : undefined,
            json.labels,
            json.assignedTo,
            typeof json.confidence === 'number' ? json.confidence : undefined,
            typeof json.priority === 'string'
                ? (json.priority as 'low' | 'medium' | 'high')
                : undefined,
            json.plan,
        );
    }

    toString(): string {
        return `${this.title} (Priority: ${this.priority ?? 'not set'}) assigned to ${this.assignedTo ?? 'unassigned'}`;
    }

    toJSON(): Issue {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            author: this.author,
            createdAt: this.createdAt.toISOString(),
            comments: this.comments,
            labels: this.labels,
            assignedTo: this.assignedTo,
            confidence: this.confidence,
            priority: this.priority,
            plan: this.plan,
        };
    }
}

export { Issue, IssueClass };
