import jwt_decode, { JwtPayload } from "jwt-decode";
import axios from "axios";
import { Tokens } from "../types/Tokens";
import { Middleware } from "redux";
import { RootState } from "./store";

const refreshPage = () => window.location.reload();

const refreshTokens = async () => {
  const value = localStorage.getItem("tokens");
  const tokens: Tokens | undefined = value ? JSON.parse(value) : undefined;
  if (tokens) {
    const config = {
      headers: {
        token: "Bearer " + tokens.refresh_token,
      },
    };
    const res = await axios.post(
      `${import.meta.env.VITE_PORT}/auth/refresh`,
      config
    );
    if (res.data) {
      localStorage.setItem("tokens", JSON.stringify(res.data));
    }
  }
  return;
};

export const checkTokenExpirationMiddleware: Middleware<{}, RootState> =
  (storeApi) => (next) => (action) => {
    const token: string =
      JSON.parse(localStorage.getItem("tokens") || "") &&
      JSON.parse(localStorage.getItem("tokens") || "")["accessToken"];
    const refreshToken: string =
      JSON.parse(localStorage.getItem("tokens") || "") &&
      JSON.parse(localStorage.getItem("tokens") || "")["refreshToken"];

    if (!token) next(action);

    const decodedToken: JwtPayload = jwt_decode(token);
    const decodedRefreshToken: JwtPayload = jwt_decode(refreshToken);
    if ((decodedToken?.exp as JwtPayload) < new Date(Date.now() - 1000 * 60)) {
      if ((decodedRefreshToken?.exp as JwtPayload) < new Date().getTime()) {
        localStorage.clear();
        refreshPage();
        next(action);
      } else {
        refreshTokens();
        next(action);
      }
    } else if ((decodedToken?.exp as JwtPayload) < new Date().getTime()) {
      localStorage.clear();
      refreshPage();
      next(action);
    }
    next(action);
  };
