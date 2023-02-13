import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useAppSelector } from "./app/hooks";
import Signin from "./pages/Signin";

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
      </Routes>
    </div>
  );
}

export default App;
