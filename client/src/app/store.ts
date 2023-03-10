import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import jobReducer from "../features/job/jobSlice";
import userReducer from "../features/user/userSlice";
import { checkTokenExpirationMiddleware } from "./middleware";

const rootReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(checkTokenExpirationMiddleware),
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
