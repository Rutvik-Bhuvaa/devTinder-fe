import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import {
  FaHeart,
  FaTimes,
  FaGithub,
  FaArrowRight,
  FaArrowLeft,
  FaBriefcase,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  setFeedProfiles,
  removeProfile,
  setLoading,
  setError,
  incrementPage,
} from "../utils/feedSlice";
import { motion, useAnimation } from "framer-motion";

// Simplified SwipeIndicators Component
const SwipeIndicators = ({ offsetX }) => (
  <>
    <div
      className={`fixed left-4 top-1/2 transform -translate-y-1/2 bg-red-600/80 text-white p-3 rounded-lg 
                    flex flex-col items-center transition-opacity duration-300 ${
                      offsetX < 0 ? "opacity-100" : "opacity-50"
                    }`}
    >
      <FaArrowLeft size={24} />
      <span className="text-sm mt-2">Not Interested</span>
    </div>
    <div
      className={`fixed right-4 top-1/2 transform -translate-y-1/2 bg-green-600/80 text-white p-3 rounded-lg 
                    flex flex-col items-center transition-opacity duration-300 ${
                      offsetX > 0 ? "opacity-100" : "opacity-50"
                    }`}
    >
      <FaArrowRight size={24} />
      <span className="text-sm mt-2">Interested</span>
    </div>
  </>
);

// Simplified LoadingCard Component
const LoadingCard = () => (
  <div className="flex justify-center items-center min-h-screen bg-base-200">
    <div className="card w-full max-w-md bg-base-100 shadow-xl overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-base-100 via-base-200 to-base-100 bg-[length:400%_100%]"></div>
        <div className="h-[28rem] bg-base-300 rounded-t-2xl"></div>
      </div>
    </div>
  </div>
);

// Simplified NoMoreProfiles Component
const NoMoreProfiles = ({ onRefresh }) => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-base-200 p-4">
    <div className="text-6xl mb-6 animate-bounce">🔍</div>
    <h2 className="text-2xl font-bold text-primary mb-4">No More Developers</h2>
    <button className="btn btn-primary mt-6" onClick={onRefresh}>
      Refresh
    </button>
  </div>
);

// First, update the ProfileDetailsModal component to make it more like Tinder
const ProfileDetailsModal = ({ profile, onClose, onSwipe }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-base-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-fadeIn">
        {/* Main Profile Image */}
        <div className="relative h-[40vh] md:h-[50vh]">
          <img
            src={
              profile.photoURL ||
              "https://via.placeholder.com/400x500?text=No+Photo"
            }
            alt={profile.firstName}
            className="w-full h-full object-cover"
          />
          <button
            className="absolute top-4 right-4 btn btn-circle btn-sm bg-black/50 hover:bg-black/80 border-2 border-white/50"
            onClick={onClose}
          >
            <FaTimes className="text-white" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              {profile.firstName} {profile.lastName}
              <span className="text-2xl text-primary">
                {profile.age || "?"}
              </span>
            </h2>
            <div className="flex items-center text-gray-300 mt-2">
              <FaBriefcase className="mr-2 text-primary" />
              <p>{profile.title || "Software Developer"}</p>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">About</h3>
            <p className="text-gray-300 leading-relaxed">
              {profile.about || "No bio available"}
            </p>
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-primary">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-lg badge-primary hover:badge-secondary
                    transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* GitHub Section */}
          {profile.githubUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <FaGithub />
                GitHub Profile
              </h3>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-primary gap-2 w-full"
              >
                <FaGithub size={20} />
                View GitHub Profile
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="sticky bottom-0 p-4 bg-base-100 border-t border-base-300
          flex justify-center gap-4 mt-4"
        >
          <button
            className="btn btn-circle btn-lg bg-red-600 hover:bg-red-700
              transform transition-all duration-300
              hover:scale-110 hover:rotate-12"
            onClick={() => {
              onClose();
              onSwipe(false);
            }}
          >
            <FaTimes size={30} />
          </button>
          <button
            className="btn btn-circle btn-lg bg-green-600 hover:bg-green-700
              transform transition-all duration-300
              hover:scale-110 hover:-rotate-12"
            onClick={() => {
              onClose();
              onSwipe(true);
            }}
          >
            <FaHeart size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Update the ProfileCard component with enhanced hover and swipe effects
const ProfileCard = React.forwardRef(
  (
    {
      profile,
      swipeDirection,
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
        {/* Like/Dislike Overlay Indicators */}
        {!preview && (
          <>
            {/* Like Overlay */}
            <div
              className={`absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded-2xl
                flex items-center justify-center
                transition-opacity duration-200
                ${offsetX > 50 ? "opacity-100" : "opacity-0"}
                group-hover:opacity-10
              `}
            >
              <div className="transform rotate-12 bg-green-500 text-white px-8 py-2 rounded-lg text-3xl font-bold border-4 border-white">
                LIKE
              </div>
            </div>

            {/* Dislike Overlay */}
            <div
              className={`absolute inset-0 bg-red-500/20 backdrop-blur-sm rounded-2xl
                flex items-center justify-center
                transition-opacity duration-200
                ${offsetX < -50 ? "opacity-100" : "opacity-0"}
                group-hover:opacity-10
              `}
            >
              <div className="transform -rotate-12 bg-red-500 text-white px-8 py-2 rounded-lg text-3xl font-bold border-4 border-white">
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

// Main Feed Component
const Feed = () => {
  const dispatch = useDispatch();
  const { profiles, loading, hasMore } = useSelector((state) => state.feed);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);

  const fetchProfiles = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      if (res.data && Array.isArray(res.data)) {
        dispatch(setFeedProfiles(res.data));
      }
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (profiles.length === 0 && !loading && hasMore) {
      fetchProfiles();
    }
  }, [profiles.length, loading, hasMore]);

  const handleSwipe = useCallback(
    async (liked) => {
      if (profiles.length === 0 || isTransitioning) return;

      const currentProfile = profiles[0];
      setIsTransitioning(true);

      try {
        setSwipeDirection(liked ? "right" : "left");
        await axios.post(
          `${BASE_URL}/request/send/${liked ? "interested" : "ignored"}/${
            currentProfile._id
          }`,
          {},
          { withCredentials: true }
        );

        setTimeout(() => {
          dispatch(removeProfile(currentProfile._id));
          setSwipeDirection(null);
          setOffsetX(0);
          setIsTransitioning(false);

          if (profiles.length <= 3 && hasMore) {
            dispatch(incrementPage());
            fetchProfiles();
          }
        }, 400);
      } catch (err) {
        console.error("Error processing swipe:", err);
        setSwipeDirection(null);
        setOffsetX(0);
        setIsTransitioning(false);
      }
    },
    [profiles, dispatch, hasMore, isTransitioning]
  );

  if (loading && profiles.length === 0) return <LoadingCard />;
  if (profiles.length === 0 && !loading && !hasMore) {
    return <NoMoreProfiles onRefresh={fetchProfiles} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <SwipeIndicators offsetX={offsetX} />

      {profiles.length > 0 && (
        <div className="w-full max-w-md relative">
          <ProfileCard
            key={profiles[0]._id}
            profile={profiles[0]}
            ref={cardRef}
            swipeDirection={swipeDirection}
            offsetX={offsetX}
            isTransitioning={isTransitioning}
            onSwipe={handleSwipe}
            onShowDetails={() => setShowDetails(true)}
          />

          {profiles[1] && (
            <div className="absolute top-0 left-0 right-0 -z-10 scale-[0.98] opacity-50">
              <ProfileCard profile={profiles[1]} preview />
            </div>
          )}
        </div>
      )}

      {showDetails && profiles.length > 0 && (
        <ProfileDetailsModal
          profile={profiles[0]}
          onClose={() => setShowDetails(false)}
          onSwipe={handleSwipe}
        />
      )}
    </div>
  );
};

export default Feed;
