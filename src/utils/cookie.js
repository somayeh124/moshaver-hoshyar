import Cookies from 'js-cookie';

export const setCookieValue = (name, value, options = {}) => {
  Cookies.set(name, value, { path: '/', ...options });
};

export const getCookieValue = (name) => {
  const cookieValue = Cookies.get(name);
  return cookieValue !== undefined ? cookieValue : null;
};
