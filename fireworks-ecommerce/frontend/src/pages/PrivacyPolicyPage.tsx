import { Seo } from "../components/common/Seo";
import StaticPageLayout, { PolicySection, SubHeading, BulletList } from "../components/common/StaticPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Elite Eagle Crackers collects, uses, and protects your personal information."
        path="/privacy-policy"
        noIndex
      />
      <StaticPageLayout
        title="Privacy Policy"
        subtitle="Your privacy is important to us. Learn how we collect, use, and protect your information."
        meta="Last updated: September 2026"
      >
        <PolicySection title="Introduction">
          <p>
            Elite Eagle Crackers ("we," "our," or "us") is committed to protecting your privacy. This
            Privacy Policy explains how your personal information is collected, used, and disclosed by
            Elite Eagle Crackers when you visit our website or make purchases from us.
          </p>
        </PolicySection>

        <PolicySection title="📊 Information We Collect">
          <SubHeading>Personal Information</SubHeading>
          <BulletList
            items={[
              "Name and contact information (phone number, email address)",
              "Billing and shipping addresses",
              "Payment information (processed securely by our payment providers)",
              "Order history and preferences",
              "Account credentials and security information",
            ]}
          />
          <SubHeading>Automatically Collected Information</SubHeading>
          <BulletList
            items={[
              "Device information (IP address, browser type, operating system)",
              "Usage data (pages visited, time spent, clicks)",
              "Location information (with your consent)",
              "Cookies and similar tracking technologies",
            ]}
          />
        </PolicySection>

        <PolicySection title="⚙️ How We Use Your Information">
          <SubHeading>Order Processing</SubHeading>
          <BulletList
            items={[
              "Process and fulfill your orders",
              "Send order confirmations and updates",
              "Handle returns and exchanges",
              "Provide customer support",
            ]}
          />
          <SubHeading>Account Management</SubHeading>
          <BulletList
            items={[
              "Create and maintain your account",
              "Personalize your experience",
              "Save your preferences",
              "Provide order history",
            ]}
          />
          <SubHeading>Communication</SubHeading>
          <BulletList
            items={[
              "Send promotional emails (with consent)",
              "Important service announcements",
              "Safety and regulatory updates",
              "Customer surveys and feedback",
            ]}
          />
          <SubHeading>Legal & Safety</SubHeading>
          <BulletList
            items={[
              "Comply with legal requirements",
              "Verify age for fireworks purchases",
              "Prevent fraud and abuse",
              "Enforce our terms of service",
            ]}
          />
        </PolicySection>

        <PolicySection title="🤝 Information Sharing">
          <p>We do not sell your personal information to third parties.</p>
          <p>We may share your information in the following circumstances:</p>
          <BulletList
            items={[
              "Service Providers: Payment processors, shipping companies, and other service providers",
              "Legal Requirements: When required by law or to protect our rights",
              "Business Transfers: In case of merger, acquisition, or sale of business",
              "Consent: When you explicitly consent to sharing",
            ]}
          />
        </PolicySection>

        <PolicySection title="🔒 Data Security">
          <SubHeading>Technical Safeguards</SubHeading>
          <BulletList
            items={[
              "SSL encryption for all data transmission",
              "Secure payment processing",
              "Regular security audits and updates",
              "Access controls and authentication",
            ]}
          />
          <SubHeading>Organizational Measures</SubHeading>
          <BulletList
            items={[
              "Employee training on data protection",
              "Limited access to personal data",
              "Regular privacy assessments",
              "Incident response procedures",
            ]}
          />
        </PolicySection>

        <PolicySection title="⚖️ Your Rights and Choices">
          <SubHeading>Access & Control</SubHeading>
          <BulletList
            items={[
              "Access your personal information",
              "Update or correct your data",
              "Delete your account",
              "Download your data",
            ]}
          />
          <SubHeading>Communication Preferences</SubHeading>
          <BulletList
            items={[
              "Unsubscribe from marketing emails",
              "Opt out of SMS notifications",
              "Manage cookie preferences",
              "Control location sharing",
            ]}
          />
        </PolicySection>

        <PolicySection title="📩 Contact Us">
          <p>If you have any questions about this Privacy Policy or how we handle your data, reach out to us:</p>
          <p>
            <a href="mailto:infoeaglecrackers@gmail.com" className="text-primary hover:underline">infoeaglecrackers@gmail.com</a>
            {" "}· +91 78678 56523 / +91 94876 47417
            <br />
            Sivakasi - Kalugumalai Rd, Sivakasi, Thayilpatti, Tamil Nadu 626128
          </p>
        </PolicySection>
      </StaticPageLayout>
    </>
  );
}
