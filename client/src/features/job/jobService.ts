import axios from "axios";
import { JobForm } from "../../types/JobForm";

const postJob = async (token: string, data: JobForm) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = await axios.post(
    `${import.meta.env.VITE_PORT}/jobs`,
    data,
    config
  );

  return res.data;
};

const getMyJobs = async (token: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = await axios.get(`${import.meta.env.VITE_PORT}/jobs/my`, config);

  return res.data;
};

const deleteJob = async (token: string, jobId: number) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = await axios.delete(
    `${import.meta.env.VITE_PORT}/jobs/${jobId}`,
    config
  );

  return res.data;
};

const updateJob = async (token: string, data: JobForm, jobId: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = await axios.patch(
    `${import.meta.env.VITE_PORT}/jobs/${jobId}`,
    data,
    config
  );

  return res.data;
};

const jobService = {
  postJob,
  getMyJobs,
  deleteJob,
  updateJob,
};

export default jobService;
