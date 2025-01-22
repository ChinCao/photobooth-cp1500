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
    {
      type: "singular",
      src: "/frame/prom/prom_2.png",
      thumbnail: "/frame/prom/thumbnail/prom_2.jpg",
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
    {
      type: "singular",
      src: "/frame/prom/prom_3.png",
      thumbnail: "/frame/prom/thumbnail/prom_3.jpg",
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
    {
      type: "singular",
      src: "/frame/prom/prom_4.png",
      thumbnail: "/frame/prom/thumbnail/prom_4.jpg",
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
    {
      type: "singular",
      src: "/frame/prom/prom_5.png",
      thumbnail: "/frame/prom/thumbnail/prom_5.jpg",
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
    {
      type: "singular",
      src: "/frame/prom/prom_6.png",
      thumbnail: "/frame/prom/thumbnail/prom_6.jpg",
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

export const NUM_OF_IMAGE = 4;

export const FILTERS: {
  name: string;
  filter: string;
}[] = [
  {name: "1977", filter: "filter-1977"},
  {name: "Aden", filter: "filter-aden"},
  {name: "Amaro", filter: "filter-amaro"},
  {name: "Ashby", filter: "filter-ashby"},
  {name: "Brannan", filter: "filter-brannan"},
  {name: "Brooklyn", filter: "filter-brooklyn"},
  {name: "Charmes", filter: "filter-charmes"},
  {name: "Clarendon", filter: "filter-clarendon"},
  {name: "Crema", filter: "filter-crema"},
  {name: "Dogpatch", filter: "filter-dogpatch"},
  {name: "Earlybird", filter: "filter-earlybird"},
  {name: "Gingham", filter: "filter-gingham"},
  {name: "Ginza", filter: "filter-ginza"},
  {name: "Hefe", filter: "filter-hefe"},
  {name: "Helena", filter: "filter-helena"},
  {name: "Hudson", filter: "filter-hudson"},
  {name: "Inkwell", filter: "filter-inkwell"},
  {name: "Kelvin", filter: "filter-kelvin"},
  {name: "Juno", filter: "filter-juno"},
  {name: "Lark", filter: "filter-lark"},
  {name: "Lo-Fi", filter: "filter-lofi"},
  {name: "Ludwig", filter: "filter-ludwig"},
  {name: "Maven", filter: "filter-maven"},
  {name: "Mayfair", filter: "filter-mayfair"},
  {name: "Moon", filter: "filter-moon"},
  {name: "Nashville", filter: "filter-nashville"},
  {name: "Perpetua", filter: "filter-perpetua"},
  {name: "Poprocket", filter: "filter-poprocket"},
  {name: "Reyes", filter: "filter-reyes"},
  {name: "Rise", filter: "filter-rise"},
  {name: "Sierra", filter: "filter-sierra"},
  {name: "Skyline", filter: "filter-skyline"},
  {name: "Slumber", filter: "filter-slumber"},
  {name: "Stinson", filter: "filter-stinson"},
  {name: "Sutro", filter: "filter-sutro"},
  {name: "Toaster", filter: "filter-toaster"},
  {name: "Valencia", filter: "filter-valencia"},
  {name: "Vesper", filter: "filter-vesper"},
  {name: "Walden", filter: "filter-walden"},
  {name: "Willow", filter: "filter-willow"},
  {name: "X-Pro II", filter: "filter-xpro-ii"},
];
