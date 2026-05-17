import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function useLogoutMutation() {
  const { setAccessToken, setRefreshToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => postLogout(),
    onSuccess: () => {
      setAccessToken(null);
      setRefreshToken(null);
      navigate("/login");
    },
    onError: (error) => {
      console.error(error);
      alert("로그아웃에 실패했습니다.");
    },
  });
}

export default useLogoutMutation;
