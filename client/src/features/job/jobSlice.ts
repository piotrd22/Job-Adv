import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { JobForm } from "../../types/JobForm";
import { Tokens } from "../../types/Tokens";
import jobService from "./jobService";

const initialState = {
  isLoading: false,
};

type PostJob = {
  data: JobForm;
  tokens: Tokens;
};

export const postJob = createAsyncThunk(
  "jobs",
  async (data: PostJob, thunkAPI) => {
    try {
      return await jobService.postJob(data.tokens.access_token, data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {},
});

export default jobSlice.reducer;
