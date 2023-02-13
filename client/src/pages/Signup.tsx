import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import PasswordStrengthBar from "react-password-strength-bar";
import { LoginForm } from "../types/LoginForm";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { signup } from "../features/auth/authSlice";

function Signup() {
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const notify = () =>
    toast.success("User has been added!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

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
    dispatch(signup(data))
      .unwrap()
      .then(() => {
        notify();
        reset();
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status) {
          if (error.response.status === 403) {
            notifyError("Email is already taken!");
          } else {
            notifyError("Signup failed!");
          }
        } else {
          alert(error);
        }
      });
  };

  return (
    <div>
      <div className="container mx-auto p-5">
        <form
          className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="mt-5 mb-2">Email</label>
          <input
            className="input input-bordered w-full"
            type="text"
            {...register("email", {
              required: "This field is required!",
              pattern: {
                value: /^[^\s]+(?:$|.*[^\s]+$)/g,
                message: "This field can't start or end with whitespace!",
              },
            })}
          />
          {errors.email && <div className="my-2">{errors.email.message}</div>}
          <label className="mt-5 mb-2">Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("password", {
              onChange: (e) => setPassword(e.target.value),
              required: "This field is required!",
              pattern: {
                value: /^[^\s]+(?:$|.*[^\s]+$)/g,
                message: "This field can't start or end with whitespace!",
              },
            })}
          />
          <PasswordStrengthBar password={password} className="mt-2" />
          {errors.password && (
            <div className="mb-2">{errors.password.message}</div>
          )}
          <button className="btn my-5 mx-auto flex">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
