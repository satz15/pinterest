import React, { useState } from "react";
import { Link } from "react-router-dom";

const PinCard = ({ pin, tagLabel }) => {
  const [liked, setLiked] = useState(false);

  // Function to handle like button click
  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="bg-white overflow-hidden shadow rounded-lg relative group cursor-pointer">
        {/* Tag Label */}
        {tagLabel && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {tagLabel}
          </span>
        )}

        {/* Main Image with fixed width and height */}
        <img
          src={pin.image.url}
          alt=""
          className="w-80 h-80 object-cover"
          style={{ width: "20rem", height: "20rem" }}
        />

        {/* Hover effect */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-2">
            <Link
              to={`/pin/${pin._id}`}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              View Pin
            </Link>
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={toggleLike}
          className={`absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg transition-colors duration-300 ${
            liked ? "text-red-600" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PinCard;
