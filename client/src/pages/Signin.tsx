import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signin } from "../features/auth/authSlice";
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { LoginForm } from "../types/LoginForm";

function Signin() {
  const [isFailed, setIsFailed] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
        setIsFailed(false);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          if (
            error.response.status === 403 ||
            error.response.status === 401 ||
            error.response.status === 400
          ) {
            setIsFailed(true);
          }
        } else alert(error);
      });
  };

  return (
    <div className="container mx-auto p-5">
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

        <button className="btn my-5 mx-auto flex">LOGIN</button>
        {isFailed && (
          <div className="my-4 text-center text-xl">Login failed!</div>
        )}
      </form>
    </div>
  );
}

export default Signin;
