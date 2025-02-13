import React from "react";

const MobileNumberLink = ({ number }) => {
  return (
    <a
      className="font-medium text-[#011f4b] font-[Poppins] pl-2 text-base"
      href={`tel:${number}`}
    >
      {number}
    </a>
  );
};

export default MobileNumberLink;
