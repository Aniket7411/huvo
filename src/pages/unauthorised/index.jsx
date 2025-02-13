import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorised(path) {
  return (
    <div className="relative block w-full h-screen bg-white">
      <div
        role="status"
        className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
      >
        <h3>Not Unauthorised</h3>
        <Link className="text-blue-700 hover:underline" to={path}>back to home page</Link>
      </div>
    </div>
  );
}
