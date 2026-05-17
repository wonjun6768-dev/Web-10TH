import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleLoginRedirectPage = () => {
  const { setAccessToken, setRefreshToken } = useAuth();

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