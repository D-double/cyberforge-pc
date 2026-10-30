'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function CartDrawer() {
  const {
    t,
    lang,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    formatPrice,
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">
                {t.cart.title} ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm font-medium">
                  {t.cart.empty}
                </p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex gap-3"
                >
                  <div className="relative w-16 h-16 rounded-lg bg-neutral-900 overflow-hidden shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-neutral-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.isCustomBuild && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold inline-block mt-1">
                        {t.cart.customRigBadge}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-800">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="text-neutral-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-cyan-400">
                        {formatPrice(item.product.priceUZS * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-neutral-400">{t.cart.total}:</span>
                <span className="text-xl font-black text-white">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              {/* Checkout via Telegram Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <Send className="w-4 h-4" />
                {t.cart.checkoutTelegramBtn}
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2 text-xs font-semibold text-neutral-400 hover:text-red-400 transition-colors"
              >
                {t.cart.clearCart}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
