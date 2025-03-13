import { motion, useAnimation } from "framer-motion";
import {
  FaHeart,
  FaTimes,
  FaGithub,
  FaArrowRight,
  FaArrowLeft,
  FaBriefcase,
} from "react-icons/fa";
import React from "react";

// Update the ProfileCard component with enhanced hover and swipe effects

export const ProfileCard = React.forwardRef(
  (
    {
      profile,
      offsetX,
      isTransitioning,
      onSwipe,
      onShowDetails,
      preview = false,
    },
    ref
  ) => {
    const controls = useAnimation();

    const handleDragEnd = async (_, info) => {
      if (isTransitioning) return;

      if (Math.abs(info.offset.x) > 100) {
        const direction = info.offset.x > 0;
        await controls.start({
          x: direction ? 300 : -300,
          opacity: 0,
          rotate: direction ? 20 : -20,
        });
        onSwipe(direction);
      } else {
        controls.start({ x: 0, rotate: 0 });
      }
    };

    if (!profile) return null;

    return (
      <motion.div
        ref={preview ? null : ref}
        drag={!preview && "x"}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ scale: preview ? 0.98 : 1 }}
        className={`card bg-base-100 shadow-xl 
          ${preview ? "" : "cursor-grab active:cursor-grabbing"}
          group
          hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
          transition-all duration-300 ease-in-out
          hover:scale-[1.02]
          hover:border-2 hover:border-primary/30
          relative
          ${
            offsetX > 50
              ? "border-r-4 border-r-green-500"
              : offsetX < -50
              ? "border-l-4 border-l-red-500"
              : ""
          }
        `}
      >
        {/* Simple Stamp Overlays */}
        {!preview && (
          <>
            {/* Like Stamp */}
            <div
              className={`absolute top-20 right-10 z-50 ${
                offsetX > 50 ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg text-4xl font-bold rotate-12 border-4 border-white shadow-lg">
                LIKE
              </div>
            </div>

            {/* Nope Stamp */}
            <div
              className={`absolute top-20 left-10 z-50 ${
                offsetX < -50 ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="bg-red-500 text-white px-6 py-3 rounded-lg text-4xl font-bold -rotate-12 border-4 border-white shadow-lg">
                NOPE
              </div>
            </div>
          </>
        )}

        <figure className="relative h-[28rem] overflow-hidden rounded-t-2xl">
          <img
            src={
              profile.photoURL ||
              "https://via.placeholder.com/400x500?text=No+Photo"
            }
            alt={profile.firstName}
            className="w-full h-full object-cover 
              transition-transform duration-300 
              group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x500?text=Error";
            }}
          />

          {/* Info Button */}
          {!preview && (
            <button
              className="absolute top-4 right-4 z-10 
                btn btn-circle btn-sm bg-black/50 hover:bg-black/80 
                border-2 border-white/50 hover:border-white
                transform transition-all duration-300
                hover:scale-110 text-white hover:text-primary"
              onClick={onShowDetails}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}

          {!preview && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6
              transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2"
            >
              <h2 className="text-3xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {profile.firstName} {profile.lastName}, {profile.age || "?"}
              </h2>
              <div className="flex items-center text-white/90 mb-3">
                <FaBriefcase className="mr-2 group-hover:text-primary transition-colors" />
                <p className="group-hover:text-primary transition-colors">
                  {profile.title || "Software Developer"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {profile.skills?.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-sm badge-primary 
                      transform transition-all duration-300
                      group-hover:scale-110 group-hover:shadow-glow
                      hover:badge-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </figure>

        {!preview && (
          <div className="card-actions justify-center p-4 gap-12">
            <button
              className="btn btn-circle btn-lg bg-red-600 hover:bg-red-700
                transform transition-all duration-300
                hover:scale-110 hover:rotate-12 hover:shadow-lg
                active:scale-95"
              onClick={() => onSwipe(false)}
            >
              <FaTimes size={30} />
            </button>
            <button
              className="btn btn-circle btn-lg bg-green-600 hover:bg-green-700
                transform transition-all duration-300
                hover:scale-110 hover:-rotate-12 hover:shadow-lg
                active:scale-95"
              onClick={() => onSwipe(true)}
            >
              <FaHeart size={30} />
            </button>
          </div>
        )}
      </motion.div>
    );
  }
);
