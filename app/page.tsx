"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [isRoasting, setIsRoasting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  const roastImages = async () => {
    setIsRoasting(true);

    // Convert images to base64 strings for the backend
    const imagePromises = images.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    const imageBase64Strings = await Promise.all(imagePromises);

    const payload = { images: imageBase64Strings };

    console.log(payload);

    try {
      const response = await fetch("/api/roast", {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error generating audio");

      toast.success("Roast generated successfully!");
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "roast.mp3");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Something went wrong generating the roast!");
      console.error(error);
    } finally {
      setIsRoasting(false);
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
        <div>
          <button
            onClick={() => void roastImages()}
            className="bg-gradient-to-r from-[#FD297B] to-[#FF655B] text-white rounded-md px-4 py-3 text-xl mt-4 disabled:opacity-50"
            disabled={isRoasting || images.length === 0}
          >
            {isRoasting ? "Generating Roast..." : "Roast Me"}
          </button>
          {images.length === 0 && (
            <p className="text-xs text-gray-500 mt-2">
              You need to upload images to start the roast
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
