import { getMenu } from "lib/shopify";
import NavbarShell from "./navbar-shell";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return <NavbarShell siteName={SITE_NAME!} menu={menu} />;
}
