// Simplified LoadingCard Component

export const LoadingCard = () => (
  <div className="flex justify-center items-center min-h-screen bg-base-200">
    <div className="card w-full max-w-md bg-base-100 shadow-xl overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-base-100 via-base-200 to-base-100 bg-[length:400%_100%]"></div>
        <div className="h-[28rem] bg-base-300 rounded-t-2xl"></div>
      </div>
    </div>
  </div>
);
