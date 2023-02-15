import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import OneJob from "../components/OneJob";
import { Job } from "../types/Job";
import { User } from "../types/User";

function Me() {
  const { user } = useAppSelector((state) => state.auth);
  const [currUser, setCurrUser] = useState<User>({
    id: -1,
    createdAt: "",
    updatedAt: "",
    email: "",
    password: "",
    name: "",
    description: "",
    refreshT: "",
    jobs: [],
  });
  const [jobs, setJobs] = useState([]);

  const getUser = async () => {
    if (user) {
      const config = {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      };

      const res = await axios.get(
        `${import.meta.env.VITE_PORT}/users/profile`,
        config
      );

      return res.data;
    }
  };

  const getMyJobs = async () => {
    if (user) {
      const config = {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      };

      const res = await axios.get(
        `${import.meta.env.VITE_PORT}/jobs/my`,
        config
      );

      return res.data;
    }
  };

  useEffect(() => {
    getUser()
      .then((res: User) => {
        setCurrUser(res);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getMyJobs()
      .then((res) => {
        setJobs(res);
      })
      .catch((error) => console.log(error));
  });

  const jobComponents = jobs?.map((job: Job) => (
    <OneJob key={`${job.id}`} job={job} />
  ));

  return (
    <div>
      {jobs.length > 0 ? (
        <div>{jobComponents}</div>
      ) : (
        <div className="my-3 text-center">No jobs</div>
      )}
    </div>
  );
}

export default Me;