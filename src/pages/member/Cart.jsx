// src/pages/member/Cart.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { insertOrder } from "../../lib/supabasepc";
import { fetchMember } from "../../lib/supabasemem";
import { Trash2, ShoppingBag, ArrowRight, Coins, AlertCircle, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQty, updatePointsToUse, removeFromCart, clearCart, totalPointsUsed, totalCash } = useCart();

  const [userPoints, setUserPoints] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("current_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setCurrentUser(parsedUser);
    setUserPoints(parsedUser.current_points || 0);

    // Sync points balance
    fetchMember()
      .then((members) => {
        const freshUser = members.find((m) => m.member_id === parsedUser.member_id);
        if (freshUser) {
          setUserPoints(freshUser.current_points || 0);
          localStorage.setItem(
            "current_user",
            JSON.stringify({ ...parsedUser, current_points: freshUser.current_points })
          );
        }
      })
      .catch((err) => console.error("Sync points error:", err));
  }, [navigate]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Check if overall points selection exceeds user points balance
  const pointsExceeded = totalPointsUsed > userPoints;

  const handleCheckout = async () => {
    if (cart.length === 0 || !currentUser) return;
    if (pointsExceeded) {
      setError("Points applied exceed your current points balance.");
      return;
    }

    setLoading(true);
    setError(null);

    const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Construct order items payload array for batch insertion
    const payloads = cart.map((item) => {
      const isPurePoints = item.allowCashPayment === false;
      const discount = (item.pointsToUse || 0) * 1000;
      const unitCashPayable = isPurePoints ? 0 : Math.max(0, item.price - discount);

      return {
        order_id: orderId,
        member_id: currentUser.member_id,
        product_id: item.id,
        qty: item.qty,
        product_price_idr: item.price || 0,
        shipping_cost_idr: 0,
        total_bill_idr: (item.price || 0) * item.qty,
        payment_method: isPurePoints ? "Points" : item.pointsToUse > 0 ? "Hybrid" : "Cash",
        payment_detail: isPurePoints
          ? `Pure Points Shop Redemption (${item.pointsPrice} pts)`
          : `Hybrid Checkout: Used ${item.pointsToUse} pts/unit for discount`,
        courier_service: "Standard Delivery",
        destination_region: "DKI Jakarta",
        status: "pending",
        points_used: (item.pointsToUse || 0) * item.qty,
        total_cash_paid: unitCashPayable * item.qty,
        order_date: new Date().toISOString().split('T')[0]
      };
    });

    try {
      await insertOrder(payloads);
      setCheckoutSuccess(true);
      clearCart();

      // Deduct points locally
      const remainingPoints = userPoints - totalPointsUsed;
      setUserPoints(remainingPoints);
      localStorage.setItem(
        "current_user",
        JSON.stringify({ ...currentUser, current_points: remainingPoints })
      );

      setTimeout(() => {
        navigate("/member");
      }, 2500);
    } catch (err) {
      setError(err.message || "Failed to process checkout.");
    } finally {
      setLoading(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-24 text-center bg-[#08090C] min-h-screen text-[#EDECE7] flex flex-col items-center justify-center space-y-6">
        <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
        <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-widest">Order Placed!</h2>
        <p className="text-sm text-[#8A8D96] max-w-md leading-relaxed">
          Your grouped checkout has been submitted to the admin queue. Redirecting you to your build pipeline dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 bg-[#08090C] min-h-screen text-[#EDECE7] relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#7C5CFC]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="border-b border-white/[0.07] pb-8 mb-10">
        <div className="flex justify-between items-end">
          <div>
            <Badge className="bg-[#7C5CFC]/10 text-[#C9C2FF] border-[#7C5CFC]/20 px-2.5 py-0.5 text-[9px] uppercase tracking-widest font-black mb-3">
              Grouping checkout
            </Badge>
            <h2 className="text-3xl font-black tracking-wider uppercase">Shopping Cart</h2>
            <p className="text-xs text-[#9A9DA6] mt-1.5">
              Review your customized PCs and Point Shop items before submitting.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
            <Coins className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[9px] text-[#A78BFA] uppercase tracking-widest font-bold">Your Balance</p>
              <p className="text-sm font-black text-white">{userPoints.toLocaleString()} PTS</p>
            </div>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#6B6E76]" />
          <p className="text-sm text-[#9A9DA6] font-medium">Your shopping cart is empty.</p>
          <Button
            onClick={() => navigate("/catalog")}
            className="bg-[#7C5CFC] hover:bg-[#6D4DEF] text-xs font-bold px-6 py-2.5 rounded-lg"
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => {
              const isPC = item.category === "Standard" || item.category === "Signature";
              const isPurePoints = item.allowCashPayment === false;
              const maxPoints = Math.min(
                userPoints,
                item.pointsPrice || Infinity,
                Math.floor(item.price / 1000)
              );

              return (
                <div
                  key={item.id}
                  className="bg-white/[0.01] border border-white/[0.05] hover:border-[#7C5CFC]/20 p-5 rounded-2xl transition-all duration-300 flex flex-col md:flex-row gap-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl border border-white/[0.06] shrink-0"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="text-base font-bold text-white uppercase tracking-wide leading-tight">{item.name}</h4>
                          <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1 block">
                            {item.category || "Item"} • {item.id}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#6B6E76] hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Controls & Discount Slider Row */}
                    <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pt-4 border-t border-white/[0.04]">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#6B6E76] uppercase tracking-wider mr-2">Qty</span>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => updateQty(item.id, Number(e.target.value))}
                          className="w-16 px-2.5 py-1.5 bg-white/[0.02] border border-white/[0.1] rounded-lg text-center text-xs font-bold outline-none focus:border-[#7C5CFC] text-white"
                        />
                      </div>

                      {/* Points Slider for Point Shop Hybrid Items */}
                      {!isPC && !isPurePoints && item.allowPointsPayment && (
                        <div className="flex-1 max-w-xs space-y-2">
                          <div className="flex justify-between text-[9px] uppercase tracking-wider font-bold">
                            <span className="text-[#9A9DA6]">Apply Point Discount (per unit)</span>
                            <span className="text-amber-400">{item.pointsToUse || 0} PTS</span>
                          </div>
                          {maxPoints > 0 ? (
                            <input
                              type="range"
                              min="0"
                              max={maxPoints}
                              value={item.pointsToUse || 0}
                              onChange={(e) => updatePointsToUse(item.id, Number(e.target.value))}
                              className="w-full h-1 bg-white/[0.08] accent-amber-400 rounded-lg cursor-pointer"
                            />
                          ) : (
                            <p className="text-[9px] text-[#6B6E76]">No points to apply</p>
                          )}
                        </div>
                      )}

                      {/* Display Pricing breakdown */}
                      <div className="text-right shrink-0">
                        {isPurePoints ? (
                          <p className="text-sm font-black text-amber-400">{item.pointsPrice * item.qty} PTS</p>
                        ) : (
                          <>
                            <p className="text-sm font-black text-[#D97757]">
                              {formatCurrency(Math.max(0, item.price - (item.pointsToUse || 0) * 1000) * item.qty)}
                            </p>
                            {item.pointsToUse > 0 && (
                              <p className="text-[9px] text-[#6B6E76] line-through">
                                {formatCurrency(item.price * item.qty)}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Invoice Box */}
          <div className="space-y-6">
            <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-2xl space-y-6 shadow-xl shadow-[#7C5CFC]/2">
              <h3 className="text-sm font-extrabold text-[#F4F3EF] uppercase tracking-wider border-b border-white/[0.06] pb-3">
                Order Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between text-[#9A9DA6]">
                  <span>Total Items:</span>
                  <span className="font-bold text-white">{cart.reduce((sum, i) => sum + i.qty, 0)} items</span>
                </div>
                <div className="flex justify-between text-[#9A9DA6]">
                  <span>Points Discount Applied:</span>
                  <span className="font-bold text-amber-400">{totalPointsUsed.toLocaleString()} PTS</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-white/[0.04] pt-4">
                  <span className="text-[#F4F3EF]">Cash Total:</span>
                  <span className="text-[#D97757] text-base font-black tabular-nums">{formatCurrency(totalCash)}</span>
                </div>
              </div>

              {pointsExceeded && (
                <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs leading-relaxed font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Your cart applies more points ({totalPointsUsed}) than your balance ({userPoints}). Please slide down discounts.</span>
                </div>
              )}

              <div className="flex gap-2 items-start text-[10px] text-[#6B6E76] bg-white/[0.01] p-3 rounded-lg border border-white/[0.03] leading-relaxed">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>PCs must be assembled and tested by our system builder. Loyalty points will be awarded immediately upon order confirmation.</span>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                onClick={handleCheckout}
                disabled={loading || pointsExceeded || cart.length === 0}
                className="w-full py-6 bg-[#7C5CFC] hover:bg-[#6D4DEF] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Checkout...
                  </>
                ) : (
                  <>
                    Checkout Order <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
