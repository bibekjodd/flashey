import axios from "axios";
import { makeupAxiosError } from "./makeupAxiosError";

const backendURL = import.meta.env.VITE_BACKEND_URL;

export const sendMessage = async ({
  chatId,
  text,
  image,
}: {
  chatId: string;
  image?: string;
  text?: string;
}): Promise<{ message?: string; error?: string }> => {
  try {
    await axios.post(
      `${backendURL}/api/v1/message/${chatId}`,
      {
        text,
        image,
      },
      { withCredentials: true }
    );
    return {};
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

export const updateMessageViewed = async ({
  id,
  user,
  viewers,
}: {
  id: string;
  user: User | null;
  viewers: string;
}): Promise<{ error?: string; message?: string }> => {
  if (!user) return {};
  const viewersIds = JSON.parse(viewers || "[]") as string[];
  if (viewersIds.includes(user?._id)) return {};
  try {
    const res = await axios.put(
      `${backendURL}/api/v1/message/viewer?messageId=${id}`,
      {},
      { withCredentials: true }
    );
    return { message: res.data.message };
  } catch (error) {
    return { error: makeupAxiosError(error) };
  }
};


