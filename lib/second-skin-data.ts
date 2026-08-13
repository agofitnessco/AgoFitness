export type SecondSkinColor = {
  name: string;
  hex: string;
  /** foto plano de producto (todas las variantes de color la tienen) */
  image: string;
  /** foto con modelo — solo el primer color de cada producto la tiene */
  modelImage?: string;
  /** talla (CH/M/L/XL) -> GID de variante real en Shopify */
  variantsBySize: Record<string, string>;
};

export type SecondSkinProduct = {
  title: string;
  price: number;
  /** GID de producto real en Shopify (vendor "Second Skin", ACTIVE + publicado a Headless) */
  productId: string;
  handle: string;
  sizes: string[];
  colors: SecondSkinColor[];
};

const IMG = "/imgs/products/second-skin";

export const SECOND_SKIN_PRODUCTS: SecondSkinProduct[] = [
  {
    title: "Top Diamond Cross",
    price: 849,
    productId: "gid://shopify/Product/10765733265700",
    handle: "top-diamond-cross",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Cielo",
        hex: "#cfe0ee",
        image: `${IMG}/top-diamond-cross/1.jpg`,
        modelImage: `${IMG}/top-diamond-cross/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016043573540",
          M: "gid://shopify/ProductVariant/56016043606308",
          L: "gid://shopify/ProductVariant/56016043639076",
        },
      },
      {
        name: "Arena",
        hex: "#ede0d0",
        image: `${IMG}/top-diamond-cross/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016043671844",
          M: "gid://shopify/ProductVariant/56016043704612",
          L: "gid://shopify/ProductVariant/56016043737380",
        },
      },
      {
        name: "Blanco",
        hex: "#ffffff",
        image: `${IMG}/top-diamond-cross/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016043770148",
          M: "gid://shopify/ProductVariant/56016043802916",
          L: "gid://shopify/ProductVariant/56016043835684",
        },
      },
      {
        name: "Grafito",
        hex: "#3a3a42",
        image: `${IMG}/top-diamond-cross/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016043868452",
          M: "gid://shopify/ProductVariant/56016043901220",
          L: "gid://shopify/ProductVariant/56016043933988",
        },
      },
      {
        name: "Terracota",
        hex: "#c07356",
        image: `${IMG}/top-diamond-cross/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016043966756",
          M: "gid://shopify/ProductVariant/56016043999524",
          L: "gid://shopify/ProductVariant/56016044032292",
        },
      },
      {
        name: "Salvia",
        hex: "#a8bdac",
        image: `${IMG}/top-diamond-cross/7.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016044065060",
          M: "gid://shopify/ProductVariant/56016044097828",
          L: "gid://shopify/ProductVariant/56016044130596",
        },
      },
    ],
  },
  {
    title: "Legging Noire",
    price: 1039,
    productId: "gid://shopify/Product/10765733298468",
    handle: "legging-noire",
    sizes: ["CH", "M", "L", "XL"],
    colors: [
      {
        name: "Cielo",
        hex: "#cfe0ee",
        image: `${IMG}/legging-noire/1.jpg`,
        modelImage: `${IMG}/legging-noire/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016044163364",
          M: "gid://shopify/ProductVariant/56016044196132",
          L: "gid://shopify/ProductVariant/56016044228900",
          XL: "gid://shopify/ProductVariant/56016044261668",
        },
      },
      {
        name: "Grafito",
        hex: "#2e2b33",
        image: `${IMG}/legging-noire/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016044294436",
          M: "gid://shopify/ProductVariant/56016044327204",
          L: "gid://shopify/ProductVariant/56016044359972",
          XL: "gid://shopify/ProductVariant/56016044392740",
        },
      },
      {
        name: "Salvia",
        hex: "#a8bdac",
        image: `${IMG}/legging-noire/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016044425508",
          M: "gid://shopify/ProductVariant/56016044458276",
          L: "gid://shopify/ProductVariant/56016044491044",
          XL: "gid://shopify/ProductVariant/56016044523812",
        },
      },
      {
        name: "Arena",
        hex: "#ede0d0",
        image: `${IMG}/legging-noire/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016044556580",
          M: "gid://shopify/ProductVariant/56016044589348",
          L: "gid://shopify/ProductVariant/56016044622116",
          XL: "gid://shopify/ProductVariant/56016044654884",
        },
      },
      {
        name: "Terracota",
        hex: "#c17b57",
        image: `${IMG}/legging-noire/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016044687652",
          M: "gid://shopify/ProductVariant/56016044720420",
          L: "gid://shopify/ProductVariant/56016044753188",
          XL: "gid://shopify/ProductVariant/56016044785956",
        },
      },
      {
        name: "Blanco",
        hex: "#ffffff",
        image: `${IMG}/legging-noire/7.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016044818724",
          M: "gid://shopify/ProductVariant/56016044851492",
          L: "gid://shopify/ProductVariant/56016044884260",
          XL: "gid://shopify/ProductVariant/56016044917028",
        },
      },
    ],
  },
  {
    title: "Falda Active Luxe",
    price: 1009,
    productId: "gid://shopify/Product/10765733364004",
    handle: "falda-active-luxe",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Salvia",
        hex: "#8ea690",
        image: `${IMG}/falda-active-luxe/1.jpg`,
        modelImage: `${IMG}/falda-active-luxe/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016045048100",
          M: "gid://shopify/ProductVariant/56016045080868",
          L: "gid://shopify/ProductVariant/56016045113636",
        },
      },
      {
        name: "Negro",
        hex: "#1c1c1e",
        image: `${IMG}/falda-active-luxe/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016045146404",
          M: "gid://shopify/ProductVariant/56016045179172",
          L: "gid://shopify/ProductVariant/56016045211940",
        },
      },
      {
        name: "Terracota",
        hex: "#c17b57",
        image: `${IMG}/falda-active-luxe/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016045244708",
          M: "gid://shopify/ProductVariant/56016045277476",
          L: "gid://shopify/ProductVariant/56016045310244",
        },
      },
      {
        name: "Arena",
        hex: "#ede0d5",
        image: `${IMG}/falda-active-luxe/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016045343012",
          M: "gid://shopify/ProductVariant/56016045375780",
          L: "gid://shopify/ProductVariant/56016045408548",
        },
      },
      {
        name: "Cielo",
        hex: "#b8d3ea",
        image: `${IMG}/falda-active-luxe/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016045441316",
          M: "gid://shopify/ProductVariant/56016045474084",
          L: "gid://shopify/ProductVariant/56016045506852",
        },
      },
      {
        name: "Blanco",
        hex: "#ffffff",
        image: `${IMG}/falda-active-luxe/7.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016045539620",
          M: "gid://shopify/ProductVariant/56016045572388",
          L: "gid://shopify/ProductVariant/56016045605156",
        },
      },
    ],
  },
  {
    title: "Biker Cova",
    price: 919,
    productId: "gid://shopify/Product/10765733429540",
    handle: "biker-cova",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Salvia",
        hex: "#8ea690",
        image: `${IMG}/biker-cova/1.jpg`,
        modelImage: `${IMG}/biker-cova/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016047309092",
          M: "gid://shopify/ProductVariant/56016047341860",
          L: "gid://shopify/ProductVariant/56016047374628",
        },
      },
      {
        name: "Terracota",
        hex: "#c1704f",
        image: `${IMG}/biker-cova/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016047407396",
          M: "gid://shopify/ProductVariant/56016047440164",
          L: "gid://shopify/ProductVariant/56016047472932",
        },
      },
      {
        name: "Ciruela",
        hex: "#423d47",
        image: `${IMG}/biker-cova/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016047505700",
          M: "gid://shopify/ProductVariant/56016047538468",
          L: "gid://shopify/ProductVariant/56016047571236",
        },
      },
      {
        name: "Cielo",
        hex: "#b8d3ea",
        image: `${IMG}/biker-cova/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016047604004",
          M: "gid://shopify/ProductVariant/56016047636772",
          L: "gid://shopify/ProductVariant/56016047669540",
        },
      },
      {
        name: "Arena",
        hex: "#ede0d0",
        image: `${IMG}/biker-cova/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016047702308",
          M: "gid://shopify/ProductVariant/56016047735076",
          L: "gid://shopify/ProductVariant/56016047767844",
        },
      },
      {
        name: "Blanco",
        hex: "#ffffff",
        image: `${IMG}/biker-cova/7.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016047800612",
          M: "gid://shopify/ProductVariant/56016047833380",
          L: "gid://shopify/ProductVariant/56016047866148",
        },
      },
    ],
  },
  {
    title: "Jacket Elan",
    price: 1479,
    productId: "gid://shopify/Product/10765733495076",
    handle: "jacket-elan",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Salvia",
        hex: "#9db69f",
        image: `${IMG}/jacket-elan/1.jpg`,
        modelImage: `${IMG}/jacket-elan/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016047931684",
          M: "gid://shopify/ProductVariant/56016047964452",
          L: "gid://shopify/ProductVariant/56016047997220",
        },
      },
      {
        name: "Grafito",
        hex: "#38363d",
        image: `${IMG}/jacket-elan/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048029988",
          M: "gid://shopify/ProductVariant/56016048062756",
          L: "gid://shopify/ProductVariant/56016048095524",
        },
      },
      {
        name: "Terracota",
        hex: "#c17a52",
        image: `${IMG}/jacket-elan/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048128292",
          M: "gid://shopify/ProductVariant/56016048161060",
          L: "gid://shopify/ProductVariant/56016048193828",
        },
      },
      {
        name: "Arena",
        hex: "#e8dcc8",
        image: `${IMG}/jacket-elan/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048226596",
          M: "gid://shopify/ProductVariant/56016048259364",
          L: "gid://shopify/ProductVariant/56016048292132",
        },
      },
      {
        name: "Cielo",
        hex: "#bcdaf0",
        image: `${IMG}/jacket-elan/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048324900",
          M: "gid://shopify/ProductVariant/56016048357668",
          L: "gid://shopify/ProductVariant/56016048390436",
        },
      },
      {
        name: "Blanco",
        hex: "#ffffff",
        image: `${IMG}/jacket-elan/7.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048423204",
          M: "gid://shopify/ProductVariant/56016048455972",
          L: "gid://shopify/ProductVariant/56016048488740",
        },
      },
    ],
  },
  {
    title: "Top Atria",
    price: 669,
    productId: "gid://shopify/Product/10765733527844",
    handle: "top-atria",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Terracota",
        hex: "#d08462",
        image: `${IMG}/top-atria/1.jpg`,
        modelImage: `${IMG}/top-atria/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048521508",
          M: "gid://shopify/ProductVariant/56016048554276",
          L: "gid://shopify/ProductVariant/56016048587044",
        },
      },
      {
        name: "Blush",
        hex: "#f1dcd8",
        image: `${IMG}/top-atria/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048619812",
          M: "gid://shopify/ProductVariant/56016048652580",
          L: "gid://shopify/ProductVariant/56016048685348",
        },
      },
      {
        name: "Salvia",
        hex: "#a9c2ac",
        image: `${IMG}/top-atria/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048718116",
          M: "gid://shopify/ProductVariant/56016048750884",
          L: "gid://shopify/ProductVariant/56016048783652",
        },
      },
      {
        name: "Bruma",
        hex: "#dfe4f2",
        image: `${IMG}/top-atria/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048816420",
          M: "gid://shopify/ProductVariant/56016048849188",
          L: "gid://shopify/ProductVariant/56016048881956",
        },
      },
      {
        name: "Grafito",
        hex: "#45434a",
        image: `${IMG}/top-atria/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016048914724",
          M: "gid://shopify/ProductVariant/56016048947492",
          L: "gid://shopify/ProductVariant/56016048980260",
        },
      },
      {
        name: "Arena",
        hex: "#e8d9bd",
        image: `${IMG}/top-atria/7.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049013028",
          M: "gid://shopify/ProductVariant/56016049045796",
          L: "gid://shopify/ProductVariant/56016049078564",
        },
      },
    ],
  },
  {
    title: "Playera Apex Tee",
    price: 999,
    productId: "gid://shopify/Product/10765733593380",
    handle: "playera-apex-tee",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Cielo",
        hex: "#c3dbee",
        image: `${IMG}/playera-apex-tee/1.jpg`,
        modelImage: `${IMG}/playera-apex-tee/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049242404",
          M: "gid://shopify/ProductVariant/56016049275172",
          L: "gid://shopify/ProductVariant/56016049307940",
        },
      },
      {
        name: "Marino",
        hex: "#1c2438",
        image: `${IMG}/playera-apex-tee/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049340708",
          M: "gid://shopify/ProductVariant/56016049373476",
          L: "gid://shopify/ProductVariant/56016049406244",
        },
      },
      {
        name: "Plomo",
        hex: "#6c7178",
        image: `${IMG}/playera-apex-tee/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049439012",
          M: "gid://shopify/ProductVariant/56016049471780",
          L: "gid://shopify/ProductVariant/56016049504548",
        },
      },
      {
        name: "Terracota",
        hex: "#b5502e",
        image: `${IMG}/playera-apex-tee/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049537316",
          M: "gid://shopify/ProductVariant/56016049570084",
          L: "gid://shopify/ProductVariant/56016049602852",
        },
      },
      {
        name: "Blanco",
        hex: "#ffffff",
        image: `${IMG}/playera-apex-tee/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049635620",
          M: "gid://shopify/ProductVariant/56016049668388",
          L: "gid://shopify/ProductVariant/56016049701156",
        },
      },
    ],
  },
  {
    title: "Playera Atlas",
    price: 999,
    productId: "gid://shopify/Product/10765733626148",
    handle: "playera-atlas",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Marino",
        hex: "#33394a",
        image: `${IMG}/playera-atlas/1.jpg`,
        modelImage: `${IMG}/playera-atlas/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049733924",
          M: "gid://shopify/ProductVariant/56016049766692",
          L: "gid://shopify/ProductVariant/56016049799460",
        },
      },
      {
        name: "Plomo",
        hex: "#74767e",
        image: `${IMG}/playera-atlas/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049832228",
          M: "gid://shopify/ProductVariant/56016049864996",
          L: "gid://shopify/ProductVariant/56016049897764",
        },
      },
      {
        name: "Cielo",
        hex: "#bcd6ec",
        image: `${IMG}/playera-atlas/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016049930532",
          M: "gid://shopify/ProductVariant/56016049963300",
          L: "gid://shopify/ProductVariant/56016049996068",
        },
      },
      {
        name: "Terracota",
        hex: "#b5613a",
        image: `${IMG}/playera-atlas/5.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016050028836",
          M: "gid://shopify/ProductVariant/56016050061604",
          L: "gid://shopify/ProductVariant/56016050094372",
        },
      },
      {
        name: "Blanco",
        hex: "#ffffff",
        image: `${IMG}/playera-atlas/6.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016050127140",
          M: "gid://shopify/ProductVariant/56016050159908",
          L: "gid://shopify/ProductVariant/56016050192676",
        },
      },
    ],
  },
  {
    title: "Short Licra Range",
    price: 1199,
    productId: "gid://shopify/Product/10765733658916",
    handle: "short-licra-range",
    sizes: ["CH", "M", "L"],
    colors: [
      {
        name: "Marino",
        hex: "#1b2843",
        image: `${IMG}/short-licra-range/1.jpg`,
        modelImage: `${IMG}/short-licra-range/2.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016050225444",
          M: "gid://shopify/ProductVariant/56016050258212",
          L: "gid://shopify/ProductVariant/56016050290980",
        },
      },
      {
        name: "Negro",
        hex: "#17171a",
        image: `${IMG}/short-licra-range/3.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016050323748",
          M: "gid://shopify/ProductVariant/56016050356516",
          L: "gid://shopify/ProductVariant/56016050389284",
        },
      },
      {
        name: "Grafito",
        hex: "#3f3c40",
        image: `${IMG}/short-licra-range/4.jpg`,
        variantsBySize: {
          CH: "gid://shopify/ProductVariant/56016050422052",
          M: "gid://shopify/ProductVariant/56016050454820",
          L: "gid://shopify/ProductVariant/56016050487588",
        },
      },
    ],
  },
];
