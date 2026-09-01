import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import Footer from "@/components/landing/Footer";
const Index = () => {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeaturesShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

