import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const fetchUser = async (): Promise<{ error?: string; data?: User }> => {
  try {
    const { data } = await axios.get(`${backendURL}/api/v1/profile`, {
      withCredentials: true,
    });
    return {
      data: data.user,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.message || error.message,
      };
    }
    return {
      error: "Unexpected Error Occurred!",
    };
  }
};

export const authUser = async (data: {
  name?: string;
  email: string;
  password: string;
  imageUri?: string;
  isLoginMode: boolean;
}): Promise<{ error?: string; data?: User }> => {
  try {
    const res = await axios.post(
      `${backendURL}/api/v1/${data.isLoginMode ? "login" : "register"}`,
      data,
      { withCredentials: true }
    );
    return { data: res.data?.user };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data.message || error.message,
      };
    }
    return {
      error: "Unexpected Errror Occurred!",
    };
  }
};

export const logout = async () => {
  try {
    const { data } = await axios.get(`${backendURL}/api/v1/logout`, {
      withCredentials: true,
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
