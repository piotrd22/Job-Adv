import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { FiUser, FiLogOut, FiSettings, FiLogIn } from "react-icons/fi";

function Navbar() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className="navbar border-b bordered border-base-300 bg-base-100 mb-5">
      <div className="container flex items-center justify-between mx-auto">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold ">JJIT</span>
        </Link>

        <ul className="menu menu-horizontal flex items-center justify-center px-1 ">
          {!user && (
            <li tabIndex={0} className="relative">
              <a>
                <FiSettings className="text-4xl" />
              </a>
              <ul className="p-2 border-base-300 bg-base-100 absolute right-0 border z-50">
                <li>
                  <Link to="/">
                    <FiLogIn className="text-4xl mx-3" />
                    LogIn
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <FiLogOut className="text-4xl mx-3" />
                    SignUp
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {user && (
            <li tabIndex={0} className="relative">
              <a>
                <FiSettings className="text-4xl" />
              </a>
              <ul className="p-2 border-base-300 bg-base-100 absolute right-0 border z-50">
                <li>
                  <Link to="/profile">
                    <FiUser className="text-4xl mx-3" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button>
                    <FiLogOut className="text-4xl mx-3 cursor-pointer" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
