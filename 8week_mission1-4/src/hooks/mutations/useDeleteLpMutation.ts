import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { queryKey } from "../../constants/key";
import { useNavigate } from "react-router-dom";

function useDeleteLpMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (lpId: number) => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.lps] });
      navigate("/");
    },
    onError: (error: unknown) => {
      console.error(error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "LP 삭제에 실패했습니다.";
      alert(`오류: ${msg}`);
    },
  });
}

export default useDeleteLpMutation;
