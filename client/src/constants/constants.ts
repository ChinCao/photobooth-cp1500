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
    slotDimensions: {
      width: number;
      height: number;
    };
    slotPositions: {
      x: number;
      y: number;
    }[];
  }>;
} = {
  prom: [
    {
      type: "singular",
      src: "/frame/prom/prom_1.png",
      thumbnail: "/frame/prom/thumbnail/prom_1.jpg",
      imageSlot: 2,
      slotDimensions: {
        height: 300,
        width: 500,
      },
      slotPositions: [
        {
          y: 20,
          x: 38.8,
        },

        {
          y: 345,
          x: 38.8,
        },
      ],
    },
    {
      type: "singular",
      src: "/frame/prom/prom_2.png",
      thumbnail: "/frame/prom/thumbnail/prom_2.jpg",
      imageSlot: 2,
      slotDimensions: {
        height: 300,
        width: 500,
      },
      slotPositions: [
        {
          y: 20,
          x: 38.8,
        },

        {
          y: 345,
          x: 38.8,
        },
      ],
    },
    {
      type: "singular",
      src: "/frame/prom/prom_3.png",
      thumbnail: "/frame/prom/thumbnail/prom_3.jpg",
      imageSlot: 2,
      slotDimensions: {
        height: 300,
        width: 500,
      },
      slotPositions: [
        {
          y: 20,
          x: 38.8,
        },

        {
          y: 345,
          x: 38.8,
        },
      ],
    },
    {
      type: "singular",
      src: "/frame/prom/prom_4.png",
      thumbnail: "/frame/prom/thumbnail/prom_4.jpg",
      imageSlot: 2,
      slotDimensions: {
        height: 300,
        width: 500,
      },
      slotPositions: [
        {
          y: 20,
          x: 38.8,
        },

        {
          y: 345,
          x: 38.8,
        },
      ],
    },

    {
      type: "singular",
      src: "/frame/prom/prom_5.png",
      thumbnail: "/frame/prom/thumbnail/prom_5.jpg",
      imageSlot: 2,
      slotDimensions: {
        height: 300,
        width: 500,
      },
      slotPositions: [
        {
          y: 20,
          x: 38.8,
        },

        {
          y: 345,
          x: 38.8,
        },
      ],
    },
    {
      type: "singular",
      src: "/frame/prom/prom_6.png",
      thumbnail: "/frame/prom/thumbnail/prom_6.jpg",
      imageSlot: 2,
      slotDimensions: {
        height: 300,
        width: 500,
      },
      slotPositions: [
        {
          y: 20,
          x: 38.8,
        },

        {
          y: 345,
          x: 38.8,
        },
      ],
    },
  ],
  usagyuun: [
    {
      type: "double",
      src: "/frame/usagyuun/usagyuun_1.png",
      thumbnail: "/frame/usagyuun/thumbnail/usagyuun_1.png",
      imageSlot: 4,
      slotDimensions: {
        height: 115,
        width: 190,
      },
      slotPositions: [
        {
          y: 15,
          x: 15,
        },

        {
          y: 130,
          x: 15,
        },

        {
          y: 130 * 2 - 15,
          x: 15,
        },

        {
          y: 130 * 3 - 30,
          x: 15,
        },
      ],
    },
  ],
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
  filter: string | null;
  value: string | null;
}[] = [
  {name: "Original", filter: null, value: null},
  {name: "1977", filter: "filter-1977", value: "sepia(0.5) hue-rotate(-30deg) saturate(1.4)"},
  {name: "Aden", filter: "filter-aden", value: "sepia(0.2) brightness(1.15) saturate(1.4)"},
  {name: "Amaro", filter: "filter-amaro", value: "sepia(0.35) contrast(1.1) brightness(1.2) saturate(1.3)"},
  {name: "Ashby", filter: "filter-ashby", value: "sepia(0.5) contrast(1.2) saturate(1.8)"},
  {name: "Brannan", filter: "filter-brannan", value: "sepia(0.4) contrast(1.25) brightness(1.1) saturate(0.9) hue-rotate(-2deg)"},
  {name: "Brooklyn", filter: "filter-brooklyn", value: "sepia(0.25) contrast(1.25) brightness(1.25) hue-rotate(5deg)"},
  {name: "Charmes", filter: "filter-charmes", value: "sepia(0.25) contrast(1.25) brightness(1.25) saturate(1.35) hue-rotate(-5deg)"},
  {name: "Clarendon", filter: "filter-clarendon", value: "sepia(0.15) contrast(1.25) brightness(1.25) hue-rotate(5deg)"},
  {name: "Crema", filter: "filter-crema", value: "sepia(0.5) contrast(1.25) brightness(1.15) saturate(0.9) hue-rotate(-2deg)"},
  {name: "Dogpatch", filter: "filter-dogpatch", value: "sepia(0.35) saturate(1.1) contrast(1.5)"},
  {name: "Earlybird", filter: "filter-earlybird", value: "sepia(0.25) contrast(1.25) brightness(1.15) saturate(0.9) hue-rotate(-5deg)"},
  {name: "Gingham", filter: "filter-gingham", value: "contrast(1.1) brightness(1.1)"},
  {name: "Ginza", filter: "filter-ginza", value: "sepia(0.25) contrast(1.15) brightness(1.2) saturate(1.35) hue-rotate(-5deg)"},
  {name: "Hefe", filter: "filter-hefe", value: "sepia(0.4) contrast(1.5) brightness(1.2) saturate(1.4) hue-rotate(-10deg)"},
  {name: "Helena", filter: "filter-helena", value: "sepia(0.5) contrast(1.05) brightness(1.05) saturate(1.35)"},
  {name: "Hudson", filter: "filter-hudson", value: "sepia(0.25) contrast(1.2) brightness(1.2) saturate(1.05) hue-rotate(-15deg)"},
  {name: "Inkwell", filter: "filter-inkwell", value: "brightness(1.25) contrast(0.85) grayscale(1)"},
  {name: "Kelvin", filter: "filter-kelvin", value: "sepia(0.15) contrast(1.5) brightness(1.1) hue-rotate(-10deg)"},
  {name: "Juno", filter: "filter-juno", value: "sepia(0.35) contrast(1.15) brightness(1.15) saturate(1.8)"},
  {name: "Lark", filter: "filter-lark", value: "sepia(0.25) contrast(1.2) brightness(1.3) saturate(1.25)"},
  {name: "Lo-Fi", filter: "filter-lofi", value: "saturate(1.1) contrast(1.5)"},
  {name: "Ludwig", filter: "filter-ludwig", value: "sepia(0.25) contrast(1.05) brightness(1.05) saturate(2)"},
  {name: "Maven", filter: "filter-maven", value: "sepia(0.35) contrast(1.05) brightness(1.05) saturate(1.75)"},
  {name: "Mayfair", filter: "filter-mayfair", value: "contrast(1.1) brightness(1.15) saturate(1.1)"},
  {name: "Moon", filter: "filter-moon", value: "brightness(1.4) contrast(0.95) saturate(0) sepia(0.35)"},
  {name: "Perpetua", filter: "filter-perpetua", value: "contrast(1.1) brightness(1.25) saturate(1.1)"},
  {name: "Poprocket", filter: "filter-poprocket", value: "sepia(0.15) brightness(1.2)"},
  {name: "Reyes", filter: "filter-reyes", value: "sepia(0.75) contrast(0.75) brightness(1.25) saturate(1.4)"},
  {name: "Rise", filter: "filter-rise", value: "sepia(0.25) contrast(1.25) brightness(1.2) saturate(0.9)"},
  {name: "Sierra", filter: "filter-sierra", value: "sepia(0.25) contrast(1.5) brightness(0.9) hue-rotate(-15deg)"},
  {name: "Skyline", filter: "filter-skyline", value: "sepia(0.15) contrast(1.25) brightness(1.25) saturate(1.2)"},
  {name: "Slumber", filter: "filter-slumber", value: "sepia(0.35) contrast(1.25) saturate(1.25)"},
  {name: "Stinson", filter: "filter-stinson", value: "sepia(0.35) contrast(1.25) brightness(1.1) saturate(1.25)"},
  {name: "Sutro", filter: "filter-sutro", value: "sepia(0.4) contrast(1.2) brightness(0.9) saturate(1.4) hue-rotate(-10deg)"},
  {name: "Toaster", filter: "filter-toaster", value: "sepia(0.25) contrast(1.5) brightness(0.95) hue-rotate(-15deg)"},
  {name: "Valencia", filter: "filter-valencia", value: "sepia(0.25) contrast(1.1) brightness(1.1)"},
  {name: "Vesper", filter: "filter-vesper", value: "sepia(0.35) contrast(1.15) brightness(1.2) saturate(1.3)"},
  {name: "Walden", filter: "filter-walden", value: "sepia(0.35) contrast(0.8) brightness(1.25) saturate(1.4)"},
  {name: "Willow", filter: "filter-willow", value: "brightness(1.2) contrast(0.85) saturate(0.05) sepia(0.2)"},
  {name: "X-Pro II", filter: "filter-xpro-ii", value: "sepia(0.45) contrast(1.25) brightness(1.75) saturate(1.3) hue-rotate(-5deg)"},
];

export const DEFAULT_STYLE: PhotoOptions<"prom"> = {
  theme: {
    name: "prom",
    frame: FrameDefaults.prom,
  },
  quantity: 1,
  images: [],
  selectedImages: [],
};

export const IMAGE_WIDTH = 378;
export const IMAGE_HEIGHT = 560;
