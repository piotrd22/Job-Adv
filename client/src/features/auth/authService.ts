import axios from "axios";
import { LoginForm } from "../../types/LoginForm";
import { Tokens } from "../../types/Tokens";

const signup = async (user: LoginForm): Promise<Tokens> => {
  const res = await axios.post(
    `${import.meta.env.VITE_PORT}/auth/signup`,
    user
  );
  return res.data;
};

const signin = async (user: LoginForm): Promise<Tokens> => {
  const res = await axios.post(
    `${import.meta.env.VITE_PORT}/auth/signin`,
    user
  );
  if (res.data) {
    localStorage.setItem("tokens", JSON.stringify(res.data));
  }
  return res.data;
};

const logout = async (token: string) => {
  if (token) {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    await axios.post(`${import.meta.env.VITE_PORT}/auth/logout`, {}, config);
  }
  localStorage.removeItem("tokens");
};

const authService = {
  signup,
  signin,
  logout,
};

export default authService;
