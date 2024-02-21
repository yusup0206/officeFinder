import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <header>
      <nav className="bg-slate-200">
        <div className="container">
          <div className="flex justify-between items-center p-3">
            <Link to="/">
              <h1 className="font-bold text-sm md:text-xl flex flex-wrap">
                <span className="text-slate-500">Office</span>
                <span className="text-slate-700">Finder</span>
              </h1>
            </Link>
            <form className="bg-slate-100 border-2 border-slate-500 outline-slate-700 rounded-md p-2 flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="outline-none bg-transparent w-24 sm:w-64"
              />
              <FaSearch className="text-slate-600" />
            </form>
            <ul className="flex gap-4">
              <Link to="/">
                <li className="text-slate-700 hover:underline hidden sm:inline">
                  Home
                </li>
              </Link>
              <Link to="/about">
                <li className="text-slate-700 hover:underline hidden sm:inline">
                  About
                </li>
              </Link>
              <Link to="/profile">
                {currentUser ? (
                  <img
                    src={currentUser.avatar}
                    alt="profile-img"
                    className="rounded-full h-7 w-7 object-cover"
                  />
                ) : (
                  <li className="text-slate-700 hover:underline ">Sign in</li>
                )}
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
