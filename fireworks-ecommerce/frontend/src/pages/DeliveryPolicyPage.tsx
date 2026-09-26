import { Seo } from "../components/common/Seo";
import StaticPageLayout, { PolicySection, BulletList } from "../components/common/StaticPageLayout";

export default function DeliveryPolicyPage() {
  return (
    <>
      <Seo
        title="Delivery & Packaging Policy"
        description="Delivery charges, packaging fees, and special handling followed by Elite Eagle Crackers for every fireworks shipment."
        path="/delivery-policy"
      />
      <StaticPageLayout title="💰 Delivery & Packaging Fees">
        <PolicySection title="🚚 Delivery Charges">
          <p className="font-semibold text-dark dark:text-gray-100">
            Important: Delivery fees are decided by the lorry service provider based on:
          </p>
          <BulletList
            items={[
              "Distance from our warehouse in Sivakasi to your location",
              "Total weight and volume of your order",
              "Special handling requirements for fireworks",
              "Current fuel prices and transportation costs",
            ]}
          />
          <p>The exact delivery charge will be communicated to you before confirming your order.</p>
        </PolicySection>

        <PolicySection title="🎆 Special Handling for Fireworks">
          <BulletList
            items={[
              "⚠️ All fireworks are shipped with special safety packaging and handling protocols",
              "🚚 Delivery by trained personnel who understand fireworks safety requirements",
              "📄 All shipments include safety instructions and legal compliance documents",
              "🏠 Adult signature required for delivery (18+ years)",
            ]}
          />
        </PolicySection>
      </StaticPageLayout>
    </>
  );
}
