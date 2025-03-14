import axios from "axios";
import { BASE_URL } from "../utils/constants";
import {
  FaUser,
  FaCode,
  FaInfoCircle,
  FaImage,
  FaBriefcase,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

export const EditProfile = ({ user, onProfileUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    photo: "",
    firstName: "",
    lastName: "",
    age: "",
    about: "",
    skills: [],
    title: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const messageTimerRef = useRef(null);
  const dispatch = useDispatch();

  // Cleanup timer on unmount
  useEffect(() => {
    return () =>
      messageTimerRef.current && clearTimeout(messageTimerRef.current);
  }, []);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        photo: user.photoURL || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        about: user.about || "",
        title: user.title || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
      });
    }
  }, [user]);

  const validateName = (value) => {
    // Check if the input contains only letters, spaces, and hyphens
    return /^[A-Za-z\s-]+$/.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate firstName and lastName to ensure they only contain letters
    if (
      (name === "firstName" || name === "lastName") &&
      value &&
      !validateName(value)
    ) {
      setMessage({
        type: "error",
        text: `${
          name === "firstName" ? "First name" : "Last name"
        } must contain only letters, spaces, and hyphens.`,
      });
      return; // Don't update the form data
    }

    // Clear error message if valid input
    if (
      message?.type === "error" &&
      (name === "firstName" || name === "lastName")
    ) {
      setMessage(null);
    }

    setFormData({ ...formData, [name]: value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate names before submission
    if (formData.firstName && !validateName(formData.firstName)) {
      setMessage({
        type: "error",
        text: "First name must contain only letters, spaces, and hyphens.",
      });
      return;
    }

    if (formData.lastName && !validateName(formData.lastName)) {
      setMessage({
        type: "error",
        text: "Last name must contain only letters, spaces, and hyphens.",
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    try {
      // Only include fields that backend allows
      const updateData = {
        photoURL: formData.photo,
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age ? parseInt(formData.age) : undefined,
        about: formData.about,
        skills: formData.skills,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        updateData,
        { withCredentials: true }
      );

      // Update UI with response data
      if (response.data?.data) {
        setFormData({
          photo: response.data.data.photoURL || "",
          firstName: response.data.data.firstName || "",
          lastName: response.data.data.lastName || "",
          age: response.data.data.age || "",
          about: response.data.data.about || "",
          skills: Array.isArray(response.data.data.skills)
            ? response.data.data.skills
            : [],
          title: response.data.data.title || "",
        });

        // Update Redux state with new user data
        dispatch(addUser(response.data.data));

        // Show toast and call update function
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        onProfileUpdate?.();
      }

      // Set success message with timeout
      setMessage({
        type: "success",
        text: response.data.message || "Profile updated successfully!",
        userName: formData.firstName,
      });

      messageTimerRef.current = setTimeout(() => {
        setMessage((prev) => (prev?.type === "success" ? null : prev));
      }, 5000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data || "Failed to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Profile Card Preview Component
  const ProfileCardPreview = () => (
    <div className="card bg-base-100 shadow-xl w-full max-w-sm mx-auto hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 border border-base-300">
      <figure className="relative h-[20rem] overflow-hidden">
        <img
          src={
            formData.photo ||
            `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random&size=350`
          }
          alt="Profile Preview"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random&size=350`;
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
          <h2 className="text-3xl font-bold text-white mb-1">
            {formData.firstName} {formData.lastName}
            {formData.age ? `, ${formData.age}` : ""}
          </h2>
          <div className="flex items-center text-white/90 mb-3">
            <FaBriefcase className="mr-2" />
            <p>{formData.title || "Software Developer"}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="badge badge-sm badge-primary transform transition-all duration-300 hover:scale-110"
              >
                {skill}
              </span>
            ))}
            {formData.skills.length > 3 && (
              <span className="badge badge-sm badge-secondary">
                +{formData.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </figure>

      <div className="card-body">
        <h3 className="card-title text-lg font-semibold">About</h3>
        <p className="text-base-content/80">
          {formData.about || "No description provided yet."}
        </p>
        <div className="card-actions justify-center mt-4">
          <div className="badge badge-outline">Preview Mode</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl p-8 rounded-2xl shadow-2xl bg-base-100 transition-all border border-base-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] m-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Edit Your Profile</h2>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="btn btn-outline btn-primary gap-2"
        >
          <FaEye /> {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* Preview Card */}
      {showPreview && (
        <div className="mb-10 p-4 bg-base-200 rounded-xl">
          <h3 className="text-xl font-bold mb-6 text-center">
            Profile Preview
          </h3>
          <ProfileCardPreview />
          <div className="text-center mt-4 text-sm text-base-content/70">
            This is how your profile will appear to other developers
          </div>
        </div>
      )}

      {/* Alert Messages */}
      {message && (
        <div
          className={`alert mb-6 ${
            message.type === "success"
              ? "alert-success animate-pulse shadow-lg shadow-success/30"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center w-full">
            {message.type === "success" ? (
              <>
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Success!</p>
                  <p className="text-sm opacity-90">
                    {message.text ||
                      `Great job ${message.userName}! Your profile has been updated.`}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="badge badge-success badge-outline animate-bounce">
                    Updated
                  </div>
                </div>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{message.text}</span>
                <button
                  onClick={() => setMessage(null)}
                  className="ml-auto bg-red-700 hover:bg-red-800 p-1.5 rounded-full transition-colors duration-200 flex items-center justify-center"
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
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="avatar mb-4">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random&size=128`;
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-base-300">
                  <FaUser className="text-5xl text-base-content opacity-40" />
                </div>
              )}
            </div>
          </div>

          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text flex items-center">
                <FaImage className="mr-2" /> Profile Photo URL
              </span>
            </label>
            <input
              type="text"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="input input-bordered w-full focus:input-primary"
              placeholder="Enter photo URL"
            />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="card bg-base-200 shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-primary-focus flex items-center">
            <FaUser className="mr-2" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`input input-bordered ${
                  !validateName(formData.firstName) && formData.firstName
                    ? "input-error"
                    : "focus:input-primary"
                }`}
                placeholder="First Name"
                pattern="[A-Za-z\s-]+"
                title="First name must contain only letters, spaces, and hyphens"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`input input-bordered ${
                  !validateName(formData.lastName) && formData.lastName
                    ? "input-error"
                    : "focus:input-primary"
                }`}
                placeholder="Last Name"
                pattern="[A-Za-z\s-]+"
                title="Last name must contain only letters, spaces, and hyphens"
                required
              />
            </div>
          </div>

          <div className="form-control mt-4 flex gap-5">
            <label className="label">
              <span className="label-text">Age</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input input-bordered focus:input-primary"
              placeholder="Enter your age"
              min="18"
              max="100"
            />
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="card bg-base-200 shadow-sm p-6 mb-6">
          <h3 className="text-xl font-bold mb-5 text-primary-focus flex items-center">
            <FaCode className="mr-2" /> Professional Information
          </h3>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base">Skills</span>
            </label>

            {/* Skills Input */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && newSkill.trim()) {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="input input-bordered focus:input-primary flex-1 h-12 text-base"
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-primary h-12 px-6"
              >
                Add
              </button>
            </div>

            {/* Skills Tags Display */}
            <div className="flex flex-wrap gap-3 mt-4 min-h-[50px] p-2 bg-base-100 rounded-lg border border-base-300">
              {formData.skills.length > 0 ? (
                formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="badge badge-primary gap-2 p-4 text-sm font-medium hover:badge-secondary transition-all duration-300 shadow-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          skills: formData.skills.filter((_, i) => i !== index),
                        });
                      }}
                      className="btn btn-ghost btn-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-base-content/50 text-sm italic">
                  No skills added yet
                </span>
              )}
            </div>

            <label className="label">
              <span className="label-text-alt text-info">
                Press Enter or click Add to create a skill tag
              </span>
            </label>
          </div>
        </div>

        {/* About Section */}
        <div className="card bg-base-200 shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-primary-focus flex items-center">
            <FaInfoCircle className="mr-2" /> About You
          </h3>

          <div className="form-control flex gap-5">
            <label className="label">
              <span className="label-text">About</span>
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="textarea textarea-bordered focus:textarea-primary h-32"
              placeholder="Tell other developers about yourself, your interests, and what you're looking for..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-control mt-8">
          <button
            type="submit"
            className={`btn btn-primary btn-lg ${
              isSubmitting ? "loading" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating Profile..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-end z-50">
          <div className="alert alert-success shadow-lg shadow-success/20 flex gap-2">
            <FaCheckCircle className="text-xl" />
            <div>
              <h3 className="font-bold">Profile Updated!</h3>
              <div className="text-xs">Your changes have been saved</div>
            </div>
            <div className="ml-2">
              <div
                className="radial-progress text-success-content border-4 border-success"
                style={{
                  "--value": 100,
                  "--size": "2rem",
                  "--thickness": "4px",
                }}
              >
                ✓
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
