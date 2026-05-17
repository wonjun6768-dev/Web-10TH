import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function useDeleteUserMutation() {
  const { setAccessToken, setRefreshToken } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      setAccessToken(null);
      setRefreshToken(null);
      navigate("/login");
    },
    onError: (error) => {
      console.error(error);
      alert("회원 탈퇴에 실패했습니다.");
    },
  });
}

export default useDeleteUserMutation;
