export const scrollToBottom = () => {
  const element = document.getElementById("messages") as HTMLDivElement | null;
  if (!element) return;

  const scrollTop = element.scrollTop;

  if (scrollTop <= window.innerHeight * -0.7) return;

  element.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
