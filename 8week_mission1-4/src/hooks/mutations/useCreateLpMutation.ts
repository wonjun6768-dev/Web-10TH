import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp, type CreateLpBody } from "../../apis/lp";
import { queryKey } from "../../constants/key";

function useCreateLpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateLpBody) => postLp(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.lps] });
    },
    onError: (error: unknown) => {
      console.error(error);
      // axios 에러에서 실제 메시지 추출
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "LP 작성에 실패했습니다.";
      alert(`오류: ${msg}`);
    },
  });
}

export default useCreateLpMutation;
