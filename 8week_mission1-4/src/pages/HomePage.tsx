import { useState } from 'react';
import useGetLpList from '../hooks/queries/useGetLpList';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const { data: lpList, isLoading, isError } = useGetLpList({ search });

  if (isLoading) return <div className="p-20">로딩 중입니다...</div>;
  if (isError) return <div className="p-20 text-red-500">에러가 발생했습니다.</div>;

  return (
    <main className="mt-20 p-4">
      <input
        className="border p-2 rounded w-full mb-8"
        placeholder="LP 제목을 검색하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {lpList?.map((lp) => (
          <div key={lp.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold">{lp.title}</h2>
            <p className="text-gray-600">{lp.content}</p>
          </div>
        ))}
        {lpList?.length === 0 && <p>검색 결과가 없습니다.</p>}
      </div>
    </main>
  );
};

export default HomePage;