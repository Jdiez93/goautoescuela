import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import Footer from "@/components/landing/Footer";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const handleFinish = useCallback(() => setShowSplash(false), []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={handleFinish} />}
      </AnimatePresence>
      {!showSplash && (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Hero />
            <HowItWorks />
            <FeaturesShowcase />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Index;

