import axios from "axios";

export const fetchUser = async (): Promise<{ error?: string; data?: User }> => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGJjYjZjOWI1Y2M5NzJhMjI5MGM2MGQiLCJpYXQiOjE2OTAwOTI0NzAsImV4cCI6MTY5MDY5NzI3MH0.JCpd0JXq52b7dlxop3x8jHq9yaL5fHoVCJCRC9OvdXE`,
      },
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

export const logout = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/logout`,{
        withCredentials:true
      }
    );
    console.log(data)
  } catch (error) {
    console.log(error)
  }
};
