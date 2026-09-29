import "./globals.css";

const siteUrl = "https://redline.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Redline — Turn fine print into plain sense",
    template: "%s | Redline",
  },
  description:
    "Upload any contract, insurance policy, or medical form and get a plain-language summary, risk-flagged clauses, and answers to your exact questions — grounded in the document itself.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  alternates: { canonical: "/" },
  keywords: [
    "document simplifier",
    "AI contract summary",
    "plain language legal documents",
    "insurance policy explainer",
    "RAG document Q&A",
  ],
  authors: [{ name: "Redline" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Redline — Turn fine print into plain sense",
    description:
      "Upload any contract, insurance policy, or medical form and get a plain-language summary, risk-flagged clauses, and grounded answers to your questions.",
    siteName: "Redline",
  },
  twitter: {
    card: "summary_large_image",
    title: "Redline — Turn fine print into plain sense",
    description:
      "Upload any dense document and get a plain-language summary, risk-flagged clauses, and grounded answers.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Redline",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI-powered document simplifier that turns legal, insurance, and medical documents into plain language with risk-flagged clauses and a grounded Q&A chat.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <html lang="en">
      <body className="bg-paper text-ink font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}