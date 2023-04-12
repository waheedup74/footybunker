export const useUtilities = () => {
  function toUpper(str) {
    return str.toUpperCase();
  }

  function addHyphen(str) {
    return str.replace(/\s+/g, "-").toLowerCase();
  }

  return {
    toUpper,
    addHyphen,
  };
};
