import axios from "axios";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Loader from "../components/Loader";
import OneJob from "../components/OneJob";
import { getMyJobs } from "../features/job/jobSlice";
import { Job } from "../types/Job";
import { User } from "../types/User";
import company from "../assets/company.jpg";

function Me() {
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.job);
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

  const dispatch = useAppDispatch();

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

  useEffect(() => {
    getUser()
      .then((res: User) => {
        setCurrUser(res);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(getMyJobs(user.access_token))
        .unwrap()
        .then((res) => {
          setJobs(res);
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  const jobComponents = jobs?.map((job: Job) => (
    <OneJob key={`${job.id}`} job={job} />
  ));

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto p-3 min-h-screen">
      <div className="flex justify-center">
      <div className="card w-96 bg-base-100 shadow-xl image-full">
        <figure>
          <img src={company} alt="Company" />
        </figure>
        {currUser.name ? (
          <div className="card-body">
            <h2 className="card-title">{currUser.name}</h2>
            <p>{currUser.email}</p>
            <div className="card-actions justify-end">
              {currUser.description && <p>{currUser.description}</p>}
            </div>
          </div>
        ) : (
          <div className="card-body">
            <h2 className="card-title">{currUser.email}</h2>
            <div className="card-actions justify-end">
              {currUser.description && <p>{currUser.description}</p>}{" "}
            </div>
          </div>
        )}
      </div>
      </div>
      <h1 className="text-center mt-3 mb-3 text-3xl">YOUR JOB OFFERS</h1>
      {jobs.length > 0 ? (
        <div>{jobComponents}</div>
      ) : (
        <div className="my-3 text-center">No jobs</div>
      )}
    </div>
  );
}

export default Me;
