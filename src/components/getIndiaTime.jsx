import { useState } from "react";

function IndiaTime({ data }) {
  const [currentTime, setCurrentTime] = useState(
    data ? new Date(data) : new Date()
  );
  const getFormattedDate = (date) => {
    const day = date.getDate();
    const suffix =
      day > 3 && day < 21 ? "th" : ["th", "st", "nd", "rd"][day % 10] || "th";
    const options = { year: "numeric", month: "long" };
    return `${day}${suffix} ${date.toLocaleDateString("en-IN", options)}`;
  };

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return ` ${getFormattedDate(currentTime)} | ${formattedTime}`;
}

export default IndiaTime;
