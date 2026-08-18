const DEFAULT_API_BASE_URL = "http://localhost:8080";

export function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

export function chatEndpoint(modelId: string) {
  return `${apiBaseUrl()}/api/v1/models/${modelId}/chat`;
}

// The OpenAI SDK appends "/chat/completions" and "/models" itself, so its
// base_url is the same "/api/v1" mount every other native route lives
// under. The Anthropic SDK appends "/v1/messages" itself, so its base_url
// stops one level up, at "/api".
export function openaiBaseUrl() {
  return `${apiBaseUrl()}/api/v1`;
}

export function anthropicBaseUrl() {
  return `${apiBaseUrl()}/api`;
}

// First-request samples are buffered (`stream: false`). Pass `stream: true`
// to receive tokens as server-sent events instead.

export function pythonSample(modelId: string) {
  return `import os
import requests

response = requests.post(
    "${chatEndpoint(modelId)}",
    headers={
        "Authorization": f"Bearer {os.environ['ORBIT_API_KEY']}",
        "Content-Type": "application/json",
    },
    json={
        "messages": [
            {"role": "user", "content": "Hello!"},
        ],
        "stream": False,
    },
)

print(response.json())`;
}

export function typescriptSample(modelId: string) {
  return `const response = await fetch("${chatEndpoint(modelId)}", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.ORBIT_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hello!" }],
    stream: false,
  }),
});

const data = await response.json();
console.log(data);`;
}

export function curlSample(modelId: string) {
  return `curl ${chatEndpoint(modelId)} \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{ "role": "user", "content": "Hello!" }],
    "stream": false
  }'`;
}

export function streamCurlSample(modelId: string) {
  return `curl ${chatEndpoint(modelId)} \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{ "role": "user", "content": "Hello!" }],
    "stream": true
  }'`;
}

// OpenAI SDK compatibility: swap base_url/api_key on the official `openai`
// client and it talks to Orbit unchanged. modelSlug is the catalogue
// entry's public slug (e.g. "claude-opus-5"), passed as the SDK's "model".

export function openaiPythonSample(modelSlug: string) {
  return `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["ORBIT_API_KEY"],
    base_url="${openaiBaseUrl()}",
)

response = client.chat.completions.create(
    model="${modelSlug}",
    messages=[
        {"role": "user", "content": "Hello!"},
    ],
    stream=False,
)

print(response.choices[0].message.content)`;
}

export function openaiTypescriptSample(modelSlug: string) {
  return `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.ORBIT_API_KEY,
  baseURL: "${openaiBaseUrl()}",
});

const response = await client.chat.completions.create({
  model: "${modelSlug}",
  messages: [{ role: "user", content: "Hello!" }],
  stream: false,
});

console.log(response.choices[0].message.content);`;
}

export function openaiCurlSample(modelSlug: string) {
  return `curl ${openaiBaseUrl()}/chat/completions \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelSlug}",
    "messages": [{ "role": "user", "content": "Hello!" }],
    "stream": false
  }'`;
}

export function openaiStreamCurlSample(modelSlug: string) {
  return `curl ${openaiBaseUrl()}/chat/completions \\
  -H "Authorization: Bearer $ORBIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelSlug}",
    "messages": [{ "role": "user", "content": "Hello!" }],
    "stream": true
  }'`;
}

// Anthropic SDK compatibility: swap base_url/api_key on the official
// `anthropic` client and it talks to Orbit unchanged.

export function anthropicPythonSample(modelSlug: string) {
  return `import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["ORBIT_API_KEY"],
    base_url="${anthropicBaseUrl()}",
)

message = client.messages.create(
    model="${modelSlug}",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"},
    ],
    stream=False,
)

print(message.content[0].text)`;
}

export function anthropicTypescriptSample(modelSlug: string) {
  return `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ORBIT_API_KEY,
  baseURL: "${anthropicBaseUrl()}",
});

const message = await client.messages.create({
  model: "${modelSlug}",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
  stream: false,
});

console.log(message.content[0].text);`;
}

export function anthropicCurlSample(modelSlug: string) {
  return `curl ${anthropicBaseUrl()}/v1/messages \\
  -H "x-api-key: $ORBIT_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelSlug}",
    "max_tokens": 1024,
    "messages": [{ "role": "user", "content": "Hello!" }],
    "stream": false
  }'`;
}

export function anthropicStreamCurlSample(modelSlug: string) {
  return `curl ${anthropicBaseUrl()}/v1/messages \\
  -H "x-api-key: $ORBIT_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelSlug}",
    "max_tokens": 1024,
    "messages": [{ "role": "user", "content": "Hello!" }],
    "stream": true
  }'`;
}
