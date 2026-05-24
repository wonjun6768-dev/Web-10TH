import { useState, useRef, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";
import useLogoutMutation from "../hooks/mutations/useLogoutMutation";
import useUpdateMyInfoMutation from "../hooks/mutations/useUpdateMyInfoMutation";
import useDeleteUserMutation from "../hooks/mutations/useDeleteUserMutation";

const MyPage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const { mutate: updateMyInfo, isPending: isUpdating } = useUpdateMyInfoMutation();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUserMutation();

  const user = data?.data;

  const handleOpenEdit = () => {
    setEditName(user?.name ?? "");
    setEditBio(user?.bio ?? "");
    setEditAvatar(user?.avatar ?? "");
    setAvatarPreview(user?.avatar ?? null);
    setIsEditMode(true);
  };

  const handleAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEditAvatar(base64);
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateMyInfo(
      {
        name: editName || undefined,
        bio: editBio || undefined,
        avatar: editAvatar || undefined,
      },
      { onSuccess: () => setIsEditMode(false) }
    );
  };

  const handleDeleteConfirm = () => {
    deleteUser();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center">
        <p className="text-white">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1a14] pt-24 px-6 pb-10 flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-8 space-y-6">

        {/* 프로필 영역 */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-green-500">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">{user?.name}님 환영합니다.</h1>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            {user?.bio && <p className="text-gray-300 text-sm mt-2">{user.bio}</p>}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleOpenEdit}
            className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            ⚙ 프로필 수정
          </button>
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
          <button
            onClick={() => setIsDeleteConfirm(true)}
            className="w-full py-3 border border-red-700 text-red-400 hover:bg-red-900/30 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* 프로필 수정 모달 */}
      {isEditMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-xl font-bold">프로필 수정</h2>
              <button
                onClick={() => setIsEditMode(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 아바타 업로드 */}
            <div className="flex flex-col items-center gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full overflow-hidden bg-gray-700 border-2 border-dashed border-gray-500 hover:border-green-500 cursor-pointer transition-colors"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-1">
                    클릭하여 사진 변경
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />
              <p className="text-gray-500 text-xs">프로필 사진 (선택)</p>
            </div>

            {/* 이름 */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">이름</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {/* bio */}
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Bio <span className="text-gray-600">(선택)</span></label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                placeholder="자기소개를 입력해주세요"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {isUpdating ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {isDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 bg-[#111827] border border-gray-700 rounded-2xl shadow-2xl p-6 space-y-5 text-center">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-red-900/40 border border-red-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">정말 탈퇴하시겠습니까?</h3>
              <p className="text-gray-400 text-sm mt-2">탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
              >
                아니오
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl font-medium transition-colors cursor-pointer"
              >
                {isDeleting ? "처리 중..." : "예, 탈퇴합니다"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;