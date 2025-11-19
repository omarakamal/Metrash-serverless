// src/pages/Home/ParallaxSection.jsx
import React from "react";

export default function ParallaxSection(){
  return (
    <section className="relative bg-fixed bg-center bg-cover" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop)` }}>
      <div className="bg-sky-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <blockquote className="mx-auto max-w-3xl text-white">
            <p className="text-xl sm:text-2xl font-semibold tracking-tight">“We’re your neighbors. We stock the things you need, and we smile when we see you.”</p>
            <footer className="mt-4 text-sm opacity-90">— The Corner Grocer Team</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

