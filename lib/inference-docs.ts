const DEFAULT_API_BASE_URL = "http://localhost:8080";

export function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

export function chatEndpoint(modelId: string) {
  return `${apiBaseUrl()}/api/v1/models/${modelId}/chat`;
}

// These samples request "stream": false so a plain response.json() works
// out of the box. Responses stream by default (Server-Sent Events); omit
// "stream" (or pass true) to get tokens incrementally instead.

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
        # Responses stream by default. Set to true (or omit) for SSE chunks.
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
    // Responses stream by default. Set to true (or omit) for SSE chunks.
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
