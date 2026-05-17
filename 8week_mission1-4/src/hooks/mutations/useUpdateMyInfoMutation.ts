import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import type { PatchMyInfoDto } from "../../types/auth";

function useUpdateMyInfoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PatchMyInfoDto) => patchMyInfo(body),
    // Optimistic update: immediately update cached `myInfo` before server responds
    onMutate: async (newData: PatchMyInfoDto) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });
      const previous = queryClient.getQueryData(["myInfo"]);

      queryClient.setQueryData(["myInfo"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            ...newData,
          },
        };
      });

      return { previous };
    },
    onError: (error, _variables, context: any) => {
      console.error(error);
      if (context?.previous) {
        queryClient.setQueryData(["myInfo"], context.previous);
      }
      alert("프로필 수정에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
}

export default useUpdateMyInfoMutation;
