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

const jobService = {
  postJob,
};

export default jobService;
