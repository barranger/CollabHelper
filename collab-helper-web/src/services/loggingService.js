const Logger = {
  log: (text, obj) => {
    // eslint-disable-next-line no-console
    console.log(text, obj);
  },

  error: (text, obj) => {
    // eslint-disable-next-line no-console
    console.error(text, obj);
  },
};

export default Logger;
