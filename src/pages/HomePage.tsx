import { useState, useEffect } from 'react';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList';
import useThrottle from '../hooks/useThrottle';
import useDebounce from '../hooks/useDebounce';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteLpList({ search: debouncedSearch, limit: 20 });

  const handleScroll = useThrottle(() => {
    const scrollPos = window.innerHeight + document.documentElement.scrollTop;
    const bottomThreshold = document.documentElement.offsetHeight - 400;
    
    console.log(`✅ [Throttle 작동] 3초마다 한 번씩 실행 중입니다.`);
    console.log(`📊 현재 스크롤: ${scrollPos} / 기준점: ${bottomThreshold}`);
    console.log(`🔍 hasNextPage: ${hasNextPage}, isFetchingNextPage: ${isFetchingNextPage}`);

    if (scrollPos >= bottomThreshold) {
      if (hasNextPage && !isFetchingNextPage) {
        console.log("🚀 [데이터 패칭 요청] 다음 페이지를 불러옵니다!");
        fetchNextPage();
      }
    }
  }, 3000); // 영상처럼 3초 간격으로 스로틀링 적용

  useEffect(() => {
    // 순수 스크롤 이벤트 발생을 확인하기 위한 함수 (스로틀링 X)
    const rawScrollHandler = () => {
      console.log("🔥 [스크롤 이벤트 발생] 스크롤 중... (제한 없음)");
    };

    window.addEventListener('scroll', rawScrollHandler);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', rawScrollHandler);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (isLoading) return <div className="p-20">로딩 중입니다...</div>;
  if (isError) return <div className="p-20 text-red-500">에러가 발생했습니다.</div>;

  const lpList = data?.pages.flatMap((page) => page.data) || [];

  return (
    <main className="mt-20 p-4">
      <input
        className="border p-2 rounded w-full mb-8"
        placeholder="LP 제목을 검색하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {lpList.map((lp) => (
          <div key={lp.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold">{lp.title}</h2>
            <p className="text-gray-600">{lp.content}</p>
          </div>
        ))}
        {lpList.length === 0 && <p>검색 결과가 없습니다.</p>}
      </div>
      
      {isFetchingNextPage && (
        <div className="p-4 text-center text-gray-500 font-bold">
          추가 데이터를 불러오는 중입니다...
        </div>
      )}
    </main>
  );
};

export default HomePage;