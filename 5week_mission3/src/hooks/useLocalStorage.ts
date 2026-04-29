export const useLocalStorage = (key: string) => {
  const setItem = (value: string) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getItem = () => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  const removeItem = () => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};