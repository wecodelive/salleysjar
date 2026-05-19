"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import CartIndicator from "@/components/CartIndicator";
import CartPage from "@/components/CartPage";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import CategorySection from "@/components/CategorySection";
import { menuItems } from "@/data/menuItems";
import { useState } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
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
      <div className="px-4 py-3 flex overflow-x-auto gap-2 border-[#E7E5E4] border-b scrollbar-hide">
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
      <div className="px-4 py-8 flex flex-col gap-3 border-[#E7E5E4] border-b">
        <h3 className="text-[#79716B] leading-6 tracking-[4.8px]">
          HALL WEEK • PRE-ORDER
        </h3>

        <p className="text-[#1C1917] font-[500] text-2xl leading-9">
          Small chops, made fresh. Delivered or picked up.
        </p>

        <p className="text-[#79716B] leading-6">
          A short, honest menu of the things we love to make. Order ahead — we'll
          have it ready.
        </p>
      </div>

      {/* Info Section */}
      <div className="flex flex-col px-4 border-[#E7E5E4] border-b">
        <div className="flex items-center gap-2 border-[#E7E5E4] border-b py-2">
          <Clock className="h-4 text-[#44403B]" />
          <div>
            <p className="text-[#1C1917] leading-6">Order by 4pm</p>
            <p className="text-[#79716B] leading-6">Same-day delivery</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-[#E7E5E4] border-b py-2">
          <MapPin className="h-4 text-[#44403B]" />
          <div>
            <p className="text-[#1C1917] leading-6">₦2,000 min order</p>
            <p className="text-[#79716B] leading-6">Delivering across campus halls</p>
          </div>
        </div>

        <div className="flex items-center gap-2 py-2">
          <MessageCircle className="h-4 text-[#44403B]" />
          <div>
            <p className="text-[#1C1917] leading-6">Questions?</p>
            <p className="text-[#79716B] leading-6">WhatsApp +234 810 685 8963</p>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="py-10 flex flex-col gap-10">
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
        onOrderConfirmed={() => {
          setCart([]);
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

