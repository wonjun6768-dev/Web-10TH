import { useState, useRef, useEffect } from "react";
import useGetComments from "../hooks/queries/useGetComments";
import useCreateCommentMutation from "../hooks/mutations/useCreateCommentMutation";
import useUpdateCommentMutation from "../hooks/mutations/useUpdateCommentMutation";
import useDeleteCommentMutation from "../hooks/mutations/useDeleteCommentMutation";

interface CommentSectionProps {
  lpId: number;
  myId?: number;
}

const CommentSection = ({ lpId, myId }: CommentSectionProps) => {
  const { data: comments, isLoading } = useGetComments(lpId);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutate: createComment, isPending: isCreating } = useCreateCommentMutation(lpId);
  const { mutate: updateComment, isPending: isUpdating } = useUpdateCommentMutation(lpId);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteCommentMutation(lpId);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    createComment(trimmed, {
      onSuccess: () => setCommentText(""),
    });
  };

  const handleStartEdit = (id: number, currentContent: string) => {
    setEditingId(id);
    setEditingText(currentContent);
    setMenuOpenId(null);
  };

  const handleUpdateComment = (commentId: number) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;
    updateComment(
      { commentId, content: trimmed },
      { onSuccess: () => { setEditingId(null); setEditingText(""); } }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    deleteComment(commentId, {
      onSuccess: () => setMenuOpenId(null),
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-white text-lg font-semibold border-b border-gray-700 pb-3">
        댓글 {comments?.length ? `(${comments.length})` : ""}
      </h2>

      {/* 댓글 작성 */}
      <div className="flex gap-3">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleCreateComment();
            }
          }}
          placeholder="댓글을 입력하세요..."
          rows={2}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none text-sm"
        />
        <button
          onClick={handleCreateComment}
          disabled={isCreating || !commentText.trim()}
          className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors cursor-pointer self-end"
        >
          {isCreating ? "..." : "작성"}
        </button>
      </div>

      {/* 댓글 목록 */}
      {isLoading ? (
        <p className="text-gray-500 text-sm">댓글을 불러오는 중...</p>
      ) : comments?.length === 0 ? (
        <p className="text-gray-500 text-sm">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
      ) : (
        <div className="space-y-4">
          {comments?.map((comment) => {
            const isOwner = myId !== undefined && comment.author?.id === myId;
            const isEditing = editingId === comment.id;

            return (
              <div key={comment.id} className="flex gap-3 group">
                {/* 아바타 */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-700 overflow-hidden">
                  {comment.author?.avatar ? (
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                      {comment.author?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">{comment.author?.name ?? "알 수 없음"}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={2}
                        className="flex-1 bg-gray-800 border border-green-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none resize-none"
                        autoFocus
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={isUpdating}
                          className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded cursor-pointer"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditingText(""); }}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded cursor-pointer"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                  )}
                </div>

                {/* 내 댓글 ... 메뉴 */}
                {isOwner && !isEditing && (
                  <div className="relative flex-shrink-0" ref={menuOpenId === comment.id ? menuRef : null}>
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === comment.id ? null : comment.id)}
                      className="text-gray-500 hover:text-white p-1 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="메뉴"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="5" cy="12" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="19" cy="12" r="1.5" />
                      </svg>
                    </button>

                    {menuOpenId === comment.id && (
                      <div className="absolute right-0 top-7 z-10 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-28 overflow-hidden">
                        <button
                          onClick={() => handleStartEdit(comment.id, comment.content)}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={isDeleting}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
