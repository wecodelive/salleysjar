import ProductCard from "./ProductCard";

export default function CategorySection({ category, onAddToCart }) {
    const itemCount = category.items.length;

    return (
        <section className="">
            {/* Category Header */}
            <div className="px-4 md:px-8 lg:px-12 py-3.5 md:py-4 flex justify-between items-center border-[#E7E5E4] border-b">
                <h2 className="text-[#1C1917] font-medium text-lg md:text-xl lg:text-2xl leading-8">
                    {category.name}
                </h2>
                <span className="text-[#A6A09B] text-xs md:text-sm tracking-[1.6px] leading-8">
                    {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
                </span>
            </div>

            {/* Products Grid */}
            <div className="px-4 md:px-8 lg:px-12 pt-5 md:pt-6 pb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {category.items.map((item) => (
                        <ProductCard
                            key={item.id}
                            product={item}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
