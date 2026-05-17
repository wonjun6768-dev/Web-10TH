import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp.ts";
import { getMyInfo } from "../apis/auth.ts";
import useLikeLpMutation from "../hooks/mutations/useLikeLpMutation.ts";
import useDeleteLpMutation from "../hooks/mutations/useDeleteLpMutation.ts";
import { useAuth } from "../context/AuthContext.tsx";
import CommentSection from "../components/CommentSection.tsx";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const parsedId = Number(lpId);
  const { accessToken } = useAuth();

  const { data: lp, isLoading, isError } = useQuery({
    queryKey: ["getLpDetail", parsedId],
    queryFn: () => getLpDetail(parsedId),
    enabled: Boolean(lpId) && !Number.isNaN(parsedId),
  });

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    enabled: Boolean(accessToken),
  });

  const { likeMutation, unlikeMutation } = useLikeLpMutation(parsedId);

  if (!lpId || Number.isNaN(parsedId)) {
    return <div className="p-10">잘못된 LP 주소입니다.</div>;
  }

  if (isLoading) return <div className="p-10 text-white">LP 상세 정보를 불러오는 중...</div>;
  if (isError) return <div className="p-10 text-red-500">LP 상세 정보를 불러오는데 실패했습니다.</div>;

  const myId = myInfo?.data?.id;
  const isLiked = lp?.likes?.some((like) => like.userId === myId) ?? false;
  const likeCount = lp?.likes?.length ?? lp?.likeCount ?? 0;
  const isPending = likeMutation.isPending || unlikeMutation.isPending;
  const isMyLp = myId !== undefined && lp?.author?.id === myId;

  const { mutate: deleteLp, isPending: isDeleting } = useDeleteLpMutation();

  const handleDelete = () => {
    if (!confirm("LP를 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.")) return;
    deleteLp(parsedId);
  };

  const handleLikeToggle = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a14] pt-24 px-8 pb-16 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-green-400 hover:text-green-300 cursor-pointer"
          >
            ← 전체 LP로 돌아가기
          </button>
        </div>

        <div className="rounded-lg bg-gray-900 p-6 shadow-lg">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr] items-start">
            <div className="rounded-xl overflow-hidden bg-black border border-gray-800">
              <img
                src={lp?.thumbnail}
                alt={lp?.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-green-400 font-semibold">LP 상세 정보</p>
                <div className="flex items-center justify-between mt-2">
                  <h1 className="text-3xl font-bold">{lp?.title}</h1>
                  {/* 본인 LP일 때만 삭제 버튼 표시 */}
                  {isMyLp && (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 border border-red-700 rounded-lg hover:bg-red-900/30 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      {isDeleting ? "삭제 중..." : "삭제"}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-300 leading-relaxed">{lp?.content}</p>
                <div className="flex flex-wrap gap-2">
                  {lp?.tags?.map((tag) => (
                    <span key={tag.id} className="text-xs text-gray-400 bg-white/5 rounded-full px-3 py-1">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 좋아요 버튼 */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleLikeToggle}
                  disabled={isPending}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer
                    ${isLiked
                      ? "bg-pink-500/20 border-pink-500 text-pink-400 hover:bg-pink-500/30"
                      : "bg-white/5 border-gray-600 text-gray-400 hover:border-pink-400 hover:text-pink-400"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{likeCount}</span>
                </button>
                <span className="text-sm text-gray-500">
                  {isLiked ? "좋아요 취소" : "좋아요"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <CommentSection lpId={parsedId} myId={myId} />
      </div>
    </div>
  );
};

export default LpDetailPage;
