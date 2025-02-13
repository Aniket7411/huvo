import React from "react";

const EmailLink = ({ email }) => {
  return (
    <a
      className="font-medium text-[#011f4b] font-[Poppins] pl-2 text-base"
      href={`mailto:${email}`}
    >
      {email}
    </a>
  );
};

export default EmailLink;
