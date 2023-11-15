import React from "react";

function ProfilePicturePreviews({ images }: { images: File[] }) {
  if (images.length === 0) return null;
  return (
    <div className="flex flex-row justify-center">
      {images.map((image, index) => (
        <img
          key={index}
          src={URL.createObjectURL(image)}
          alt={`preview-${index}`}
          className="h-40 w-40 object-cover rounded-lg mr-2"
        />
      ))}
    </div>
  );
}

export default ProfilePicturePreviews;
