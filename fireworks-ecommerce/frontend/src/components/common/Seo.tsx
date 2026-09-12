import { useEffect } from "react";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "product";
  keywords?: string[];
  noIndex?: boolean;
  jsonLd?: JsonLd;
}

const SITE_NAME = "Elite Eagle Crackers";
const DEFAULT_IMAGE = "/logo.png";
const DEFAULT_KEYWORDS = [

    "buy crackers online" ,
    "buy Diwali crackers online",
    "buy Sivakasi crackers online",
    "buy green crackers online",
    "order crackers online",
    "online cracker shopping",
    "buy PESO certified green crackers",
    "purchase green crackers online",
    "buy Diwali cracker combo online",
    "buy wholesale crackers online",
  

    "Sivakasi crackers online",
    "Sivakasi fireworks online",
    "Sivakasi factory price crackers",
    "Sivakasi direct crackers online",
    "best Sivakasi crackers shop online",
    "Sivakasi green crackers online",
    "Sivakasi wholesale crackers online",
    "Sivakasi crackers home delivery",
    "Sivakasi original crackers online",
    "green crackers online",
    "PESO certified green crackers",
    "eco friendly crackers online",
    "aerial skyshots online",
    "low noise green crackers",
    "smokeless crackers online",
    "kids friendly fireworks",
    "Diwali gift box crackers",
    "family cracker combo pack",
    "wholesale price crackers online",
    "discount crackers online",
    "cheap Sivakasi crackers online",
    "factory rate crackers online",
    "budget cracker packs online",
    "Diwali crackers online offers",
    "diwali cracker combo deals",
    "Elite Eagle Crackers",
    "PESO approved crackers",
    "CSIR NEERI certified green crackers",
    "authentic Sivakasi crackers",
    "licensed online cracker seller",
  
];


const getSiteUrl = () => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://www.eaglecrackers.com";
};

const absoluteUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  return `${getSiteUrl()}${value.startsWith("/") ? value : `/${value}`}`;
};

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  keywords = [],
  noIndex = false,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const pageTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const cleanDescription = description.slice(0, 160);
    const canonical = absoluteUrl(path || window.location.pathname);
    const imageUrl = absoluteUrl(image);
    const keywordText = [...DEFAULT_KEYWORDS, ...keywords].join(", ");

    document.title = pageTitle;

    upsertMeta('meta[name="description"]', { name: "description", content: cleanDescription });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywordText });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    });

    upsertLink("canonical", canonical);

    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: cleanDescription });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: cleanDescription });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });

    const existingJsonLd = document.head.querySelector('script[data-seo-jsonld="true"]');
    existingJsonLd?.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [description, image, jsonLd, keywords, noIndex, path, title, type]);

  return null;
}

export const seoAbsoluteUrl = absoluteUrl;
export const siteName = SITE_NAME;
