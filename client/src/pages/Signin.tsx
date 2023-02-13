import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signin } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useAppDispatch } from "../app/hooks";
import { LoginForm } from "../types/LoginForm";

function Signin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const notifyError = (error: string) =>
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    dispatch(signin(data))
      .unwrap()
      .then(() => {
        reset();
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          if (
            error.response.status === 403 ||
            error.response.status === 401 ||
            error.response.status === 400
          ) {
            notifyError("Login failed!");
          }
        } else alert(error);
      });
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-center mt-3 mb-3 text-3xl">SIGN IN</h1>
      <form
        className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mt-5 mb-2">Email</label>
        <input
          className="input input-bordered w-full"
          type="text"
          {...register("email", { required: true })}
        />
        {errors.email && <div className="my-2">This field is required!</div>}
        <label className="mt-5 mb-2">Password</label>
        <input
          className="input input-bordered w-full"
          type="password"
          {...register("password", { required: true })}
        />
        {errors.password && <div className="my-2">This field is required!</div>}

        <button className="btn btn-primary my-5 mx-auto flex">LOGIN</button>
      </form>
    </div>
  );
}

export default Signin;
