import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeLp, unlikeLp } from "../../apis/lp";

function useLikeLpMutation(lpId: number) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likeLp(lpId),
    // optimistic update: add a like locally before server responds
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["getLpDetail", lpId] });
      const previous = queryClient.getQueryData(["getLpDetail", lpId]);

      const myId = queryClient.getQueryData(["myInfo"])?.data?.id;

      queryClient.setQueryData(["getLpDetail", lpId], (old: any) => {
        if (!old) return old;
        const oldLikes = old.data?.likes ?? [];
        // append a temporary like for current user
        const newLikes = [...oldLikes, { id: `temp-${Date.now()}`, userId: myId }];
        return {
          ...old,
          data: {
            ...old.data,
            likes: newLikes,
          },
        };
      });

      return { previous };
    },
    onError: (error, _variables, context: any) => {
      console.error(error);
      if (context?.previous) {
        queryClient.setQueryData(["getLpDetail", lpId], context.previous);
      }
      alert("좋아요에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getLpDetail", lpId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeLp(lpId),
    // optimistic update: remove current user's like locally
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["getLpDetail", lpId] });
      const previous = queryClient.getQueryData(["getLpDetail", lpId]);

      const myId = queryClient.getQueryData(["myInfo"])?.data?.id;

      queryClient.setQueryData(["getLpDetail", lpId], (old: any) => {
        if (!old) return old;
        const oldLikes = old.data?.likes ?? [];
        const newLikes = oldLikes.filter((l: any) => l.userId !== myId);
        return {
          ...old,
          data: {
            ...old.data,
            likes: newLikes,
          },
        };
      });

      return { previous };
    },
    onError: (error, _variables, context: any) => {
      console.error(error);
      if (context?.previous) {
        queryClient.setQueryData(["getLpDetail", lpId], context.previous);
      }
      alert("좋아요 취소에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getLpDetail", lpId] });
    },
  });

  return { likeMutation, unlikeMutation };
}

export default useLikeLpMutation;
