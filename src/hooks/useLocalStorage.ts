export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      const valueToStore =
        typeof value === "string" ? value : JSON.stringify(value);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return null;

      if (item.startsWith("{") || item.startsWith("[")) {
        return JSON.parse(item);
      }

      return item.replace(/^"|"$/g, "");
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem, removeItem };
};