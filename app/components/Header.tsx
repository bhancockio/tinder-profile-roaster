import Image from "next/image";
import React from "react";

function Header() {
  return (
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
  );
}

export default Header;
