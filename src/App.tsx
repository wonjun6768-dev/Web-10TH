import { useState, useMemo } from 'react';
import cartItemsData from './constans/cartItems';
import CartItem from './components/CartItem';
import type { CartItemType } from './types/cart';

function App() {
  const [cartItems, setCartItems] = useState<CartItemType[]>(cartItemsData as CartItemType[]);

  // 수량 증가
  const handleIncrease = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      )
    );
  };

  // 수량 감소 (1 미만이면 삭제)
  const handleDecrease = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0)
    );
  };

  // 개별 아이템 삭제
  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 전체 삭제
  const handleClearAll = () => {
    setCartItems([]);
  };

  // 총 수량
  const totalAmount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.amount, 0),
    [cartItems]
  );

  // 총 금액
  const totalPrice = useMemo(
    () =>
      cartItems.reduce((acc, item) => acc + Number(item.price) * item.amount, 0),
    [cartItems]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <h1 className="text-xl font-bold text-gray-800">Music Cart</h1>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
            <span className="text-indigo-600 font-semibold text-sm">
              총 {totalAmount}개
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          /* 빈 장바구니 */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🎶</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              장바구니가 비어있어요
            </h2>
            <p className="text-gray-400 text-sm">음악을 담아보세요!</p>
          </div>
        ) : (
          <>
            {/* 전체 삭제 버튼 */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearAll}
                className="text-sm text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 px-4 py-1.5 rounded-full transition-colors"
              >
                전체 삭제
              </button>
            </div>

            {/* 장바구니 목록 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* 총 합계 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500 text-sm">총 수량</span>
                <span className="font-semibold text-gray-800">{totalAmount}개</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-800 text-lg">총 금액</span>
                <span className="font-bold text-indigo-600 text-xl">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
