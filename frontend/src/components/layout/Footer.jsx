import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-10">

        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              PM
            </div>
            <span className="text-lg font-bold">PhotoMarket</span>
          </div>
          <p className="text-gray-600 max-w-md">
            A modern marketplace for photographers to showcase and sell their work globally.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li>Explore</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-gray-600">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="border-t text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} PhotoMarket. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
