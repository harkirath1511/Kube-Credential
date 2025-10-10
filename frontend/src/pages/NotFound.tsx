import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-7xl sm:text-9xl font-extrabold tracking-tight text-center">
          <span className="bg-gradient-to-r from-indigo-400 via-white to-orange-400 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
          <span className="bg-gradient-to-r from-indigo-400 via-white to-orange-400 bg-clip-text text-transparent">
            Not Found
          </span>
        </h2>
        <Link
          to="/issue"
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-95"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
