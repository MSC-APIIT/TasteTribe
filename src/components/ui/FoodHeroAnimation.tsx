import React, { useState, useEffect } from 'react';

const FoodHeroAnimation = () => {
  const [currentFood, setCurrentFood] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const foodItems = [
    { icon: '🍔', name: 'Burger', color: 'text-amber-500' },
    { icon: '🍕', name: 'Pizza', color: 'text-red-500' },
    { icon: '🌮', name: 'Taco', color: 'text-yellow-500' },
    { icon: '🍜', name: 'Ramen', color: 'text-orange-500' },
    { icon: '🥗', name: 'Salad', color: 'text-green-500' },
    { icon: '🍰', name: 'Cake', color: 'text-pink-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFood((prev) => (prev + 1) % foodItems.length);
        setIsAnimating(false);
      }, 150);
    }, 2500);

    return () => clearInterval(interval);
  }, [foodItems.length]);

  return (
    <div className="w-full h-64 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={
              'absolute w-4 h-4 rounded-full bg-orange-200 opacity-30 animate-pulse'
            }
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + (i % 2)}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Rotating food icon */}
        <div
          className={`text-8xl mb-4 transition-all duration-300 ${isAnimating ? 'scale-125 rotate-12' : 'scale-100 rotate-0'}`}
        >
          {foodItems[currentFood].icon}
        </div>

        {/* Food name with color transition */}
        <div
          className={`text-2xl font-bold transition-all duration-300 ${foodItems[currentFood].color} ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}`}
        >
          {foodItems[currentFood].name}
        </div>

        {/* Subtitle */}
        <div className="text-gray-600 mt-2 text-lg">
          Discover Amazing Flavors
        </div>

        {/* Animated stars */}
        <div className="flex justify-center mt-3 space-x-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="text-yellow-400 text-xl animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Bottom wave effect */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-16"
          viewBox="0 0 400 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 30 C100 10, 200 50, 400 30 L400 60 L0 60 Z"
            fill="rgba(251, 146, 60, 0.1)"
          />
          <path
            d="M0 40 C100 20, 200 60, 400 40 L400 60 L0 60 Z"
            fill="rgba(251, 146, 60, 0.05)"
          />
        </svg>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {foodItems.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentFood ? 'bg-orange-500 scale-125' : 'bg-orange-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodHeroAnimation;
