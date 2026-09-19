import type { ReactNode } from "react";

interface LayoutProps {
  title: string;
  subtitle?: string;
  meta?: string;
  children: ReactNode;
}

export default function StaticPageLayout({ title, subtitle, meta, children }: LayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-gray-100 mb-3">{title}</h1>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        {meta && <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">{meta}</p>}
      </div>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="text-xl font-semibold text-dark dark:text-gray-100 mb-4">{title}</h2>
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>
    </section>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-dark dark:text-gray-100 mt-4 first:mt-0">{children}</h3>;
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 list-disc list-outside pl-5 marker:text-primary">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
