import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useAppSelector } from "./app/hooks";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import More from "./pages/More";
import NotFound from "./pages/NotFound";
import AddJob from "./pages/AddJob";
import UpdateJob from "./pages/UpdateJob";
import ProfileFeed from "./pages/ProfileFeed";
import Me from "./pages/Me";

function App() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="App">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <Signin />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/add-job"
          element={user ? <AddJob /> : <Navigate to="/" />}
        />
        <Route
          path="/update-job/:id"
          element={user ? <UpdateJob /> : <Navigate to="/" />}
        />
        <Route path="/me" element={user ? <Me /> : <Navigate to="/" />} />
        <Route path="/feed/:id" element={<ProfileFeed />} />
        <Route path="/more/:id" element={<More />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
