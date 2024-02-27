import axios from 'axios';

export const imageToDataUri = (file: File): Promise<string> => {
  return new Promise((res) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', (ev) => {
      const result = ev.target?.result?.toString();
      res(result || '');
    });
  });
};

export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      formData
    );
    return data.data.display_url;
  } catch (error) {
    return null;
  }
};
