import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  FiUser,
  FiLogOut,
  FiList,
  FiLogIn,
  FiPlus,
  FiUpload,
} from "react-icons/fi";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    if (user) {
      dispatch(logout(user.access_token))
        .unwrap()
        .then(() => navigate("/"))
        .catch((error) => {
          alert(error);
        });
    }
  };

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
                <FiList className="text-4xl" />
              </a>
              <ul className="p-2 border-base-300 bg-base-100 absolute right-0 border z-50">
                <li>
                  <Link to="/signin">
                    <FiLogIn className="text-4xl mx-3" />
                    LogIn
                  </Link>
                </li>
                <li>
                  <Link to="/signup">
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
                <FiList className="text-4xl" />
              </a>
              <ul className="p-2 border-base-300 bg-base-100 absolute right-0 border z-50">
                <li>
                  <Link to="/me">
                    <FiUser className="text-4xl mx-3" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <FiUpload className="text-4xl mx-3" />
                    Update profile
                  </Link>
                </li>
                <li>
                  <Link to="/add-job">
                    <FiPlus className="text-4xl mx-3" />
                    Add job
                  </Link>
                </li>
                <li>
                  <button onClick={logoutHandler}>
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
