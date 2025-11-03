import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
type Props = {
  className?: string;
  children: React.ReactNode;
};
function Container({ className, children }: Props) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div
      className={`max-w-[500px] min-h-[100vh] bg-sky-100 mx-auto ${className}`}
    >
      <header className="flex justify-between items-center bg-blue-500 p-3 text-white">
        <button
          aria-label="open menu"
          onClick={() => setIsMenuOpen(true)}
          className="!bg-blue-500 rounded hover:bg-blue-600 transition outline-none"
        >
          <span className="inline-block text-2xl">☰</span>
        </button>
        <div className="font-bold">logo</div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Right Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 max-w-[85%] bg-white shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-bold text-gray-800">منو</div>
          <button
            aria-label="close menu"
            onClick={() => setIsMenuOpen(false)}
            className="!bg-gray-100 rounded hover:bg-gray-200 transition outline-none !text-black hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <nav className="p-4 space-y-3">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              navigate("/information");
            }}
            className="w-full text-right !bg-gray-100 text-black px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            ثبت باشگاه جدید
          </button>
        </nav>
      </aside>
      {children}
    </div>
  );
}

export default Container;
