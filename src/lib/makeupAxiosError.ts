import axios from "axios";

export const makeupAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.status === 401) return "Invalid user credintials";

    return (
      error.response?.data?.message ||
      error.message ||
      "Unexpected Error Occurred"
    );
  }

  return "Unexpected Error Occurred";
};
