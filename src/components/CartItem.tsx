import type { CartItemType } from '../types/cart';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onIncrease, onDecrease, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200">
      <img
        src={item.img}
        alt={item.title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
        <p className="text-sm text-gray-500 truncate">{item.singer}</p>
        <p className="text-sm font-bold text-indigo-600 mt-1">
          {Number(item.price).toLocaleString()}원
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onIncrease(item.id)}
          className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center hover:bg-indigo-200 transition-colors"
        >
          +
        </button>
        <span className="w-6 text-center font-semibold text-gray-800">
          {item.amount}
        </span>
        <button
          onClick={() => onDecrease(item.id)}
          className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center hover:bg-indigo-200 transition-colors"
        >
          -
        </button>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors ml-2"
        aria-label="삭제"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
