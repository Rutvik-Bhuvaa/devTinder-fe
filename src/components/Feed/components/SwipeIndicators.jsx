import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

// Simplified SwipeIndicators Component

export const SwipeIndicators = ({ offsetX }) => (
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
