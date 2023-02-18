import jwt_decode, { JwtPayload } from "jwt-decode";
import axios from "axios";
import { Tokens } from "../types/Tokens";
import { Middleware } from "redux";
import { RootState } from "./store";
import { changeUser } from "../features/auth/authSlice";

const refreshPage = () => window.location.reload();

const refreshTokens = async (token: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  const res = await axios.post(
    `${import.meta.env.VITE_PORT}/auth/refresh`,
    {},
    config
  );
  if (res.data) {
    localStorage.setItem("tokens", JSON.stringify(res.data));
  }
  return;
};

export const checkTokenExpirationMiddleware: Middleware<{}, RootState> =
  (storeApi) => (next) => (action) => {
    const values = localStorage.getItem("tokens");
    const tokens: Tokens | undefined = values ? JSON.parse(values) : undefined;

    if (!tokens) next(action);
    else {
      const token = tokens.access_token;
      const refreshToken = tokens.refresh_token;

      const decodedToken: JwtPayload = jwt_decode(token);
      const decodedRefreshToken: JwtPayload = jwt_decode(refreshToken);

      if ((decodedRefreshToken?.exp as JwtPayload) < Date.now() / 1000) {
        localStorage.clear();
        refreshPage();
        next(action);
      } else if (
        (decodedToken?.exp as JwtPayload) <
        (Date.now() - 1000 * 240) / 1000
      ) {
        refreshTokens(refreshToken)
          .then(() => {
            const newvalues = localStorage.getItem("tokens");
            const newtokens: Tokens | undefined = newvalues
              ? JSON.parse(newvalues)
              : undefined;
            if (newtokens) storeApi.dispatch(changeUser(newtokens));
          })
          .catch((error) => {
            console.log(error);
            localStorage.clear();
            refreshPage();
          });
        next(action);
      } else {
        next(action);
      }
    }
  };
