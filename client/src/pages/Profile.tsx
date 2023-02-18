import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import PasswordStrengthBar from "react-password-strength-bar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { UserUpdate } from "../types/UserUpdate";
import { deleteUser, getUser, updateUser } from "../features/user/userSlice";

function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const [initialState, setInitialState] = useState({});

  const navigate = useNavigate();

  const notifyUpdate = () => {
    toast.success("User has been updated!", {
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

  const notifyError = (error: string) => {
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
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserUpdate>({
    defaultValues: {
      email: "",
      password: "",
      description: "",
      name: "",
    },
  });

  useEffect(() => {
    if (user) {
      dispatch(getUser(user.access_token))
        .unwrap()
        .then((res) => {
          setValue("email", res.email, { shouldTouch: true });
          setValue("name", res.name, { shouldTouch: true });
          setValue("description", res.description, { shouldTouch: true });
          setPassword("");
          setInitialState({
            email: res.email,
            password: "",
            description: res.description,
            name: res.name,
          });
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  const valueToSubmitChecker = (initialState: UserUpdate, user: UserUpdate) => {
    const newuser = user;

    Object.keys(initialState).length === Object.keys(user).length &&
      (Object.keys(initialState) as (keyof typeof initialState)[]).forEach(
        (key) => {
          if (initialState[key] === newuser[key] || !newuser[key])
            delete newuser[key];
        }
      );

    return newuser;
  };

  const onSubmit = (data: UserUpdate) => {
    if (user) {
      const dataToSubmit = valueToSubmitChecker(initialState, data);

      const dataToSend = {
        data: dataToSubmit,
        token: user,
      };

      dispatch(updateUser(dataToSend))
        .unwrap()
        .then(() => {
          notifyUpdate();
          navigate("/");
        })
        .catch((error) => {
          if (error.response.status) {
            if (error.response.status === 403) {
              notifyError("Email is already taken!");
            } else {
              notifyError("Update failed!");
            }
          } else {
            alert(error);
          }
        });
    }
  };

  const refreshPage = () => window.location.reload();

  const deleteAccount = () => {
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
        if (user) {
          dispatch(deleteUser(user.access_token))
            .unwrap()
            .then(() => {
              navigate("/");
              localStorage.removeItem("tokens");
              refreshPage();
            })
            .catch((error) => {
              console.log(error);
              alert(error);
            });
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-5">
      <Link to="/" className="btn">
        &#8592; Back
      </Link>
      <h1 className="text-center mt-3 mb-3 text-3xl">UPDATE YOUR ACCOUNT</h1>
      <form
        className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mt-5 mb-2">Email</label>
        <input
          className="input input-bordered w-full"
          type="text"
          {...register("email", {
            pattern: {
              value: /^[^\s]+(?:$|.*[^\s]+$)/g,
              message: "This field can't start or end with whitespace!",
            },
          })}
        />
        {errors.email && <div className="my-2">{errors.email.message}</div>}
        <label className="mt-5 mb-2">New Password</label>
        <input
          className="input input-bordered w-full"
          type="password"
          {...register("password", {
            onChange: (e) => setPassword(e.target.value),
            pattern: {
              value: /^[^\s]+(?:$|.*[^\s]+$)/g,
              message: "This field can't start or end with whitespace!",
            },
          })}
        />
        {password && (
          <PasswordStrengthBar password={password} className="mt-2" />
        )}
        {errors.password && (
          <div className="my-2">{errors.password.message}</div>
        )}
        <label className="mt-5 mb-2">Name</label>
        <input
          className="input input-bordered w-full"
          {...register("name", {})}
        />
        {errors.name && <div className="my-2">{errors.name.message}</div>}
        <label className="mt-5 mb-2">Description</label>
        <textarea
          className="textarea input-bordered w-full"
          {...register("description", {})}
        />
        {errors.description && (
          <div className="my-2">{errors.description.message}</div>
        )}
        <button className="btn btn-primary my-5 mx-auto flex">UPDATE</button>
      </form>
      <div className="sm:w-full lg:w-1/2 flex flex-col justify-items-center mx-auto">
        <h4 className="self-center">Delete account</h4>
        <p className="self-center">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          className="btn btn-warning my-5 mx-auto flex"
          onClick={deleteAccount}
        >
          DELETE YOUR ACCOUNT
        </button>
      </div>
    </div>
  );
}

export default Profile;
