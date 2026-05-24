import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import Sidebar from "../components/Sidebar.tsx";
import useSidebar from "../hooks/useSidebar.ts";

const HomeLayout = () => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="h-dvh flex flex-col">
      {/* 사이드바 컴포넌트 */}
      <Sidebar isOpen={isOpen} onClose={close} />
      {/* 햄버거 버튼 클릭 시 toggle 호출 */}
      <Navbar onMenuClick={toggle} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;