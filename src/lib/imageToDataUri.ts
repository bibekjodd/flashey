export const imageToDataUri = (image: File | null): Promise<string> => {
  return new Promise((res) => {
    if (!image) {
      res("");
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    const onLoad = (ev: ProgressEvent<FileReader>) => {
      const dataUri = ev.target?.result?.toString() || "";
      res(dataUri);
    };
    fileReader.addEventListener("load", onLoad);
  });
};
