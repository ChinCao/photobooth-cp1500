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
    imageSlot: number;
    modifers: {
      frame_scale_multiplier: number;
      image: {
        scale_multiplier: {
          height: number;
          width: number;
        };
        position: {
          x: number;
          y: number;
        };
      }[];
    };
  }>;
} = {
  prom: [
    {
      type: "singular",
      src: "/frame/prom/prom_1.png",
      thumbnail: "/frame/prom/thumbnail/prom_1.jpg",
      imageSlot: 2,
      modifers: {
        frame_scale_multiplier: 4,
        image: [
          {
            scale_multiplier: {
              height: 1.9,
              width: 1.8,
            },

            position: {
              y: 20,
              x: 38.8,
            },
          },
          {
            scale_multiplier: {
              height: 1.9,
              width: 1.8,
            },

            position: {
              y: 345,
              x: 38.8,
            },
          },
        ],
      },
    },
  ],
};

export const FrameDefaults: {
  [key in ValidTheme]: (typeof FrameOptions)[key][number];
} = {prom: FrameOptions.prom[0]};

export interface PhotoOptions<T extends ValidTheme> {
  theme: {
    name: T;
    frame: (typeof FrameOptions)[T][number];
  };
  quantity: number;
  images: Array<{
    id: string;
    data: string;
  }>;
  selectedImages: Array<{
    id: string;
    data: string;
  }>;
}

export const NUM_OF_IMAGE = 6;
