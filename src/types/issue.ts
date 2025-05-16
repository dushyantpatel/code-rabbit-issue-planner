import { HTTPError, throwHttpError } from '../common/errors.js';
import { IssueComment } from './issueComment.js';

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
        // check for mandatory fields
        if (
            null == id ||
            null == title ||
            null == description ||
            null == author ||
            null == createdAt
        ) {
            throwHttpError(
                400,
                'Please ensure issue has all required fields - id, title,  description, author, createdAt',
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

    static fromJson(json: any): IssueClass {
        return new IssueClass(
            json.id,
            json.title,
            json.description,
            json.author,
            json.createdAt,
            json.comments,
            json.labels,
            json.assignedTo,
            json.confidence,
            json.priority,
            json.plan,
        );
    }

    toString(): string {
        return `${this.title} (Priority: ${this.priority ?? 'not set'}) assigned to ${this.assignedTo ?? 'unassigned'}`;
    }
}

export { Issue, IssueClass };
