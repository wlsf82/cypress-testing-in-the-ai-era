import { useCart } from '../context/CartContext';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';

interface CartProps {
  onCheckout: () => void;
}

export function Cart({ onCheckout }: CartProps) {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <div data-testid="empty-cart" className="text-center py-8">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <div
          data-testid="cart-item"
          key={item.emoji.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{item.emoji.symbol}</span>
            <div>
              <h3 className="font-semibold">{item.emoji.name}</h3>
              <p className="text-gray-600">${item.emoji.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.emoji.id, Math.max(1, item.quantity - 1))}
                className="text-gray-500 hover:text-gray-700"
              >
                <MinusCircle size={20} />
              </button>
              <span data-testid="cart-item-counter" className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.emoji.id, item.quantity + 1)}
                className="text-gray-500 hover:text-gray-700"
              >
                <PlusCircle size={20} />
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.emoji.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mt-4">
        <span className="font-semibold">Total:</span>
        <span className="text-xl font-bold">${total.toFixed(2)}</span>
      </div>
      <button
        onClick={onCheckout}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
