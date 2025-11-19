import React from "react";
import { Link } from "react-router-dom";

function Dot() {return (<svg className="h-2.5 w-2.5 fill-emerald-600" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" /></svg>);} 

export default function HeroSection(){
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-100 via-white to-amber-100" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Your friendly corner store — fresh, fast, and fair.</h1>
            <p className="mt-4 text-slate-700 text-base sm:text-lg leading-relaxed">Everyday essentials, local produce, and treats you'll love. Order online and pick up in minutes — or swing by and say hi!</p>
            <div className="mt-8 flex items-center gap-3">
              <Link to="/products" className="inline-flex items-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-sky-700 active:bg-sky-800">Shop products</Link>
              <a href="#contact" className="inline-flex items-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 hover:border-sky-500">Contact us</a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
              <li className="inline-flex items-center gap-2"><Dot /> Open 7 days</li>
              <li className="inline-flex items-center gap-2"><Dot /> Pickup available</li>
              <li className="inline-flex items-center gap-2"><Dot /> Fresh & affordable</li>
            </ul>
          </div>
          <div>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-sky-200/50 blur-2xl" />
              <img alt="Corner Grocer" className="w-full rounded-3xl shadow-xl ring-1 ring-black/5" src="./Metrash-Hero.webp"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
