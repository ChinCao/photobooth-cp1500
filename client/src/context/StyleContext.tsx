"use client";
import {FrameDefaults, StyleOptions, ValidTheme} from "@/constants/constants";
import {createContext, ReactNode, useContext, useState} from "react";

interface ImageStyleContextType {
  imageStyle: StyleOptions<ValidTheme> | undefined;
  setImageStyle: React.Dispatch<React.SetStateAction<StyleOptions<ValidTheme>>> | undefined;
}

const defaultStyle: StyleOptions<"prom"> = {
  theme: {
    name: "prom",
    frame: FrameDefaults.prom,
  },
  quantity: 1,
};

const ImageStyleContext = createContext<ImageStyleContextType>({imageStyle: undefined, setImageStyle: undefined});

export const StyleProvider = ({children}: {children: ReactNode}) => {
  const [imageStyle, setImageStyle] = useState<StyleOptions<ValidTheme>>(defaultStyle);

  return <ImageStyleContext.Provider value={{imageStyle, setImageStyle}}>{children}</ImageStyleContext.Provider>;
};

export const useStyle = () => useContext(ImageStyleContext);
