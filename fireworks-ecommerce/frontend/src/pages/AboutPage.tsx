import { Sparkles, Award, ShieldCheck, Truck } from "lucide-react";
import { Seo } from "../components/common/Seo";
import StaticPageLayout, { PolicySection } from "../components/common/StaticPageLayout";

const FEATURES = [
  { icon: Sparkles, title: "Lighting Up Lives", desc: "Since 2022" },
  { icon: Award, title: "Premium Quality", desc: "All our products are certified and tested for safety and performance" },
  { icon: ShieldCheck, title: "Safety First", desc: "We prioritize safety in every product we sell and every service we provide" },
  { icon: Truck, title: "Fast Delivery", desc: "Quick and secure delivery to your doorstep across India" },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About Us"
        description="Learn about Elite Eagle Crackers — Sivakasi's trusted, government-certified fireworks supplier since 2022."
        path="/about"
      />
      <StaticPageLayout
        title="About Elite Eagle Crackers"
        subtitle="Your trusted partner for premium quality firecrackers and celebrations since 2022"
      >
        <PolicySection title="Our Story">
          <p>
            Elite Eagle Crackers was founded with a simple mission: to bring joy and excitement to every
            celebration while maintaining the highest standards of safety and quality.
          </p>
          <p>
            What started as a small family business in Sivakasi has grown into one of India's trusted names
            in fireworks, serving hundreds of happy customers across the country.
          </p>
          <p>
            We believe that every celebration deserves spectacular fireworks, and we're committed to making
            that happen safely and responsibly.
          </p>
        </PolicySection>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 text-center">
              <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-dark dark:text-gray-100 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <PolicySection title="Our Commitment">
          <p>
            At Elite Eagle Crackers, we're committed to providing you with the finest selection of fireworks
            while ensuring complete safety and customer satisfaction. Our team carefully curates every
            product to meet the highest standards of quality, safety, and government certification (PESO).
          </p>
        </PolicySection>
      </StaticPageLayout>
    </>
  );
}
