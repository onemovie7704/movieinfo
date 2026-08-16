import Link from "next/link";

export interface AmazonProduct {
  id: string;
  title: string;
  imageUrl: string;
  productUrl: string;
  price?: string;
  buttonText?: string;
}

interface AmazonProductGridProps {
  title?: string;
  products: AmazonProduct[];
}

export function AmazonProductGrid({
  title = "⭐ Recommended For You",
  products,
}: AmazonProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="py-6 w-full max-w-[1400px] mx-auto">
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 px-1">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-4">
        {products.map((product, index) => (
          <Link
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            key={product.id}
            className={`bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group flex-col cursor-pointer ${index >= 4 ? "hidden md:flex" : "flex"}`}
          >
            <div className="relative aspect-square bg-white p-2 flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-2 flex flex-col flex-1 text-center">
              <h3 className="font-semibold text-foreground text-[10px] sm:text-xs leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <div className="mt-auto">
                <span
                  className="block w-full bg-[#FF9900] group-hover:bg-[#FF9900]/90 text-black text-center text-[10px] font-bold py-1 px-1 rounded transition-colors shadow-sm group-hover:shadow-md"
                >
                  {product.buttonText || "Buy on Amazon"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}