"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Header from "./components/Header";
import ProfilePicturePreviews from "./components/ProfilePicturePreviews";

export default function Home() {
  // State for storing the selected images
  const [images, setImages] = useState<File[]>([]);
  // State to indicate whether the 'roasting' process is ongoing
  const [isRoasting, setIsRoasting] = useState(false);

  // Handles changes in the image input field
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Converts FileList to array and updates the state
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  // Function to process and 'roast' the images
  const roastImages = async () => {
    // Indicate that roasting has started
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

    // Wait for all images to be converted
    const imageBase64Strings = await Promise.all(imagePromises);

    // Prepare payload for API request
    const payload = { images: imageBase64Strings };

    try {
      // API call to the 'roast' endpoint
      const response = await fetch("/api/roast", {
        body: JSON.stringify(payload),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Error handling for unsuccessful response
      if (!response.ok) throw new Error("Error generating audio");

      // Notify success and trigger file download
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
      // Error handling and user notification
      toast.error("Something went wrong generating the roast!");
      console.error(error);
    } finally {
      // Reset the roasting state
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
        <Header />

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

        <ProfilePicturePreviews images={images} />

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
