import type { Metadata } from "next";

import { LegalLayout, Section } from "../_components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Orbit — a unified inference API billed at Bedrock list rates.",
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="August 19, 2026">
      <Section title="1. Agreement to Terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
          Orbit website, dashboard, playground, and inference API (collectively, the
          &quot;Service&quot;).
        </p>
        <p>
          By creating an account, issuing an API key, or using the Service, you agree
          to these Terms. If you do not agree, do not use Orbit.
        </p>
      </Section>

      <Section title="2. Description of Service">
        <p>
          Orbit is a unified inference API. It lets you call frontier models through
          one interface, including OpenAI-compatible chat completions and
          Anthropic-compatible messages endpoints, a model catalogue, a
          Clerk-authenticated playground, organization workspaces, API keys, and a
          usage dashboard.
        </p>
        <p>
          Inference is fulfilled by third-party model providers. Today that is
          Amazon Bedrock (including Bedrock Mantle for supported GPT-5 models).
          Orbit routes each request to a configured provider and bills credits at
          Bedrock list rates, without adding a markup on those rates.
        </p>
        <p>
          We may add, change, or remove models, routes, and features at any time.
          The Service is provided on an &quot;as available&quot; basis.
        </p>
      </Section>

      <Section title="3. Eligibility and Accounts">
        <p>
          You must be at least 13 years old to use Orbit. If you are under 18, you
          may only use the Service with permission from a parent or legal guardian.
        </p>
        <p>
          Accounts are created through our identity provider, Clerk. You are
          responsible for activity under your account and for any organization
          workspace you belong to. Notify us immediately at{" "}
          <a
            href="mailto:hello@tryorbit.cloud"
            className="text-white/75 underline-offset-2 hover:text-white hover:underline"
          >
            hello@tryorbit.cloud
          </a>{" "}
          if you suspect unauthorized access.
        </p>
      </Section>

      <Section title="4. API Keys">
        <p>
          You may create API keys in the dashboard. We store a hash and a short
          preview of each key, not the full secret after it is shown to you.
        </p>
        <p>
          You are responsible for keeping keys secret and for all inference billed
          to keys issued for your organization. Revoke a key in the dashboard if it
          is lost or leaked.
        </p>
      </Section>

      <Section title="5. Your Prompts and Outputs">
        <p>
          You retain whatever rights you already have in prompts, messages, and
          other inputs you send to Orbit (&quot;Inputs&quot;) and in model outputs returned
          to you (&quot;Outputs&quot;).
        </p>
        <p>
          To run the Service, you grant Orbit a limited license to transmit Inputs
          to the selected model provider, receive Outputs, and keep the usage
          records described in our Privacy Policy — including a truncated copy of
          the last user message on a request, token counts, model, latency, and
          status.
        </p>
        <p>
          You represent that you have the rights needed to send Inputs, and that
          your use of Orbit does not violate applicable law or third-party rights.
        </p>
      </Section>

      <Section title="6. Acceptable Use">
        <p>You agree not to use Orbit to:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>Violate applicable law or another person&apos;s rights</li>
          <li>
            Probe, scrape, overload, reverse engineer, or disrupt the Service or
            its providers
          </li>
          <li>Share or resell access except as we expressly allow</li>
          <li>
            Bypass credit checks, rate limits, or authentication
          </li>
          <li>
            Submit Inputs you do not have the right to send to a model provider
          </li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules or that put
          the platform, providers, or other users at risk.
        </p>
      </Section>

      <Section title="7. Credits, Plans, and Payments">
        <p>
          Orbit uses organization credits. Credits are consumed when inference
          succeeds or fails after a provider call, based on billed token usage.
          Current plan prices, included credits, and features are shown on the
          pricing page.
        </p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>
            New accounts receive $2 in free credits to try the API. No card is
            required for that grant.
          </li>
          <li>
            Paid plans are monthly and processed by our payment partner, Dodo
            Payments. By subscribing, you authorize Dodo to charge the payment
            method you provide.
          </li>
          <li>
            Credits are billed at Amazon Bedrock list rates. Orbit does not add a
            markup on those rates.
          </li>
          <li>
            Unused monthly plan credits do not stack forever. Prices and plans may
            change.
          </li>
          <li>
            Custom volume, invoices, or a private setup can be discussed at{" "}
            <a
              href="mailto:hello@tryorbit.cloud"
              className="text-white/75 underline-offset-2 hover:text-white hover:underline"
            >
              hello@tryorbit.cloud
            </a>
            .
          </li>
        </ul>
        <p>
          Except where required by law, payments are non-refundable once credits
          are granted or inference is delivered. You are responsible for applicable
          taxes.
        </p>
      </Section>

      <Section title="8. Playground and Rate Limits">
        <p>
          The dashboard playground uses your signed-in Clerk session and bills the
          same organization credits as the API. Playground chats are not a
          substitute for storing production conversations.
        </p>
        <p>
          We apply rate limits to organization API traffic and to the playground
          so the Service stays available. Exceeding those limits may return an
          error until the window resets.
        </p>
      </Section>

      <Section title="9. Models and Outputs">
        <p>
          Models are operated by third-party providers. Outputs can be wrong,
          incomplete, or unsafe. You are responsible for reviewing Outputs before
          you rely on them or show them to others.
        </p>
        <p>
          We do not guarantee uptime, a particular model remaining listed, routing
          to a specific provider instance, or that any Output will be fit for a
          particular purpose.
        </p>
      </Section>

      <Section title="10. Intellectual Property">
        <p>
          The Orbit name, website, dashboard, and software are owned by the
          operator of the Service or its licensors. These Terms give you a limited
          right to use the Service, not ownership of our brand or underlying
          systems.
        </p>
      </Section>

      <Section title="11. Third-Party Services">
        <p>
          The Service depends on third parties, including Clerk (authentication),
          Amazon Web Services / Amazon Bedrock (inference), and Dodo Payments
          (checkout and subscriptions). Their terms and policies apply to their
          processing. We are not responsible for outages or changes on those
          platforms.
        </p>
      </Section>

      <Section title="12. Termination">
        <p>
          You may stop using Orbit at any time and revoke your API keys. We may
          suspend or terminate access if you breach these Terms, exhaust or abuse
          credits, fail to pay, or if we discontinue the Service.
        </p>
        <p>
          After termination, your right to call the API ends. We may delete
          account and usage data after a reasonable period, except where we must
          keep records for billing, security, or law.
        </p>
      </Section>

      <Section title="13. Disclaimer of Warranties">
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES
          OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT
          THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
        </p>
      </Section>

      <Section title="14. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR OF ORBIT WILL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE
          OF THE SERVICE.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE SERVICE WILL NOT
          EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID FOR ORBIT IN THE 12 MONTHS
          BEFORE THE CLAIM OR (B) USD $50.
        </p>
      </Section>

      <Section title="15. Changes">
        <p>
          We may update these Terms from time to time. When we do, we will revise
          the &quot;Last updated&quot; date on this page. Continued use of Orbit after
          changes become effective constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="16. Contact">
        <p>
          For questions about these Terms, email{" "}
          <a
            href="mailto:hello@tryorbit.cloud"
            className="text-white/75 underline-offset-2 hover:text-white hover:underline"
          >
            hello@tryorbit.cloud
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
