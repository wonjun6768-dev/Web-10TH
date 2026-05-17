import { useInfiniteQuery } from "@tanstack/react-query";
import { getInfiniteLpList } from "../../apis/lp";

export const useSearchLps = (search: string) => {
  return useInfiniteQuery({
    queryKey: ["search", search],
    queryFn: ({ pageParam = 0 }) => 
      getInfiniteLpList({ 
        cursor: pageParam as number, 
        limit: 10, // 요구사항에 없지만 무한 스크롤을 위해 적절한 limit 설정
        search 
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // 다음 페이지가 있으면 nextCursor 반환, 없으면 undefined 반환
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
    // 검색어가 있을 때만(공백 제외) 쿼리 실행
    enabled: !!search.trim(),
    // 불필요한 재요청 방지를 위한 캐싱 시간 설정
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10,   // 10분
  });
};

export default useSearchLps;
