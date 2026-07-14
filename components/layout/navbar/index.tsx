import { getMenu } from "lib/shopify";
import Link from "next/link";
import NavMain from "./nav-main";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-[#b48b8c]">
        <div className="mx-auto flex h-9 max-w-screen-2xl items-center justify-end gap-6 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-white lg:px-8">
          <Link href="/soporte" prefetch={true} className="hover:opacity-80">
            Ayuda
          </Link>
          <Link href="/cuenta" prefetch={true} className="hover:opacity-80">
            Mi cuenta
          </Link>
        </div>
      </div>

      <NavMain siteName={SITE_NAME!} menu={menu} />
    </div>
  );
}
