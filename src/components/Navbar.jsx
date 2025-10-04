import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="absolute top-0 left-0 z-20 w-full backdrop-blur-xl bg-white/70 flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 shadow-sm">
      {/* Logo */}
      <img
        src="/logo.png" // <-- replace with your actual logo path
        alt="Visora Logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {/* Right side */}
      {user ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <button
          onClick={openSignIn}
          className="flex items-center gap-2 rounded-full text-sm font-medium cursor-pointer bg-primary text-white px-6 sm:px-10 py-2.5 transition hover:opacity-90"
        >
          Get started
        </button>
      )}
    </div>
  );
};

export default Navbar;
