import { useState, useEffect, useRef } from 'react';
import useSearchLps from '../hooks/queries/useSearchLps';
import useDebounce from '../hooks/useDebounce';
import useThrottle from '../hooks/useThrottle';

const SearchPage = () => {
  // 1. 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState("");
  
  // 2. 검색어 디바운스 적용 (300ms)
  const debouncedQuery = useDebounce(searchTerm, 300);

  // 3. 무한 쿼리 훅 호출
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useSearchLps(debouncedQuery);

  // 무한 스크롤 이벤트에 throttle 적용 (1초 간격)
  const throttledFetchNextPage = useThrottle(() => {
    fetchNextPage();
  }, 1000);

  // 무한 스크롤을 위한 observer ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('IntersectionObserver: isIntersecting true, call throttledFetchNextPage');
        throttledFetchNextPage();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, throttledFetchNextPage]);

  // 무한 쿼리로 받아온 데이터를 1차원 배열로 평탄화
  const lpList = data?.pages.flatMap(page => page.data) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* --- 검색창 섹션 (두 번째 사진 부분) --- */}
      <div className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="LP 제목을 검색하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 입력할 때마다 searchTerm 업데이트
          />
        </div>
      </div>

      {/* --- 검색 결과 섹션 (첫 번째 사진 같은 그리드) --- */}
      <div className="bg-[#0a1a14] py-10 px-8 min-h-[50vh]"> {/* 결과 부분은 어두운 배경 */}
        {isLoading ? (
          <p className="text-white text-center">검색 중...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {lpList.map((lp) => (
              <div key={lp.id} className="group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-sm bg-gray-800 mb-3">
                  <img 
                    src={lp.thumbnail} 
                    alt={lp.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="text-left">
                  <p className="text-green-400 text-[10px] font-bold">PREMIUM ARTIST</p>
                  <h3 className="text-white text-sm font-medium truncate">{lp.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 무한 스크롤 트리거 엘리먼트 */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="py-10 text-center text-white">
            {isFetchingNextPage ? '더 불러오는 중...' : ''}
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!isLoading && debouncedQuery.trim() !== "" && lpList.length === 0 && (
          <p className="text-gray-400 text-center py-20">검색 결과가 없습니다.</p>
        )}

        {/* 검색어를 입력하지 않았을 때 */}
        {debouncedQuery.trim() === "" && (
          <p className="text-gray-400 text-center py-20">검색어를 입력해주세요.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;