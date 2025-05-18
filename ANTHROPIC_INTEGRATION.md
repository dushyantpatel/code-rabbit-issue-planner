# Anthropic (Claude) LLM Integration Guide

This document explains how to set up and use the Anthropic Claude LLM integration with the Code Rabbit Issue Planner.

## Setup

1. **Get an API Key from Anthropic**

    Sign up at [Anthropic's website](https://www.anthropic.com) and obtain an API key.

2. **Configure the API Key**

    There are two ways to set the API key:

    ### Option 1: Using the setup script

    Run the provided script to securely set your API key:

    ```bash
    node set-anthropic-key.js YOUR_API_KEY
    ```

    ### Option 2: Manually edit the config file

    Edit `src/config.json` and replace "YOUR_ANTHROPIC_API_KEY" with your actual API key:

    ```json
    "llm": {
        "provider": "anthropic",
        "anthropic": {
            "apiKey": "YOUR_ANTHROPIC_API_KEY",
            "model": "claude-3-opus-20240229",
            "maxRetries": 3
        }
    }
    ```

3. **Switch to Using Anthropic**

    In `src/config.json`, change the provider from "mock" to "anthropic":

    ```json
    "llm": {
        "provider": "anthropic",
        ...
    }
    ```

## Configuration Options

You can customize the Anthropic integration by modifying these options in `src/config.json`:

- **provider**: Set to "anthropic" to use Claude or "mock" to use the mock LLM client
- **model**: The Claude model to use (defaults to "claude-3-opus-20240229")
- **maxRetries**: Number of retry attempts for failed API calls (defaults to 3)

## Usage

Once configured, all calls to analyze issues or generate plans will automatically use Anthropic's Claude API instead of the mock implementation.

The integration implements the same `LLMClient` interface, so no code changes are needed in your controllers or other parts of the application.

## Testing

To verify your integration is working:

1. Set the provider to "anthropic" in config.json
2. Make sure your API key is properly set
3. Start the application: `npm run dev`
4. Create a test issue and call the analyze endpoint:

    ```bash
    curl -X POST http://localhost:8000/events \
      -H "Content-Type: application/json" \
      -d '{
        "id": "anthropic-test",
        "title": "Test Anthropic Integration",
        "description": "This is a test issue to verify Anthropic integration is working.",
        "author": "test@example.com",
        "createdAt": "2024-05-18T10:00:00Z"
      }'

    curl -X POST http://localhost:8000/analyze/anthropic-test
    ```

5. Check the logs to verify Anthropic API calls are being made

## Troubleshooting

- If you get authentication errors, double-check your API key
- If you exceed rate limits, try increasing the maxRetries value
- Check the application logs for detailed error information

## Switching Back to Mock Client

To switch back to the mock client (for development or testing), change the provider back to "mock" in `src/config.json`:

```json
"llm": {
    "provider": "mock",
    ...
}
```
