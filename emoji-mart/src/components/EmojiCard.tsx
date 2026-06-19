import { Emoji } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface EmojiCardProps {
  emoji: Emoji;
  onClick: () => void;
}

export function EmojiCard({ emoji, onClick }: EmojiCardProps) {
  const { addToCart } = useCart();

  return (
    <div data-testid="emoji-card" className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <div className="cursor-pointer" onClick={onClick}>
        <div className="text-6xl mb-4 text-center">{emoji.symbol}</div>
        <h3 className="text-xl font-semibold mb-2">{emoji.name}</h3>
        <p className="text-gray-600 mb-4">{emoji.description}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">${emoji.price.toFixed(2)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(emoji);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
