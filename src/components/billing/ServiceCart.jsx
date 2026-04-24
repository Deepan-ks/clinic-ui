// ── SERVICE CART COMPONENT ─────────────────────────────────────

import { XIcon, ReceiptIcon } from "../icons";
import { fmt } from "../../utils/formatters";

export function ServiceCart({
  cart,
  onCartChange,
  selectedSpec,
  servicesList,
  addToCart,
  setQty,
}) {
  const hasServices = servicesList.length > 0;
  const hasItems = cart.length > 0;

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${
        hasItems ? "border-emerald-200" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            hasItems ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          {hasItems && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <h3
          className={`text-sm font-bold tracking-tight ${
            hasItems ? "text-emerald-700" : "text-gray-700"
          }`}
        >
          3 Services
        </h3>
      </div>

      <div className="px-6 py-5 space-y-3">
        {/* Service Buttons */}
        {hasServices ? (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Click to add
            </p>
            <div className="flex flex-wrap gap-2">
              {servicesList.map((s) => {
                const inCart = cart.find((item) => item.id === s.serviceId);
                return (
                  <button
                    key={s.serviceId}
                    onClick={() => addToCart(s)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                      inCart
                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                        : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <span>{s.serviceName}</span>
                    <span
                      className={`text-xs ${inCart ? "text-blue-200" : "text-gray-400"}`}
                    >
                      ₹{s.price}
                    </span>
                    {inCart && (
                      <span className="ml-0.5 bg-white/25 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {inCart.qty}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : selectedSpec ? (
          <p className="text-sm text-gray-400">
            No services for this department.
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            Select a department to see services.
          </p>
        )}

        {/* Cart Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <span className="col-span-5">Service</span>
            <span className="col-span-2 text-right">Rate</span>
            <span className="col-span-3 text-center">Qty</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400 bg-white">
              <ReceiptIcon />
              <p className="text-sm font-medium mt-3 text-gray-400">
                No services added
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Add from the buttons above
              </p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 px-5 py-2.5 border-b border-gray-100 last:border-0 items-center group bg-white hover:bg-gray-50 transition-colors"
                >
                  <p className="col-span-5 text-sm font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="col-span-2 text-right text-sm text-gray-400">
                    ₹{item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="col-span-3 flex items-center justify-center gap-2.5">
                    <button
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 flex items-center justify-center font-bold text-sm transition-all"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-gray-900 w-4 text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 text-gray-600 flex items-center justify-center font-bold text-sm transition-all"
                    >
                      +
                    </button>
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setQty(item.id, 0)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                    >
                      <XIcon />
                    </button>
                  </div>
                </div>
              ))}

              {/* Subtotal Row */}
              <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 border-t border-gray-200">
                <span className="col-span-10 text-sm font-bold text-gray-600 text-right pr-4">
                  Subtotal
                </span>
                <span className="col-span-2 text-right text-sm font-bold text-gray-900">
                  {fmt(cart.reduce((s, x) => s + x.price * x.qty, 0))}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
