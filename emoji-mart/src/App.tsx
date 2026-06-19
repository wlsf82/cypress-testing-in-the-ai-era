import { useState } from 'react';
import { emojis } from './data/emojis';
import { EmojiCard } from './components/EmojiCard';
import { Cart } from './components/Cart';
import { SearchBar } from './components/SearchBar';
import { CartProvider } from './context/CartContext';
import { ShoppingCart, X, SearchX } from 'lucide-react';
import { useCart } from './context/CartContext';
import { CheckoutForm } from './components/CheckoutForm';
import { ThankYouPage } from './components/ThankYouPage';
import { CheckoutFormData } from './types';

type AppView = 'store' | 'checkout' | 'thankYou';

// Wrapper component to access cart context
function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('store');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const { cart, addToCart, clearCart } = useCart();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const filteredEmojis = emojis.filter(
    emoji =>
      emoji.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emoji.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmojiData = emojis.find(emoji => emoji.id === selectedEmoji);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleCompleteCheckout = (_formData: CheckoutFormData) => {
    // Simulate order processing
    const newOrderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    setOrderNumber(newOrderNumber);
    clearCart();
    setCurrentView('thankYou');
  };

  const handleBackToStore = () => {
    setCurrentView('store');
    setSelectedEmoji(null);
  };

  if (currentView === 'thankYou') {
    return <ThankYouPage orderNumber={orderNumber} onBackToStore={handleBackToStore} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">EmojiMart</h1>
          {currentView === 'store' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'checkout' ? (
          <div>
            <button
              onClick={handleBackToStore}
              className="mb-6 text-indigo-600 hover:text-indigo-700"
            >
              ← Back to store
            </button>
            <CheckoutForm onSubmit={handleCompleteCheckout} />
          </div>
        ) : (
          <>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {selectedEmoji ? (
              <div className="mt-8">
                <button
                  onClick={() => setSelectedEmoji(null)}
                  className="mb-4 text-indigo-600 hover:text-indigo-700"
                >
                  ← Back to all emojis
                </button>
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="text-9xl mb-6 text-center">
                    {selectedEmojiData?.symbol}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{selectedEmojiData?.name}</h2>
                  <p className="text-gray-600 mb-6">{selectedEmojiData?.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      ${selectedEmojiData?.price.toFixed(2)}
                    </span>
                    {selectedEmojiData && (
                      <button
                        onClick={() => addToCart(selectedEmojiData)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              filteredEmojis.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEmojis.map(emoji => (
                    <EmojiCard
                      key={emoji.id}
                      emoji={emoji}
                      onClick={() => setSelectedEmoji(emoji.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-8 flex flex-col items-center justify-center text-center py-16">
                  <SearchX size={64} className="text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    No emojis found
                  </h2>
                  <p className="text-gray-500">
                    We couldn't find any emojis matching "{searchQuery}". Try a different search.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-100 shadow-xl">
            <div className="p-4 flex justify-between items-center bg-white">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <Cart onCheckout={handleCheckout} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap AppContent with CartProvider
function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
