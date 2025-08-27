import React, { useState, useEffect } from 'react';

const FoodShowcase = () => {
  const [activeFood, setActiveFood] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const foodSpread = [
    {
      emoji: '🍔',
      name: 'Gourmet Burger',
      rating: 4.8,
      description: 'Juicy beef patty with premium toppings',
      color: 'from-amber-400 to-orange-500',
      shadowColor: 'shadow-amber-500/30',
    },
    {
      emoji: '🍕',
      name: 'Wood Fired Pizza',
      rating: 4.9,
      description: 'Authentic Italian style with fresh basil',
      color: 'from-red-400 to-pink-500',
      shadowColor: 'shadow-red-500/30',
    },
    {
      emoji: '🍜',
      name: 'Ramen Bowl',
      rating: 4.7,
      description: 'Rich tonkotsu broth with tender chashu',
      color: 'from-orange-400 to-red-500',
      shadowColor: 'shadow-orange-500/30',
    },
    {
      emoji: '🌮',
      name: 'Street Tacos',
      rating: 4.6,
      description: 'Authentic Mexican flavors in every bite',
      color: 'from-yellow-400 to-orange-500',
      shadowColor: 'shadow-yellow-500/30',
    },
    {
      emoji: '🥗',
      name: 'Fresh Salad',
      rating: 4.5,
      description: 'Crisp greens with house vinaigrette',
      color: 'from-green-400 to-emerald-500',
      shadowColor: 'shadow-green-500/30',
    },
    {
      emoji: '🍰',
      name: 'Artisan Cake',
      rating: 4.9,
      description: 'Decadent layers of pure indulgence',
      color: 'from-pink-400 to-purple-500',
      shadowColor: 'shadow-pink-500/30',
    },
  ];

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setActiveFood((prev) => (prev + 1) % foodSpread.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, foodSpread.length]);

  return (
    <div
      className="lg:w-full relative mt-24"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-2xl">
        {/* Main showcase area */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${foodSpread[activeFood].color} transition-all duration-700 ease-in-out`}
        >
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${10 + i * 8}%`,
                  top: `${15 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + (i % 3)}s`,
                }}
              />
            ))}
          </div>

          {/* Main food display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div
                className="text-9xl mb-4 animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                {foodSpread[activeFood].emoji}
              </div>

              {/* Food info overlay */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 mx-4">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {foodSpread[activeFood].name}
                </h3>
                <p className="text-white/90 text-sm mb-3">
                  {foodSpread[activeFood].description}
                </p>

                {/* Rating stars */}
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(foodSpread[activeFood].rating)
                          ? 'text-yellow-400'
                          : 'text-white/40'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                  <span className="text-white font-semibold ml-2">
                    {foodSpread[activeFood].rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 right-4">
            <div
              className="w-12 h-12 border-4 border-white/30 rounded-full animate-spin"
              style={{ animationDuration: '8s' }}
            />
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-8 h-8 border-2 border-white/30 rotate-45 animate-pulse" />
          </div>
        </div>

        {/* Navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {foodSpread.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveFood(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === activeFood
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Side navigation arrows */}
        <button
          onClick={() =>
            setActiveFood((prev) =>
              prev === 0 ? foodSpread.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 hover:scale-110"
        >
          ‹
        </button>
        <button
          onClick={() =>
            setActiveFood((prev) => (prev + 1) % foodSpread.length)
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl font-bold transition-all duration-200 hover:scale-110"
        >
          ›
        </button>

        {/* Hover overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-all duration-300" />
        )}
      </div>

      {/* Food grid preview below */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {foodSpread.map((food, i) => (
          <button
            key={i}
            onClick={() => setActiveFood(i)}
            className={`aspect-square rounded-lg p-2 text-2xl transition-all duration-300 ${
              i === activeFood
                ? `bg-gradient-to-br ${food.color} ${food.shadowColor} shadow-lg scale-110`
                : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            {food.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FoodShowcase;
