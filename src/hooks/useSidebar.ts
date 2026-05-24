import { useState, useEffect } from "react";

function useSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 사이드바 열기
  const open = () => setIsOpen(true);

  // 사이드바 닫기
  const close = () => setIsOpen(false);

  // 사이드바 토글
  const toggle = () => setIsOpen((prev) => !prev);

  // ESC 키로 사이드바 닫기 (접근성 개선)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("keydown", handleKeyDown);

    // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 해제 (메모리 누수 방지)
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // 마운트 시 한 번만 실행

  // 사이드바 열림 시 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // overflow-hidden으로 배경 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 클린업: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
}

export default useSidebar;
