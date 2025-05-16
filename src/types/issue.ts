import { IssueComment } from './internal/issueComment.js';

export interface Issue {
    id: string;
    title: string;
    description: string;
    author: string;
    createdAt: string;
    comments?: IssueComment[];
    labels?: string;
    assignedTo?: string;
    confidence?: number;
    priority?: 'low' | 'medium' | 'high';
    plan?: string;
}
