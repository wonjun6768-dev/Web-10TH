import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/lp";

function useDeleteCommentMutation(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
    onError: (error) => {
      console.error(error);
      alert("댓글 삭제에 실패했습니다.");
    },
  });
}

export default useDeleteCommentMutation;
