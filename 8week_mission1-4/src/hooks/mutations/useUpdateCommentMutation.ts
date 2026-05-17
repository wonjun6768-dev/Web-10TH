import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchComment } from "../../apis/lp";

function useUpdateCommentMutation(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      patchComment(lpId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
    onError: (error) => {
      console.error(error);
      alert("댓글 수정에 실패했습니다.");
    },
  });
}

export default useUpdateCommentMutation;
