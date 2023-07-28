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
  messageId,
  chatId,
  user,
  viewers,
}: {
  chatId: string;
  messageId: string;
  user: User | null;
  viewers: string;
}): Promise<{ error?: string; message?: string }> => {
  if (!user) return {};
  const viewersIds = JSON.parse(viewers || "[]") as string[];
  if (viewersIds.includes(user?._id)) return {};
  try {
    const res = await axios.put(
      `${backendURL}/api/v1/message/viewer?messageId=${messageId}&chatId=${chatId}`,
      {},
      { withCredentials: true }
    );
    return { message: res.data.message };
  } catch (error) {
    return { error: makeupAxiosError(error) };
  }
};

export const createGroup = async (
  groupName: string,
  users: string[],
  image?: string
): Promise<{ chat?: Chat; error?: string }> => {
  if (!users) return { error: "Can't create group without sufficient users" };
  try {
    const { data } = await axios.post(
      `${backendURL}/api/v1/group/create`,
      { users, groupName, image },
      { withCredentials: true }
    );
    return { chat: data.chat };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

export const addReactionToMessage = async ({
  reaction,
  messageId,
  chatId,
}: {
  reaction: string;
  messageId: string;
  chatId: string;
}): Promise<{ error?: string }> => {
  try {
    await axios.put(
      `${backendURL}/api/v1/reaction/${messageId}?chatId=${chatId}`,
      {
        reaction,
      },
      { withCredentials: true }
    );
    return {};
  } catch (error) {
    return { error: makeupAxiosError(error) };
  }
};

export const sendTypingUpdate = async (
  data: Typing
): Promise<{ error?: string }> => {
  try {
    await axios.post(`${backendURL}/api/v1/typing`, data, {
      withCredentials: true,
    });
    return {};
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};
