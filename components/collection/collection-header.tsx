import clsx from "clsx";
import Link from "next/link";

export type CollectionTab = { label: string; path: string };

export default function CollectionHeader({
  title,
  tabs,
  activePath,
}: {
  title: string;
  tabs?: CollectionTab[];
  activePath: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold tracking-[0.16em] text-neutral-500 uppercase">
        Comprar
      </p>
      <h1 className="mt-2 text-5xl font-bold tracking-tight text-black lg:text-6xl">
        {title}
      </h1>

      {tabs && tabs.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.path === activePath;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                prefetch={true}
                className={clsx(
                  "rounded-full px-4 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border border-neutral-300 font-medium text-black"
                    : "text-neutral-500 hover:text-black",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
