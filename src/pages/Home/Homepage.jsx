// src/pages/Home/HomePage.jsx
import React from "react";
import HeroSection from "./HeroSection";
import HighlightedItems from "./HighlightedItems";
import ParallaxSection from "./ParallaxSection";
import Footer from "./Footer";

export default function HomePage(){
  return (
    <main>
      <HeroSection />
      <HighlightedItems />
      <ParallaxSection />
      <Footer />
    </main>
  );
}

