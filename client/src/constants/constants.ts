export type ValidTheme = "prom" | "usagyuun" | "squid" | "bear" | "powerpuff" | "otonya" | "zookiz";

export const ThemeSelectButton: {
  title: string;
  image_src: string;
  theme: ValidTheme;
  style?: {[key: string]: string};
}[] = [
  {
    title: "PROM",
    image_src: "/prom.jpg",
    theme: "prom",
  },
  {
    title: "Usagyuuun",
    image_src: "/rabbit.jpg",
    theme: "usagyuun",
  },
  {
    title: "Squid game",
    image_src: "/squid.jpg",
    theme: "squid",
  },
  {
    title: "Powerpuff girls",
    image_src: "/powerpuff.webp",
    theme: "powerpuff",
    style: {objectPosition: "0% -100px"},
  },
  {
    title: "We bare bears",
    image_src: "/bear.jpg",
    theme: "bear",
  },
  {
    title: "Otonya",
    image_src: "/otonya.jpg",
    theme: "otonya",
  },
  {
    title: "Zookiz",
    image_src: "/zookiz.png",
    theme: "zookiz",
  },
];

export const FrameOptions: {
  [key in ValidTheme]: Array<{
    type: "singular" | "double";
    src: `/frame/${key}/${key}_${number}.png`;
    thumbnail?: `/frame/${key}/thumbnail/${key}_${number}.${string}`;
  }>;
} = {
  prom: [
    {type: "singular", src: "/frame/prom/prom_1.png", thumbnail: "/frame/prom/thumbnail/prom_1.jpg"},
    {type: "singular", src: "/frame/prom/prom_2.png", thumbnail: "/frame/prom/thumbnail/prom_2.jpg"},
  ],

  usagyuun: [{type: "double", src: "/frame/usagyuun/usagyuun_1.png"}],
};

export const FrameDefaults: {
  [key in ValidTheme]: (typeof FrameOptions)[key][number];
} = {prom: FrameOptions.prom[0], usagyuun: FrameOptions.usagyuun[0]};

export interface PhotoOptions<T extends ValidTheme> {
  theme: {
    name: T;
    frame: (typeof FrameOptions)[T][number];
  };
  quantity: number;
  images: string[] | undefined;
}
