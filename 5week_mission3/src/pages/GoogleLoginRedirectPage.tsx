import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const GoogleLoginRedirectPage = () => {
  const { setItem: setAccessToken } = useLocalStorage('accessToken');
  const { setItem: setRefreshToken } = useLocalStorage('refreshToken');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(window.location.search);
    console.log(urlParams);

    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      window.location.href = '/my';
    }
  }, [setAccessToken, setRefreshToken]);

  return (
    <div>
    </div>
  );
};

export default GoogleLoginRedirectPage;