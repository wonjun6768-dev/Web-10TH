import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import CreateLpModal from "../components/CreateLpModal";
import { useAuth } from "../context/AuthContext";

const LpListPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: lpList, isLoading, isError } = useGetLpList({
    order: "desc",
    limit: 50,
  });

  if (isLoading) return <div className="text-white p-10 text-center">LP 목록을 불러오는 중...</div>;
  if (isError) return <div className="text-red-500 p-10 text-center">데이터를 가져오는데 실패했습니다.</div>;

  return (
    <div className="min-h-screen bg-[#0a1a14] pt-24 px-8 pb-20">
      <header className="mb-8">
        <p className="text-green-400 text-sm font-semibold mb-1">DEEP GREEN COLLECTION</p>
        <h1 className="text-white text-3xl font-bold">전체 LP</h1>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {lpList?.map((lp) => (
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
                  <span key={tag.id} className="text-gray-500 text-xs">#{tag.name}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

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
      {isModalOpen && (
        <CreateLpModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default LpListPage;