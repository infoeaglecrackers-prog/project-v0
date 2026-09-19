import { Seo } from "../components/common/Seo";
import StaticPageLayout, { PolicySection, SubHeading, BulletList } from "../components/common/StaticPageLayout";

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Terms of Service governing purchases and use of the Elite Eagle Crackers website."
        path="/terms"
        noIndex
      />
      <StaticPageLayout
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our services or making purchases."
        meta="Last updated: September 2026"
      >
        <PolicySection title="Introduction">
          <p>
            Welcome to Elite Eagle Crackers! These Terms of Service ("Terms") govern your use of our website
            and services. By accessing or using our services, you agree to be bound by these Terms. If you
            disagree with any part of these terms, then you may not access the service.
          </p>
        </PolicySection>

        <PolicySection title="🔞 Age Requirements">
          <p className="font-semibold text-dark dark:text-gray-100">
            IMPORTANT: You must be at least 18 years old to purchase fireworks.
          </p>
          <BulletList
            items={[
              "Valid government-issued ID required for delivery",
              "Adult signature required for all fireworks orders",
              "We reserve the right to refuse sale to minors",
              "Providing false age information is prohibited",
            ]}
          />
        </PolicySection>

        <PolicySection title="👤 Account Terms">
          <SubHeading>Account Creation</SubHeading>
          <BulletList
            items={[
              "You must provide accurate and complete information",
              "You are responsible for maintaining account security",
              "One account per person/entity",
              "You must notify us of any unauthorized use",
            ]}
          />
          <SubHeading>Account Responsibilities</SubHeading>
          <BulletList
            items={[
              "Maintain confidentiality of login credentials",
              "Use account only for lawful purposes",
              "Comply with all applicable laws and regulations",
              "Respect intellectual property rights",
            ]}
          />
        </PolicySection>

        <PolicySection title="🎆 Fireworks & Product Terms">
          <SubHeading>Legal Compliance</SubHeading>
          <BulletList
            items={[
              "All products comply with Indian fireworks regulations",
              "Some products may be restricted in certain areas",
              "Buyer responsible for checking local laws and regulations",
              "Use only as intended and follow all safety instructions",
            ]}
          />
          <SubHeading>Product Quality</SubHeading>
          <BulletList
            items={[
              "All products tested for quality and safety",
              "Licensed and certified (PESO) products only",
              "Proper storage and handling during transit",
              "Fresh stock with valid shelf life",
            ]}
          />
          <SubHeading>Safety Requirements</SubHeading>
          <BulletList
            items={[
              "Must be used by adults or under supervision",
              "Follow all safety instructions provided",
              "Use in open, safe areas only",
              "Keep away from flammable materials",
            ]}
          />
        </PolicySection>

        <PolicySection title="💳 Orders & Payment">
          <SubHeading>Order Processing</SubHeading>
          <BulletList
            items={[
              "Orders subject to acceptance and availability",
              "We reserve right to refuse or cancel orders",
              "Prices subject to change without notice",
              "Order confirmation does not guarantee acceptance",
            ]}
          />
          <SubHeading>Payment Terms</SubHeading>
          <BulletList
            items={[
              "Payment required at time of order",
              "All prices include applicable taxes",
              "Secure payment processing",
              "Minimum order value applies at checkout",
            ]}
          />
        </PolicySection>

        <PolicySection title="🚚 Shipping & Delivery">
          <SubHeading>Delivery Terms</SubHeading>
          <BulletList
            items={[
              "Delivery timelines are estimates",
              "Adult signature required for all deliveries",
              "Special handling for fireworks shipments",
              "Risk of loss transfers upon delivery",
            ]}
          />
          <SubHeading>Shipping Restrictions</SubHeading>
          <BulletList
            items={[
              "Some areas may have delivery restrictions",
              "Weather-dependent delivery for safety",
              "Cannot ship to PO boxes",
              "Special permits may be required in certain states",
            ]}
          />
        </PolicySection>

        <PolicySection title="🚫 Prohibited Uses">
          <p>You may not use our service:</p>
          <BulletList
            items={[
              "For any unlawful purpose or activity",
              "To violate any laws or regulations",
              "To resell products without authorization",
              "To harm, threaten, or harass others",
              "To transmit spam or malicious content",
              "To infringe on intellectual property",
              "To collect other users' information",
              "For commercial use without permission",
            ]}
          />
        </PolicySection>

        <PolicySection title="©️ Intellectual Property">
          <p>
            Our service and its original content, features, and functionality are owned by Elite Eagle
            Crackers and are protected by international copyright, trademark, patent, trade secret, and
            other intellectual property laws.
          </p>
          <SubHeading>Your License</SubHeading>
          <p>
            We grant you a limited, non-exclusive, non-transferable license to access and use our service
            for personal, non-commercial purposes in accordance with these Terms.
          </p>
        </PolicySection>

        <PolicySection title="⚠️ Disclaimers & Liability">
          <SubHeading>Product Disclaimer</SubHeading>
          <p>
            Fireworks are inherently dangerous products. Use at your own risk. We provide products with
            safety instructions, but cannot control how they are used. Users assume all responsibility for
            safe and legal use.
          </p>
          <SubHeading>Limitation of Liability</SubHeading>
          <p>
            To the maximum extent permitted by law, Elite Eagle Crackers shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, including:
          </p>
          <BulletList
            items={[
              "Property damage or personal injury from product use",
              "Lost profits or business interruption",
              "Data loss or corruption",
              "Third-party claims or damages",
            ]}
          />
        </PolicySection>

        <PolicySection title="🔚 Termination">
          <p>We may terminate your access if:</p>
          <BulletList
            items={[
              "You violate these Terms",
              "You provide false information",
              "You engage in fraudulent activity",
              "For any reason at our discretion",
            ]}
          />
          <p>Upon termination:</p>
          <BulletList
            items={[
              "Your access rights cease immediately",
              "Outstanding orders may be cancelled",
              "Data may be deleted after a notice period",
              "Some provisions survive termination",
            ]}
          />
        </PolicySection>

        <PolicySection title="⚖️ Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any
            disputes arising under or in connection with these Terms shall be subject to the exclusive
            jurisdiction of the courts in Sivakasi, Tamil Nadu, India.
          </p>
        </PolicySection>

        <PolicySection title="🔄 Changes to Terms">
          <p>We reserve the right to modify these Terms at any time. We will notify you of changes by:</p>
          <BulletList
            items={[
              'Posting updated Terms on our website',
              "Sending email notification for material changes",
              'Updating the "Last updated" date',
            ]}
          />
          <p>Continued use after changes constitutes acceptance of the new Terms.</p>
        </PolicySection>
      </StaticPageLayout>
    </>
  );
}
