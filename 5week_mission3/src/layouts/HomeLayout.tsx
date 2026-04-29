import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
    return (
        <div className="flex flex-col min-h-dvh">
            <nav className="p-4 border-b">내비게이션 바</nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="p-4 border-t">푸터</footer>
        </div>
    );
};

export default HomeLayout;