import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../app/hooks";
import { JobForm } from "../types/JobForm";

function AddJob() {
  const { user } = useAppSelector((state) => state.auth);
  const notify = () =>
    toast.success("Job has been added!", {
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

  const fetchPostJob = async (data: JobForm) => {
    if (user) {
      const config = {
        headers: {
          Authorization: "Bearer " + user.access_token,
        },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_PORT}/jobs`,
        data,
        config
      );

      return res.data;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JobForm>({
    defaultValues: {
      title: "",
      description: "",
      tech: "",
      position: "",
    },
  });

  const onSubmit = (data: JobForm) => {
    fetchPostJob(data)
      .then(() => {
        notify();
        reset();
      })
      .catch((error) => {
        notifyError();
        console.log(error);
      });
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
            Add job
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddJob;
