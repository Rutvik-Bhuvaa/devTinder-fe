import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import {
  setFeedProfiles,
  removeProfile,
  setLoading,
  setError,
  incrementPage,
} from "../../utils/feedSlice";
import { SwipeIndicators } from "./components/SwipeIndicators";
import { LoadingCard } from "./components/LoadingCard";
import { NoMoreProfiles } from "./components/NoMoreProfiles";
import { ProfileCard } from "./components/ProfileCard";
import { ProfileDetailsModal } from "./components/ProfileDetailsModal";

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

        // Only show toast for keyboard actions
        if (offsetX === 0) {
          const toast = document.createElement("div");
          toast.className = `toast toast-end ${
            liked ? "toast-success" : "toast-error"
          }`;
          toast.innerHTML = `
            <div class="alert ${
              liked ? "bg-success/80" : "bg-error/80"
            } text-white backdrop-blur-sm">
              <span class="text-lg font-semibold">
                ${liked ? "❤️ Liked" : "✖️ Passed"} ${currentProfile.firstName}
              </span>
            </div>
          `;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 2000);
        }

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
    [profiles, dispatch, hasMore, isTransitioning, offsetX]
  );

  // Add keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isTransitioning || profiles.length === 0) return;

      if (e.key === "ArrowRight") {
        handleSwipe(true); // Like
      } else if (e.key === "ArrowLeft") {
        handleSwipe(false); // Dislike
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleSwipe, isTransitioning, profiles.length]);

  if (loading && profiles.length === 0) return <LoadingCard />;
  if (!loading && profiles.length === 0 && !hasMore) {
    return <NoMoreProfiles onRefresh={fetchProfiles} />;
  }

  if (profiles.length > 0) {
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
  }

  return <LoadingCard />;
};

export default Feed;
