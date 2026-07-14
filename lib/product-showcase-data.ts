export type ShowcaseColor = {
  name: string;
  hex: string;
  /** talla (CH/M/G/XG) -> GID de variante real en Shopify */
  variantsBySize: Record<string, string>;
};

export type ShowcaseProduct = {
  title: string;
  price: number;
  /** GID de producto real en Shopify (línea Element, ACTIVE + publicado a Headless) */
  productId: string;
  handle: string;
  sizes: string[];
  colors: ShowcaseColor[];
};

export const ELEMENT_PRODUCTS: ShowcaseProduct[] = [
  {
    title: "Element Top",
    price: 629,
    productId: "gid://shopify/Product/10650025001252",
    handle: "element-top",
    sizes: ["CH", "M", "G", "XG"],
    colors: [
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734988898596",
          M: "gid://shopify/ProductVariant/55734988931364",
          G: "gid://shopify/ProductVariant/55734988964132",
          XG: "gid://shopify/ProductVariant/55734988996900",
        },
      },
      {
        name: "Cacto",
        hex: "#7a8a6a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989029668",
          M: "gid://shopify/ProductVariant/55734989062436",
          G: "gid://shopify/ProductVariant/55734989095204",
          XG: "gid://shopify/ProductVariant/55734989127972",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989160740",
          M: "gid://shopify/ProductVariant/55734989193508",
          G: "gid://shopify/ProductVariant/55734989226276",
          XG: "gid://shopify/ProductVariant/55734989259044",
        },
      },
    ],
  },
  {
    title: "Element Motion Top",
    price: 649,
    productId: "gid://shopify/Product/10650025034020",
    handle: "element-motion-top",
    sizes: ["CH", "M", "G"],
    colors: [
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989291812",
          M: "gid://shopify/ProductVariant/55734989324580",
          G: "gid://shopify/ProductVariant/55734989357348",
        },
      },
      {
        name: "Cacto",
        hex: "#7a8a6a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989390116",
          M: "gid://shopify/ProductVariant/55734989422884",
          G: "gid://shopify/ProductVariant/55734989455652",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989488420",
          M: "gid://shopify/ProductVariant/55734989521188",
          G: "gid://shopify/ProductVariant/55734989553956",
        },
      },
    ],
  },
  {
    title: "Element Force Soft",
    price: 579,
    productId: "gid://shopify/Product/10650025066788",
    handle: "element-force-soft",
    sizes: ["CH", "M", "G"],
    colors: [
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989586724",
          M: "gid://shopify/ProductVariant/55734989619492",
          G: "gid://shopify/ProductVariant/55734989652260",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989685028",
          M: "gid://shopify/ProductVariant/55734989717796",
          G: "gid://shopify/ProductVariant/55734989750564",
        },
      },
      {
        name: "Skylilac",
        hex: "#b9aed6",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989783332",
          M: "gid://shopify/ProductVariant/55734989816100",
          G: "gid://shopify/ProductVariant/55734989848868",
        },
      },
      {
        name: "Azzure",
        hex: "#4a6fa5",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989881636",
          M: "gid://shopify/ProductVariant/55734989914404",
          G: "gid://shopify/ProductVariant/55734989947172",
        },
      },
      {
        name: "Blanco",
        hex: "#f2f2ee",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734989979940",
          M: "gid://shopify/ProductVariant/55734990012708",
          G: "gid://shopify/ProductVariant/55734990045476",
        },
      },
    ],
  },
  {
    title: "Element Alpha Soft",
    price: 579,
    productId: "gid://shopify/Product/10650025099556",
    handle: "element-alpha-soft",
    sizes: ["CH", "M", "G", "XG"],
    colors: [
      {
        name: "Blanco",
        hex: "#f2f2ee",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990078244",
          M: "gid://shopify/ProductVariant/55734990111012",
          G: "gid://shopify/ProductVariant/55734990143780",
          XG: "gid://shopify/ProductVariant/55734990176548",
        },
      },
      {
        name: "Azzure",
        hex: "#4a6fa5",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990209316",
          M: "gid://shopify/ProductVariant/55734990242084",
          G: "gid://shopify/ProductVariant/55734990274852",
          XG: "gid://shopify/ProductVariant/55734990307620",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990340388",
          M: "gid://shopify/ProductVariant/55734990373156",
          G: "gid://shopify/ProductVariant/55734990405924",
          XG: "gid://shopify/ProductVariant/55734990438692",
        },
      },
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990471460",
          M: "gid://shopify/ProductVariant/55734990504228",
          G: "gid://shopify/ProductVariant/55734990536996",
          XG: "gid://shopify/ProductVariant/55734990569764",
        },
      },
      {
        name: "Skylilac",
        hex: "#b9aed6",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990602532",
          M: "gid://shopify/ProductVariant/55734990635300",
          G: "gid://shopify/ProductVariant/55734990668068",
          XG: "gid://shopify/ProductVariant/55734990700836",
        },
      },
    ],
  },
  {
    title: "Element Performance Jacket",
    price: 929,
    productId: "gid://shopify/Product/10650025132324",
    handle: "element-performance-jacket",
    sizes: ["CH", "M", "G"],
    colors: [
      {
        name: "Cacto",
        hex: "#7a8a6a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990733604",
          M: "gid://shopify/ProductVariant/55734990766372",
          G: "gid://shopify/ProductVariant/55734990799140",
        },
      },
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990831908",
          M: "gid://shopify/ProductVariant/55734990864676",
          G: "gid://shopify/ProductVariant/55734990897444",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734990930212",
          M: "gid://shopify/ProductVariant/55734990962980",
          G: "gid://shopify/ProductVariant/55734990995748",
        },
      },
    ],
  },
  {
    title: "Element Nova Falda",
    price: 669,
    productId: "gid://shopify/Product/10650025230628",
    handle: "element-nova-falda",
    sizes: ["CH", "M", "G"],
    colors: [
      {
        name: "Cacto",
        hex: "#7a8a6a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734991094052",
          M: "gid://shopify/ProductVariant/55734991126820",
          G: "gid://shopify/ProductVariant/55734991159588",
        },
      },
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734991192356",
          M: "gid://shopify/ProductVariant/55734991225124",
          G: "gid://shopify/ProductVariant/55734991257892",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734991290660",
          M: "gid://shopify/ProductVariant/55734991323428",
          G: "gid://shopify/ProductVariant/55734991356196",
        },
      },
    ],
  },
  {
    title: "Element Lume Biker",
    price: 649,
    productId: "gid://shopify/Product/10650025296164",
    handle: "element-lume-biker",
    sizes: ["CH", "M", "G"],
    colors: [
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734991421732",
          M: "gid://shopify/ProductVariant/55734991454500",
          G: "gid://shopify/ProductVariant/55734991487268",
        },
      },
      {
        name: "Cacto",
        hex: "#7a8a6a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734991520036",
          M: "gid://shopify/ProductVariant/55734991552804",
          G: "gid://shopify/ProductVariant/55734991585572",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734991618340",
          M: "gid://shopify/ProductVariant/55734991651108",
          G: "gid://shopify/ProductVariant/55734991683876",
        },
      },
    ],
  },
  {
    title: "Element Dynamic Legging",
    price: 729,
    productId: "gid://shopify/Product/10650025328932",
    handle: "element-dynamic-legging",
    sizes: ["CH", "M", "G", "XG"],
    colors: [
      {
        name: "Negro",
        hex: "#171717",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734994469156",
          M: "gid://shopify/ProductVariant/55734994501924",
          G: "gid://shopify/ProductVariant/55734994534692",
          XG: "gid://shopify/ProductVariant/55734994567460",
        },
      },
      {
        name: "Passion",
        hex: "#8f3b4a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734994600228",
          M: "gid://shopify/ProductVariant/55734994632996",
          G: "gid://shopify/ProductVariant/55734994665764",
          XG: "gid://shopify/ProductVariant/55734994698532",
        },
      },
      {
        name: "Cacto",
        hex: "#7a8a6a",
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/55734994731300",
          M: "gid://shopify/ProductVariant/55734994764068",
          G: "gid://shopify/ProductVariant/55734994796836",
          XG: "gid://shopify/ProductVariant/55734994829604",
        },
      },
    ],
  },
];
