import axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateJob } from "../features/job/jobSlice";
import { JobForm } from "../types/JobForm";

function UpdateJob() {
  const id = useParams().id;
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const getJob = async () => {
    const res = await axios.get(`${import.meta.env.VITE_PORT}/jobs/${id}`);
    return res.data;
  };

  useEffect(() => {
    getJob()
      .then((res) => {
        setValue("title", res.title, { shouldTouch: true });
        setValue("description", res.description, { shouldTouch: true });
        setValue("tech", res.tech, { shouldTouch: true });
        setValue("position", res.position, { shouldTouch: true });
      })
      .catch((error) => console.log(error));
  }, []);

  const notify = () =>
    toast.success("Job has been updated!", {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<JobForm>({
    defaultValues: {
      title: "",
      description: "",
      tech: "",
      position: "",
    },
  });

  const onSubmit = (data: JobForm) => {
    if (user && id) {
      const dataToSend = {
        token: user,
        data: data,
        jobId: id,
      };

      dispatch(updateJob(dataToSend))
        .unwrap()
        .then(() => {
          notify();
          navigate("/");
          reset();
        })
        .catch((error) => {
          notifyError();
          console.log(error);
        });
    }
  };

  return (
    <div className="container mx-auto p-5">
      <Link to="/" className="btn">
        &#8592; Back
      </Link>
      <form
        className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto relative"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mt-5 mb-2">Title</label>
        <input
          className="input input-bordered w-full"
          type="text"
          {...register("title", {
            required: "This field is required!",
            pattern: {
              value: /^[^\s]+(?:$|.*[^\s]+$)/g,
              message: "This field can't start or end with whitespace!",
            },
          })}
        />
        {errors.title && <div className="my-2">{errors.title.message}</div>}
        <label className="mt-5 mb-2">Description</label>
        <textarea
          className="textarea textarea-bordered w-full h-52"
          {...register("description", {
            required: "This field is required!",
          })}
        />
        {errors.description && (
          <div className="my-2">{errors.description.message}</div>
        )}
        <label className="mt-5 mb-2">Technology</label>
        <select
          className="select input-bordered"
          {...register("tech", {
            required: "This field is required!",
          })}
        >
          <option disabled value="">
            Select technology:
          </option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="scala">Scala</option>
          <option value="go">Go</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="csharp">C#</option>
          <option value="ruby">Ruby</option>
        </select>
        {errors.tech && <div className="my-2">{errors.tech.message}</div>}

        <label className="mt-5 mb-2">Position</label>
        <select
          className="select input-bordered"
          {...register("position", {
            required: "This field is required!",
          })}
        >
          <option disabled value="">
            Select position:
          </option>
          <option value="intern">Intern</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
        {errors.position && (
          <div className="my-2">{errors.position.message}</div>
        )}

        <div className="flex justify-center">
          <button type="submit" className="btn btn-primary my-5 flex">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateJob;
