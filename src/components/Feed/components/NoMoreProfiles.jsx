// Simplified NoMoreProfiles Component

export const NoMoreProfiles = ({ onRefresh }) => (
  <div className="flex flex-col justify-center items-center min-h-screen bg-base-200 p-4">
    <div className="text-6xl mb-6 animate-bounce">🔍</div>
    <h2 className="text-2xl font-bold text-primary mb-4">No More Developers</h2>
    <button className="btn btn-primary mt-6" onClick={onRefresh}>
      Refresh
    </button>
  </div>
);
