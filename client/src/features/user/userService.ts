import axios from "axios";
import { UserUpdate } from "../../types/UserUpdate";

const getUser = async (token: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = await axios.get(
    `${import.meta.env.VITE_PORT}/users/profile`,
    config
  );

  return res.data;
};

const updateUser = async (data: UserUpdate, token: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = await axios.patch(
    `${import.meta.env.VITE_PORT}/users/profile`,
    data,
    config
  );

  return res.data;
};

const deleteUser = async (token: string) => {
  const config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const res = await axios.delete(
    `${import.meta.env.VITE_PORT}/users/profile`,
    config
  );

  return res.data;
};

const userService = { getUser, updateUser, deleteUser };

export default userService;
