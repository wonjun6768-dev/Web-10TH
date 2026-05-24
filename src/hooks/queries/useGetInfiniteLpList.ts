import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common.ts";
import { getInfiniteLpList } from "../../apis/lp.ts";
import { queryKey } from "../../constants/key.ts";

function useGetInfiniteLpList({ search, order, limit }: PaginationDto = {}) {
  return useInfiniteQuery({
    queryKey: [queryKey.lps, "infinite", { search, order, limit }],
    queryFn: ({ pageParam = 0 }) =>
      getInfiniteLpList({ cursor: pageParam, search, order, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetInfiniteLpList;
