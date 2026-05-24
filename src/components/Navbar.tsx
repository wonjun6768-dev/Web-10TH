import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import useLogoutMutation from "../hooks/mutations/useLogoutMutation.ts";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../apis/auth";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { accessToken } = useAuth();
  const { mutate: logout, isPending } = useLogoutMutation();
  const { data: myInfo } = useQuery({ queryKey: ["myInfo"], queryFn: getMyInfo, enabled: Boolean(accessToken) });

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* 햄버거 메뉴 버튼 */}
          <button
            onClick={onMenuClick}
            className="p-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="메뉴 열기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            체컵
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {!accessToken && (
            <>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                회원가입
              </Link>
            </>
          )}
          {accessToken && (
            <>
              <Link
                to="/my"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                <span>마이 페이지</span>
                {myInfo?.data?.name && (
                  <span className="text-sm text-gray-500">{myInfo.data.name}</span>
                )}
              </Link>
              <button
                onClick={() => logout()}
                disabled={isPending}
                className="text-gray-700 dark:text-gray-300 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPending ? "..." : "로그아웃"}
              </button>
            </>
          )}
          <Link
            to="/search"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            검색
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;