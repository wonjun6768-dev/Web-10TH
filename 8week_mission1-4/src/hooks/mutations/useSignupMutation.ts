import { useMutation } from "@tanstack/react-query";
import { postSignup } from "../../apis/auth";
import type { RequestSignupDto } from "../../types/auth";
import { useNavigate } from "react-router-dom";

function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (signupData: RequestSignupDto) => postSignup(signupData),
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      console.error(error);
      alert("회원가입에 실패했습니다.");
    },
  });
}

export default useSignupMutation;
