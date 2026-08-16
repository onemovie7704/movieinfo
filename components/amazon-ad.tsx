import Link from "next/link";

interface AmazonAdProps {
  title: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  price?: string;
  buttonText?: string;
}

export function AmazonAd({
  title,
  description,
  imageUrl,
  productUrl,
  price,
  buttonText = "Buy on Amazon",
}: AmazonAdProps) {
  return (
    <Link
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 my-8 w-full max-w-[1100px] mx-auto overflow-hidden cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative w-full sm:w-48 h-48 flex-shrink-0 bg-white/5 rounded-md overflow-hidden flex items-center justify-center p-2">
        <img
          src={imageUrl}
          alt={title}
          className="object-contain w-full h-full drop-shadow-md mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
          ⭐ Recommended For You
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Buy Button */}
        <span
          className="inline-block bg-[#FF9900] group-hover:bg-[#FF9900]/90 text-black font-bold py-2.5 px-6 rounded-lg transition-colors w-full sm:w-auto text-center shadow-lg group-hover:shadow-xl"
        >
          {buttonText}
        </span>
      </div>
    </Link>
  );
}
