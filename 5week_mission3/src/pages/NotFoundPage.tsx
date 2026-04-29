import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-4xl font-bold text-red-500">404</h1>
            <p className="text-lg">페이지를 찾을 수 없습니다.</p>
            <button 
                onClick={() => navigate('/')}
                className="text-blue-500 underline"
            >
                홈으로 돌아가기
            </button>
        </div>
    );
};

export default NotFoundPage;