import ProductCard from "./ProductCard";

export default function CategorySection({ category, onAddToCart }) {
    const itemCount = category.items.length;

    return (
        <section className=" ">
            {/* Category Header */}
            <div className="px-4 py-3.5 flex justify-between items-center border-[#E7E5E4] border-b">
                <h2 className="text-[#1C1917] font-[500] text-xl leading-8">
                    {category.name}
                </h2>
                <span className="text-[#A6A09B] text-base tracking-[1.6px] leading-8">
                    {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
                </span>
            </div>

            {/* Products List */}
            <div className="px-4 pt-5">
                {category.items.map((item) => (
                    <ProductCard
                        key={item.id}
                        product={item}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>
        </section>
    );
}
