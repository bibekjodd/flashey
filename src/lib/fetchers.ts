import axios from "axios";
import { makeupAxiosError } from "./makeupAxiosError";

const backendURL = import.meta.env.VITE_BACKEND_URL;
export const fetchChats = async (): Promise<{
  chats?: Chat[];
  message?: string;
  error?: string;
}> => {
  try {
    const { data } = (await axios.get(`${backendURL}/api/v1/fetchchats`, {
      withCredentials: true,
    })) as { data: { chats: Chat[] } };

    const fullChat: Chat[] = data.chats.map((chat) => ({
      ...chat,
      messages: chat.messages || [],
    }));
    return {
      chats: fullChat,
    };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

export const accessChat = async (
  chatId: string
): Promise<{
  message?: string;
  chat?: Chat;
  messages?: Message[];
  error?: string;
}> => {
  try {
    const { data } = await axios.get(
      `${backendURL}/api/v1/chat/group/${chatId}`,
      { withCredentials: true }
    );

    return {
      chat: {
        ...data.chat,
        isMessagesFetched: false,
      },
      messages: data.messages,
    };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

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
