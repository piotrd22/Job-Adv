import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { ImBin, ImOffice } from "react-icons/im";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAppSelector } from "../app/hooks";
import Loader from "../components/Loader";
import { Job } from "../types/Job";
import { User } from "../types/User";

function More() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [job, setJob] = useState<Job>({
    id: -1,
    createdAt: "",
    updatedAt: "",
    title: "",
    description: "",
    tech: "",
    position: "",
    userId: -1,
  });
  const [isTop, setIsTop] = useState(true);
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

  const { user } = useAppSelector((state) => state.auth);

  const notify = () =>
    toast.success("Job has been deleted!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyError = () => {
    toast.error("Something went wrong!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const fetchJob = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PORT}/jobs/${id}`);
    return res.data;
  };

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

  const deleteJob = async () => {
    if (user) {
      const config = {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      };

      const res = await axios.delete(
        `${import.meta.env.VITE_PORT}/jobs/${job.id}`,
        config
      );

      return res.data;
    }
  };

  const getUserById = async (id: number) => {
    const res = await axios.get(`${import.meta.env.VITE_PORT}/users/${id}`);
    return res.data;
  };

  useEffect(() => {
    fetchJob()
      .then((res: Job) => {
        setJob(res);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    getUserById(job.userId)
      .then((res: User) => {
        setCurrUser(res);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, [job]);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop } = document.documentElement;
      if (scrollTop === 0) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", onScroll);
  });

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteJob()
          .then(() => {
            notify();
            navigate("/");
          })
          .catch((error) => {
            notifyError();
            console.log(error);
          });
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto p-5">
      <Link to="/" className="btn">
        &#8592; Back
      </Link>
      {currUser.id === job.userId && (
        <div className="flex justify-center mt-6">
          <Link to={`/update-job/${id}`}>
            <FiEdit className="mx-5 cursor-pointer" />
          </Link>
          <ImBin className="cursor-pointer" onClick={handleDelete} />
        </div>
      )}
      <div className="flex flex-col justify-items-center mt-6 border border-base-300 bg-base-100 rounded-box p-6 my-6">
        <div className=" text-xl font-medium flex justify-between items-end">
          <p>{job.title.toUpperCase()}</p>
          <p>
            {job.tech.toUpperCase()} {job.position.toLocaleUpperCase()}
          </p>
        </div>
        <div className="mt-3">
          <p className="whitespace-pre-wrap mt-5">{job.description}</p>
          <div className="flex justify-between items-end mt-5">
            <div className="mt-3 text-right flex">
              <Link to={`/feed/${currUser.id}`}>
                <p className="flex items-center">
                  <ImOffice className="mr-3" />
                  {currUser.name}
                </p>
              </Link>
            </div>
            <div>
              <p className="mt-3 text-right">
                {new Date(job.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!isTop && (
        <button
          className="btn btn-square fixed bottom-3 right-3 z-50 "
          onClick={goToTop}
        >
          <AiOutlineArrowUp />
        </button>
      )}
    </div>
  );
}

export default More;
