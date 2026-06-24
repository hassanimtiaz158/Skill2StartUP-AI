export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.2 },
};

export const slide = (direction = 1) => ({
  initial: { opacity: 0, x: direction * 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: direction * -24 },
  transition: { duration: 0.2 },
});
