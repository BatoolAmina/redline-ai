import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeatureShowcase from "@/components/FeatureShowcase";
import SupportedDocuments from "@/components/SupportedDocuments";
import TrustSection from "@/components/TrustSection";
import FAQ from "@/components/FAQ";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <FeatureShowcase />
        <TrustSection />
        <SupportedDocuments />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}