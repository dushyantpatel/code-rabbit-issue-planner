/**
 * Interface representing an issue comment.
 */
interface IssueComment {
    author: string;
    createdAt: string | Date;
    text: string;
}

/**
 * Class representing an issue comment.
 */
class IssueCommentClass implements IssueComment {
    author: string;
    createdAt: Date;
    text: string;

    constructor(author: string, createdAt: string, text: string) {
        this.author = author;
        this.createdAt = new Date(createdAt);
        this.text = text;
    }

    toString(): string {
        return `[${this.createdAt}] ${this.author}: ${this.text}`;
    }
}

export { IssueComment, IssueCommentClass };
