import axios from "axios";

export const fetchUser = async (): Promise<{ error?: string; data?: User }> => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me`, {
      withCredentials: true,
    });
    return {
      data: res.data.user,
    };
  } catch (error) {
    console.log(error);
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
      `${import.meta.env.VITE_BACKEND_URL}/${
        data.isLoginMode ? "login" : "register"
      }`,
      data
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
