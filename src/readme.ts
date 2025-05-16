import { marked } from 'marked';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get directory name for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read README content
const readmeContent = readFileSync(join(__dirname, '../README.md'), 'utf-8');

// Convert markdown to HTML synchronously and ensure string output
marked.setOptions({ async: false });
const htmlContent = marked.parse(readmeContent) as string;

// Wrap with basic styling
const htmlReadmeContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Code Rabbit Issue Planner</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
            line-height: 1.6;
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
            color: #24292e;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
        }
        code {
            font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 85%;
            background-color: #f6f8fa;
            border-radius: 3px;
            padding: 0.2em 0.4em;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        h1, h2 {
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>
`;

export { htmlReadmeContent };
