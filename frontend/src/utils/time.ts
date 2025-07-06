export const wait = (ms = 300) =>
  new Promise((res) => {
    setTimeout(() => {
      res(null);
    }, ms);
  });
