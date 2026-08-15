const PROVIDER_LABEL: Record<string, string> = {
  bedrock: "Amazon Bedrock",
};

export function providerLabel(provider: string) {
  return PROVIDER_LABEL[provider] ?? provider;
}
