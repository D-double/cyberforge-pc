'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types';
import {
  X,
  Send,
  CheckCircle2,
  CreditCard,
  Building,
  Phone,
  User,
  ShieldCheck,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TelegramCheckoutModal() {
  const {
    t,
    lang,
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    clearCart,
    addOrder,
    formatPrice,
  } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [telegram, setTelegram] = useState('@');
  const [city, setCity] = useState('Ташкент');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'telegram' | 'click' | 'payme' | 'cash'>('telegram');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || phone.length < 9) {
      alert('Пожалуйста, заполните имя и телефон');
      return;
    }

    const newOrder = addOrder({
      customerName: name,
      customerPhone: phone,
      customerTelegram: telegram,
      deliveryCity: city,
      deliveryAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'telegram' ? 'paid' : 'pending',
      orderStatus: 'new',
      items: [...cart],
      totalUZS: cartTotal,
      notes: 'Заказ оформлен через интерфейс магазина',
    });

    setCompletedOrder(newOrder);
    clearCart();

    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Send className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">
              {completedOrder ? t.checkout.orderSuccess : t.checkout.title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-1 rounded bg-cyan-950 border border-cyan-800">
                Заказ № {completedOrder.orderNumber}
              </span>
              <h4 className="text-xl font-black text-white mt-2">
                {t.checkout.orderSuccess}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                {t.checkout.orderSuccessDesc}
              </p>
            </div>

            {/* Simulated Telegram Invoice Box */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Получатель:</span>
                <span className="font-semibold text-white">{completedOrder.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Телефон:</span>
                <span className="font-mono text-white">{completedOrder.customerPhone}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Сумма к оплате:</span>
                <span className="text-sm font-black text-cyan-400">{formatPrice(completedOrder.totalUZS)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Способ:</span>
                <span className="font-semibold text-sky-400">Telegram Bot (Click / Payme)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`https://t.me/CyberForgeSupportBot?start=${completedOrder.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <Send className="w-4 h-4" />
                {t.checkout.openTelegramBot}
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              <button
                onClick={handleClose}
                className="w-full py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                {t.checkout.close}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {t.checkout.customerName} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.checkout.namePlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {t.checkout.phone} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.checkout.phonePlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  {t.checkout.telegramUser}
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder={t.checkout.telegramPlaceholder}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {t.checkout.city}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t.checkout.cityPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {t.checkout.address}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.checkout.addressPlaceholder}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                {t.checkout.paymentMethod}
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'telegram',
                    title: t.checkout.methods.telegram,
                    icon: '✈️',
                    recommended: true,
                  },
                  { id: 'click', title: t.checkout.methods.click, icon: '⚡' },
                  { id: 'payme', title: t.checkout.methods.payme, icon: '💳' },
                  { id: 'cash', title: t.checkout.methods.cash, icon: '💵' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === m.id
                        ? 'bg-sky-950/40 border-sky-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id as any)}
                        className="text-sky-500 focus:ring-0"
                      />
                      <span className="text-base">{m.icon}</span>
                      <span className="text-xs font-semibold">{m.title}</span>
                    </div>
                    {m.recommended && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500 text-neutral-950 font-bold">
                        Fast
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">К оплате:</span>
                <span className="text-base font-black text-cyan-400">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white transition-all flex items-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                {t.checkout.submitOrder}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
