import React from "react";
import { Fireworks } from "react-fireworks";

const fxOptions = {
  rocketsPoint: {
    min: 0,
    max: 100
  },
  hue: {
    min: 0,
    max: 360
  },
  delay: {
    min: 15,
    max: 30
  },
  speed: 2,
  acceleration: 1.02,
  friction: 0.98,
  gravity: 1.2,
  particles: 90,
  trace: 5,
  explosion: 7
};

export default function FireworksShowcase() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A2E] via-[#23234d] to-[#0f0f1c] overflow-hidden">
      {/* Fireworks Animation */}
      <Fireworks
        width={window.innerWidth}
        height={window.innerHeight}
        options={fxOptions}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}
      />
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-24">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg animate-pulse">
          Celebrate with <span className="text-yellow-400">Crackers</span>!
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-200 max-w-2xl animate-fade-in">
          The brightest, safest, and most spectacular fireworks for every festival. Shop online and light up your celebrations!
        </p>
        <a
          href="#shop"
          className="mt-10 px-10 py-4 bg-gradient-to-r from-orange-500 via-yellow-400 to-pink-500 text-white text-2xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce"
        >
          Shop Now
        </a>
        {/* Product Highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl animate-fade-in-up">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl hover:scale-105 transition-transform">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Sparklers" className="w-28 h-28 mx-auto rounded-full shadow-lg border-4 border-yellow-400" />
            <h2 className="mt-6 text-2xl font-bold text-yellow-300">Sparklers</h2>
            <p className="mt-2 text-gray-100">Safe, colorful, and perfect for all ages.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl hover:scale-105 transition-transform">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Aerial Rockets" className="w-28 h-28 mx-auto rounded-full shadow-lg border-4 border-pink-400" />
            <h2 className="mt-6 text-2xl font-bold text-pink-300">Aerial Rockets</h2>
            <p className="mt-2 text-gray-100">Light up the sky with dazzling colors.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl hover:scale-105 transition-transform">
            <img src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80" alt="Gift Boxes" className="w-28 h-28 mx-auto rounded-full shadow-lg border-4 border-orange-400" />
            <h2 className="mt-6 text-2xl font-bold text-orange-300">Gift Boxes</h2>
            <p className="mt-2 text-gray-100">Curated combos for every celebration.</p>
          </div>
        </div>
      </div>
      {/* Subtle overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 z-0 pointer-events-none" />
    </div>
  );
}
