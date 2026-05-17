import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/lp";

function useCreateCommentMutation(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => postComment(lpId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
    onError: (error) => {
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
    },
  });
}

export default useCreateCommentMutation;
