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
  id: string,
  isChatId?: boolean
): Promise<{
  message?: string;
  chat?: Chat;
  messages?: Message[];
  error?: string;
}> => {
  try {
    const { data } = await axios.get(
      `${backendURL}/api/v1/chat/${isChatId ? "group" : "user"}/${id}`,
      { withCredentials: true }
    );

    return {
      chat: data.chat,
    };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

export const searchUsers = async (
  searchTerm: string
): Promise<{ users?: User[]; error?: string }> => {
  try {
    const { data } = await axios.get(
      `${backendURL}/api/v1/users?search=${searchTerm}`,
      { withCredentials: true }
    );
    return {
      users: data.users || [],
    };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};

export const suggestedUsers = async (): Promise<{
  users?: User[];
  error?: string;
}> => {
  try {
    const { data } = await axios.get(`${backendURL}/api/v1/suggestedusers`, {
      withCredentials: true,
    });

    return {
      users: data.users || [],
    };
  } catch (error) {
    return {
      error: makeupAxiosError(error),
    };
  }
};
