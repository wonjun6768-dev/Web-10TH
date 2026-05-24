import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { accessToken } = useAuth();

  return (
    <>
      {/* 배경 오버레이 - 클릭 시 사이드바 닫기 */}
      <div
        className={`fixed inset-0 bg-black z-20 transition-opacity duration-300 ${
          isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 사이드바 패널 */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* 상단 헤더 영역 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-900 dark:text-white">체컵</span>
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="사이드바 닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="flex flex-col p-4 gap-1">
          <Link
            to="/"
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
          >
            🏠 홈
          </Link>
          <Link
            to="/search"
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
          >
            🔍 검색
          </Link>

          {!accessToken && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
              <Link
                to="/login"
                onClick={onClose}
                className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              >
                🔑 로그인
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              >
                📝 회원가입
              </Link>
            </>
          )}

          {accessToken && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
              <Link
                to="/my"
                onClick={onClose}
                className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
              >
                👤 마이 페이지
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
