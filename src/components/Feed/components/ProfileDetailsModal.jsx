import { FaTimes, FaHeart, FaGithub, FaBriefcase } from "react-icons/fa";

// First, update the ProfileDetailsModal component
export const ProfileDetailsModal = ({ profile, onClose, onSwipe }) => {
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
