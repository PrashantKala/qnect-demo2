"use client";

export default function QrCreditPriceSection({ credits, useCredits, onUseCreditsChange, price = 249 }) {
  const creditsAvailable = credits || 0;
  const creditsToUse = Math.min(creditsAvailable, price);

  return (
    <>
      {creditsAvailable > 0 && (
        <div className="bg-white/10 rounded-lg p-3 space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useCredits}
              onChange={(e) => onUseCreditsChange(e.target.checked)}
              className="w-5 h-5 rounded accent-cyan-400"
            />
            <span className="font-semibold">
              Apply {creditsToUse} credits (₹{creditsToUse} off)
            </span>
          </label>
          <p className="text-xs text-white/60">You have {creditsAvailable} credits (₹{creditsAvailable}). 1 Credit = ₹1</p>
        </div>
      )}

      {useCredits && creditsAvailable > 0 && (() => {
        const discountedBase = price - creditsToUse;
        const gst = (discountedBase * 0.18).toFixed(2);
        const total = (discountedBase * 1.18).toFixed(2);
        return (
          <div className="border-t border-white/20 pt-2 space-y-1 text-sm">
            <div className="flex justify-between text-green-300">
              <span>Credit Discount</span>
              <span>-₹{creditsToUse}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-1 border-t border-white/20">
              <span>Total</span>
              <span>{Number(total) <= 0 ? 'FREE' : `₹${total}`}</span>
            </div>
          </div>
        );
      })()}

      {(!useCredits || !creditsAvailable) && (
        <div className="border-t border-white/20 pt-2">
          <div className="flex justify-between text-sm text-white/70">
            <span>GST (18%)</span>
            <span>₹{(price * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-1">
            <span>Total</span>
            <span>₹{(price * 1.18).toFixed(2)}</span>
          </div>
        </div>
      )}
    </>
  );
}
