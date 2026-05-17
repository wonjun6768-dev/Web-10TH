import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import type { RequestSigninDto } from "../../types/auth";
import { useNavigate } from "react-router-dom";

function useSigninMutation() {
  const { setAccessToken, setRefreshToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (signinData: RequestSigninDto) => postSignin(signinData),
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      alert("로그인에 실패했습니다.");
    },
  });
}

export default useSigninMutation;
