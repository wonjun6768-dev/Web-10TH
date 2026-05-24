import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CreateLpModal from "../components/CreateLpModal";
import { useAuth } from "../context/AuthContext";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useThrottle from "../hooks/useThrottle";

const LpListPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetInfiniteLpList({ order: "desc", limit: 20 });

  // 스크롤 이벤트 핸들러를 useThrottle로 감싸 1초에 한 번만 실행
  const handleScroll = useThrottle(
    useCallback(() => {
      const scrollTop = document.documentElement.scrollTop;
      const innerHeight = window.innerHeight;
      const offsetHeight = document.documentElement.offsetHeight;

      console.log("✅ [Throttle 작동] 1초마다 한 번씩 실행됩니다.");
      console.log(
        `📊 scrollTop(${scrollTop}) + innerHeight(${innerHeight}) = ${scrollTop + innerHeight} / offsetHeight(${offsetHeight})`
      );
      console.log(
        `🔍 hasNextPage: ${hasNextPage}, isFetchingNextPage: ${isFetchingNextPage}`
      );

      if (scrollTop + innerHeight >= offsetHeight - 300) {
        if (hasNextPage && !isFetchingNextPage) {
          console.log("🚀 [다음 페이지 요청!] fetchNextPage 호출");
          fetchNextPage();
        }
      }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]),
    1000 // 1초 스로틀
  );

  useEffect(() => {
    // 원본 스크롤 이벤트 발생 횟수 확인용 (제한 없음)
    const rawHandler = () => {
      console.log("🔥 [스크롤 이벤트 발생] 제한 없음");
    };

    window.addEventListener("scroll", rawHandler);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", rawHandler);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (isLoading)
    return (
      <div className="text-white p-10 text-center">LP 목록을 불러오는 중...</div>
    );
  if (isError)
    return (
      <div className="text-red-500 p-10 text-center">
        데이터를 가져오는데 실패했습니다.
      </div>
    );

  const lpList = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="min-h-screen bg-[#0a1a14] pt-24 px-8 pb-20">
      <header className="mb-8">
        <p className="text-green-400 text-sm font-semibold mb-1">
          DEEP GREEN COLLECTION
        </p>
        <h1 className="text-white text-3xl font-bold">전체 LP</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {lpList.map((lp) => (
          <div
            key={lp.id}
            className="group cursor-pointer"
            onClick={() => navigate(`/lps/${lp.id}`)}
          >
            <div className="aspect-square overflow-hidden rounded-sm bg-gray-800 mb-3">
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="space-y-1">
              <p className="text-[#4ade80] text-[10px] font-bold tracking-tighter uppercase">
                PREMIUM ARTIST
              </p>
              <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug">
                {lp.title}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {lp.tags?.map((tag) => (
                  <span key={tag.id} className="text-gray-500 text-xs">
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 추가 데이터 로딩 중 표시 */}
      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-10">
          <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-green-400 ml-3 font-semibold">
            추가 LP를 불러오는 중...
          </span>
        </div>
      )}

      {/* 더 이상 데이터가 없을 때 */}
      {!hasNextPage && lpList.length > 0 && (
        <p className="text-center text-gray-500 py-10">
          모든 LP를 불러왔습니다. (총 {lpList.length}개)
        </p>
      )}

      {/* 우측 하단 + FAB 버튼 (로그인 시에만) */}
      {accessToken && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl font-light transition-all duration-200 hover:scale-110 cursor-pointer z-40"
          aria-label="LP 작성"
        >
          +
        </button>
      )}

      {/* LP 작성 모달 */}
      {isModalOpen && <CreateLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default LpListPage;