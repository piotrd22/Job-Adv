import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Tokens } from "../../types/Tokens";
import { UserUpdate } from "../../types/UserUpdate";
import userService from "./userService";

const initialState = {
  isLoading: false,
};

export const getUser = createAsyncThunk(
  "/users/prfoile",
  async (token: string, thunkAPI) => {
    try {
      return await userService.getUser(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

type UpdateUser = {
  data: UserUpdate;
  token: Tokens;
};

export const updateUser = createAsyncThunk(
  "/users/update",
  async (data: UpdateUser, thunkAPI) => {
    try {
      return await userService.updateUser(data.data, data.token.access_token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "/users/delete",
  async (token: string, thunkAPI) => {
    try {
      return await userService.deleteUser(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default userSlice.reducer;
