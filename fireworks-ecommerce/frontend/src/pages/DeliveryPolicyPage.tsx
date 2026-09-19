import { Seo } from "../components/common/Seo";
import StaticPageLayout, { PolicySection, BulletList } from "../components/common/StaticPageLayout";

const PACKAGING_TIERS: [string, string][] = [
  ["₹3,000 – ₹10,000", "₹100"],
  ["₹10,001 – ₹20,000", "₹200"],
  ["₹20,001 and above", "₹300"],
];

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

        <PolicySection title="📦 Packaging Charges">
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-gray-200 dark:border-white/10">
                  <th className="py-2 pr-4 font-semibold text-dark dark:text-gray-100">Order Value</th>
                  <th className="py-2 font-semibold text-dark dark:text-gray-100">Packaging Charge</th>
                </tr>
              </thead>
              <tbody>
                {PACKAGING_TIERS.map(([range, fee]) => (
                  <tr key={range} className="border-b border-gray-100 dark:border-white/5">
                    <td className="py-2 pr-4">{range}</td>
                    <td className="py-2 font-medium text-dark dark:text-gray-100">{fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            * Packaging charges are added to ensure safe delivery of fireworks with proper cushioning and protection.
          </p>
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
