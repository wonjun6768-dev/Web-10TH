import { useQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/lp";

function useGetComments(lpId: number) {
  return useQuery({
    queryKey: ["comments", lpId],
    queryFn: () => getComments(lpId),
    enabled: !Number.isNaN(lpId),
  });
}

export default useGetComments;
