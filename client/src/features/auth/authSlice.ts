import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginForm } from "../../types/LoginForm";
import authService from "./authService";

const tokens = localStorage.getItem("tokens");
const user = tokens ? JSON.parse(tokens) : undefined;

const initialState = {
  user: user ? user : null,
  isLoading: false,
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (user: LoginForm, thunkAPI) => {
    try {
      return await authService.signup(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (user: LoginForm, thunkAPI) => {
    try {
      return await authService.signin(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(signin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
