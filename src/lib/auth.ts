import axios from "axios";
import { makeupAxiosError } from "./makeupAxiosError";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const fetchUser = async (): Promise<{
  message?: string;
  error?: string;
  data?: User;
}> => {
  try {
    const { data } = await axios.get(`${backendURL}/api/v1/profile`, {
      withCredentials: true,
    });
    return {
      data: data.user,
      message: data.message,
    };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

export const authUser = async (data: {
  name?: string;
  email: string;
  password: string;
  imageUri?: string;
  isLoginMode: boolean;
}): Promise<{ error?: string; data?: User; message?: string }> => {
  try {
    const res = await axios.post(
      `${backendURL}/api/v1/${data.isLoginMode ? "login" : "register"}`,
      data,
      { withCredentials: true }
    );
    return { data: res.data?.user };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

export const logout = async (): Promise<{
  error?: string;
  message?: string;
}> => {
  try {
    const { data } = await axios.get(`${backendURL}/api/v1/logout`, {
      withCredentials: true,
    });
    return { message: data.message };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};
