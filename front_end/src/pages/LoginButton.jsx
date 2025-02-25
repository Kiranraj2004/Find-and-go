import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return isAuthenticated ? (
    <div className="relative flex flex-row mr-14">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
        className="px-4 py-2 text-white bg-blue-600 rounded-md"
      >
        {user.name}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-10 w-30 bg-white border border-gray-300 rounded-lg shadow-lg">
        
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="w-full text-left px-4 py-2 bg-red-600 text-white hover:bg-red-300"
          >
            Log out
          </button>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full text-left px-4 py-2  bg-black text-white hover:bg-slate-600"
          >
            close
          </button>

        </div>
      )}
    </div>
  ) : (
    <button 
      onClick={loginWithRedirect} 
      className="px-4 py-2 text-white bg-blue-600 rounded-md mr-12"
    >
      Login
    </button>
  );
};

export default AuthButton;
