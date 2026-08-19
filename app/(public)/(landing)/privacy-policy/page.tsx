import type { Metadata } from "next";

import { LegalLayout, Section } from "../_components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Orbit — how we collect, use, and store account and inference data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="August 19, 2026">
      <Section title="1. Introduction">
        <p>
          This Privacy Policy describes how Orbit (&quot;Orbit,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;) handles information when you use tryorbit.cloud, the dashboard,
          playground, and inference API.
        </p>
        <p>
          It covers only what the Service actually collects and uses today. By
          using Orbit, you agree to these practices.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>
          <strong className="text-white/80">Account information.</strong> Sign-up
          and sign-in run through Clerk. We receive identifiers Clerk provides,
          typically your user id, email address, name, and profile image URL, and
          we store those on our side to create your user record.
        </p>
        <p>
          <strong className="text-white/80">Organizations.</strong> We store
          organization name, slug, membership, and role (admin or member) so
          workspaces, keys, credits, and usage can be scoped to a team.
        </p>
        <p>
          <strong className="text-white/80">API keys.</strong> When you create a
          key we store a cryptographic hash, a short preview, name, creator,
          expiry, last-used time, and revocation status. We do not keep the full
          secret after it is shown to you.
        </p>
        <p>
          <strong className="text-white/80">Inference and usage.</strong> For each
          billed request we store organization, API key (if used), model,
          truncated last user message (up to 4,000 characters), input and output
          token counts, latency, success or error status, a short error summary
          when a provider call fails, and credit amounts. This powers the usage
          dashboard and billing ledger.
        </p>
        <p>
          <strong className="text-white/80">Payments.</strong> Paid plans are
          handled by Dodo Payments. We receive plan, credit grant, and
          transaction metadata needed to apply credits. We do not store full
          payment card numbers on Orbit servers.
        </p>
        <p>
          <strong className="text-white/80">Support.</strong> If you email{" "}
          <a
            href="mailto:hello@tryorbit.cloud"
            className="text-white/75 underline-offset-2 hover:text-white hover:underline"
          >
            hello@tryorbit.cloud
          </a>
          , we keep that correspondence.
        </p>
      </Section>

      <Section title="3. How We Use Information">
        <p>We use this information to:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>Create and authenticate accounts through Clerk</li>
          <li>Run inference and return model outputs</li>
          <li>Bill credits, apply signup and plan grants, and show usage</li>
          <li>Let you manage API keys and organization members</li>
          <li>Apply rate limits and investigate abuse</li>
          <li>Respond to support requests</li>
          <li>Comply with law and enforce the Terms of Service</li>
        </ul>
      </Section>

      <Section title="4. How Inference Is Processed">
        <p>
          When you send a chat request from the API or the playground, Inputs are
          forwarded to Amazon Bedrock (and Bedrock Mantle for supported GPT-5
          models) so the selected model can generate a response. Those providers
          process Inputs under their own terms.
        </p>
        <p>
          We keep the usage record described above — including a truncated last
          user message — so we can bill accurately and show request history. We
          do not sell your prompts.
        </p>
        <p>
          Playground traffic uses your Clerk session instead of an API key and is
          still billed to your organization&apos;s credits.
        </p>
      </Section>

      <Section title="5. How We Share Information">
        <p>We share information only as needed to operate Orbit:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>
            <strong className="text-white/80">Clerk</strong> — authentication and
            session
          </li>
          <li>
            <strong className="text-white/80">Amazon Web Services / Amazon
            Bedrock</strong>{" "}
            — hosting and model inference
          </li>
          <li>
            <strong className="text-white/80">Dodo Payments</strong> — checkout
            and subscriptions
          </li>
          <li>
            <strong className="text-white/80">Legal requests</strong> — when
            required by law or to protect the Service and its users
          </li>
        </ul>
        <p>We do not sell personal information.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We keep account, organization, key, credit, and usage records while the
          account is active and as needed to provide billing history. After you
          close an account we may retain logs, ledger entries, and support mail
          for security, accounting, or legal reasons.
        </p>
      </Section>

      <Section title="7. Security">
        <p>
          Traffic to the Service uses HTTPS. API keys are stored hashed. Access
          to production systems is limited. No method of transmission or storage
          is perfectly secure, and we cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="8. Your Choices">
        <p>You can:</p>
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          <li>Update profile details through Clerk where that is available</li>
          <li>Revoke API keys in the dashboard</li>
          <li>Stop sending traffic or close your account</li>
        </ul>
        <p>
          Depending on where you live, you may also have rights to access,
          correct, or delete personal information. To make a request, email{" "}
          <a
            href="mailto:hello@tryorbit.cloud"
            className="text-white/75 underline-offset-2 hover:text-white hover:underline"
          >
            hello@tryorbit.cloud
          </a>
          .
        </p>
      </Section>

      <Section title="9. Cookies">
        <p>
          Clerk and the website use cookies and similar storage for sign-in,
          session, and security. Disabling them may prevent you from staying
          signed in.
        </p>
      </Section>

      <Section title="10. Children">
        <p>
          Orbit is not directed to children under 13, and we do not knowingly
          collect personal information from children under 13. If you believe a
          child has created an account, contact us and we will delete it.
        </p>
      </Section>

      <Section title="11. International Users">
        <p>
          Inference currently runs in Amazon Bedrock&apos;s US East (N. Virginia)
          region. If you use Orbit from elsewhere, your Inputs and account data
          may be processed in the United States, which may have different privacy
          laws than your country.
        </p>
      </Section>

      <Section title="12. Changes">
        <p>
          We may update this policy. When we do, we will revise the &quot;Last
          updated&quot; date above. Continued use of Orbit after an update means you
          accept the revised policy.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Questions about privacy:{" "}
          <a
            href="mailto:hello@tryorbit.cloud"
            className="text-white/75 underline-offset-2 hover:text-white hover:underline"
          >
            hello@tryorbit.cloud
          </a>
        </p>
      </Section>
    </LegalLayout>
  );
}
