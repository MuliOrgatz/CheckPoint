import { Link } from 'react-router-dom';
import checkpointLogo from '../../assets/checkpoint.svg';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUsername(user.username);
      } catch {
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, [isAuthenticated]);

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-8 py-3">
      <div className="flex items-center">
        <img src={checkpointLogo} alt="CheckPoint Logo" className="h-8" />
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-pink tracking-tight">
        Room Booking Platform
      </span>
      {isAuthenticated && (
        <div className="flex items-center gap-8">
          <Link
            to="/search"
            className="text-pink font-semibold hover:text-darkPink transition"
          >
            Search Rooms
          </Link>
          <Link
            to="/booking"
            className="text-pink font-semibold hover:text-darkPink transition"
          >
            My Booking
          </Link>
          {username && (
            <div className="flex items-center gap-2 bg-pink/10 px-4 py-2 rounded-full">
              <img src="/assets/user.svg" alt="User" className="w-6 h-6" />
              <span className="font-semibold text-pink">{username}</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
