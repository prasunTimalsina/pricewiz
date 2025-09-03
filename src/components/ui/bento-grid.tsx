import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  icon,
  image,
  href,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  image?: string;
  href: string;
}) => {
  return (
    <a
      target="_blank"
      href={href}
      className={cn(
        "group/bento relative overflow-hidden shadow-input row-span-1 flex flex-col justify-end rounded-xl border border-neutral-200 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:shadow-none",
        image ? "" : "bg-white dark:bg-black",
        className,
      )}
    >
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

      <div className="relative z-20 p-4 transition duration-200 group-hover/bento:translate-x-2">
        {icon && <div className="mb-2">{icon}</div>}
        {title && (
          <div className="font-sans font-bold text-lg text-white mb-1">
            {title}
          </div>
        )}
        {description && (
          <div className="font-sans text-sm font-normal text-white">
            {description}
          </div>
        )}
      </div>
    </a>
  );
};

