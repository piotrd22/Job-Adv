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

export const getMyJobs = createAsyncThunk(
  "jobs/my",
  async (token: string, thunkAPI) => {
    try {
      return await jobService.getMyJobs(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

type DeleteJob = {
  token: Tokens;
  jobId: number;
};

export const deleteJob = createAsyncThunk(
  "jobs/delete",
  async (data: DeleteJob, thunkAPI) => {
    try {
      return await jobService.deleteJob(data.token.access_token, data.jobId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

type UpdateJob = {
  token: Tokens;
  data: JobForm;
  jobId: string;
};

export const updateJob = createAsyncThunk(
  "jobs/update",
  async (data: UpdateJob, thunkAPI) => {
    try {
      return await jobService.updateJob(
        data.token.access_token,
        data.data,
        data.jobId
      );
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
