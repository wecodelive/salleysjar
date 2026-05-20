"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CartIndicator from "@/components/CartIndicator";
import CartPage from "@/components/CartPage";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import CategorySection from "@/components/CategorySection";
import { menuItems } from "@/data/menuItems";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { cart, isLoading, addToCart, clearCart, removeFromCart, updateQuantity } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const cartTotal = cart.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (itemPrice * quantity);
  }, 0);

  const filteredCategories =
    selectedCategory === "all"
      ? menuItems.categories
      : menuItems.categories.filter((cat) => cat.id === selectedCategory);

  return (
    <div className="">
      <Header
        cartCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Category Filter Tabs */}
      <div className="px-4 md:px-8 lg:px-12 py-3 flex overflow-x-auto gap-2 md:gap-3 border-[#E7E5E4] border-b scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-[13px] py-[11px] h-fit w-fit border rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === "all"
            ? "bg-[#1C1917] text-white border-[#1C1917]"
            : "border-[#D6D3D1] text-[#1C1917] hover:border-[#1C1917]"
            }`}
        >
          ALL
        </button>
        {menuItems.categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-[13px] py-[11px] h-fit w-fit border rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
              ? "bg-[#1C1917] text-white border-[#1C1917]"
              : "border-[#D6D3D1] text-[#1C1917] hover:border-[#1C1917]"
              }`}
          >
            {category.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <div className="px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-3 md:gap-4 border-[#E7E5E4] border-b">
        <h3 className="text-[#79716B] leading-6 tracking-[4.8px] text-sm">
          NOW RUNINNING HALL WEEK 2026 SPECIALS AT MAKAMA HALL
        </h3>

        <p className="text-[#1C1917] font-medium text-2xl md:text-3xl lg:text-4xl leading-9 md:leading-12 max-w-3xl">
          Small chops, made fresh. Delivered or picked up.
        </p>

        <p className="text-[#79716B] leading-6 max-w-2xl text-sm md:text-base">
          A short, honest menu of the things we love to make. Order ahead — we'll
          have it ready.
        </p>
      </div>

      {/* Info Section */}
      <div className="px-4 md:px-8 lg:px-12 py-6 md:py-8 border-[#E7E5E4] border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Info Box 1 */}
          <div className="flex items-start gap-3 md:gap-4">
            <Clock className="h-5 md:h-6 text-[#44403B] flex-shrink-0 mt-1" />
            <div>
              <p className="text-[#1C1917] font-medium leading-6 text-sm md:text-base">Order before 6pm</p>
              <p className="text-[#79716B] leading-6 text-sm">For same-day delivery</p>
            </div>
          </div>

          {/* Info Box 2 */}
          <div className="flex items-start gap-3 md:gap-4">
            <MapPin className="h-5 md:h-6 text-[#44403B] flex-shrink-0 mt-1" />
            <div>
              <p className="text-[#1C1917] font-medium leading-6 text-sm md:text-base">₦1,000 min order</p>
              <p className="text-[#79716B] leading-6 text-sm">Delivering across campus halls</p>
            </div>
          </div>

          {/* Info Box 3 */}
          <div className="flex items-start gap-3 md:gap-4">
            <MessageCircle className="h-5 md:h-6 text-[#44403B] flex-shrink-0 mt-1" />
            <div>
              <p className="text-[#1C1917] font-medium leading-6 text-sm md:text-base">Questions?</p>
              <p className="text-[#79716B] leading-6 text-sm">WhatsApp +234 810 685 8963</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="px-4 md:px-8 lg:px-12 py-10 md:py-16 flex flex-col gap-10 md:gap-14">
        {filteredCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Footer */}
      <Footer />

      {/* Cart Indicator */}
      <CartIndicator
        items={cart}
        total={cartTotal}
        onOpen={() => setIsCartOpen(true)}
      />

      {/* Cart Page */}
      <CartPage
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onOrderConfirmed={() => {
          clearCart();
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}


{/* <Image
  className="dark:invert"
  src="/next.svg"
  alt="Next.js logo"
  width={100}
  height={20}
  priority
/> */}

{/* <Image
  className="dark:invert"
  src="/vercel.svg"
  alt="Vercel logomark"
  width={16}
  height={16}
/> */}

