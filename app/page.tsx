"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [isRoasting, setIsRoasting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[#FD297B] to-[#FF655B]">
      {/* Card */}
      <div
        className="bg-white rounded-lg p-6 text-center flex flex-col justify-between"
        style={{ height: "600px" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex flex-row justify-center items-center">
            <Image
              className="w-[40px] h-[50px] mr-3"
              src="/images/tinder-logo.png"
              height={50}
              width={40}
              alt={"Tinder logo"}
            />
            <h1 className="text-3xl font-bold text-gray-600">
              Tinder Profile Roaster
            </h1>
          </div>
          <h2 className="text-xl mt-2 font-semibold text-gray-500">
            Upload your profile pictures so AI can roast you!
          </h2>
        </div>

        {/* Upload Area */}
        <label className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mt-4">
            <p className="text-lg text-gray-600">Upload Images</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={isRoasting}
            />
          </div>
        </label>

        {/* Image Previews */}
        {images.length > 0 && (
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
        )}

        {/* Roast Me Button */}
        <button className="bg-gradient-to-r from-[#FD297B] to-[#FF655B] text-white rounded-md px-4 py-3 text-xl mt-4">
          Roast Me
        </button>
      </div>
    </main>
  );
}
