"use client";
import {createContext, ReactNode, useContext, useState} from "react";

interface StyleOptions {
  theme: {
    name: string;
    background: string;
  };
  quantity: number;
}

interface ImageStyleContextType {
  imageStyle: StyleOptions;
  setImageStyle: React.Dispatch<React.SetStateAction<StyleOptions>>;
}

const defaultStyle: StyleOptions = {
  theme: {
    name: "PROM",
    background: "default",
  },
  quantity: 2,
};

const ImageStyleContext = createContext<ImageStyleContextType | undefined>(undefined);

export const StyleProvider = ({children}: {children: ReactNode}) => {
  const [imageStyle, setImageStyle] = useState<StyleOptions>(defaultStyle);

  return <ImageStyleContext.Provider value={{imageStyle, setImageStyle}}>{children}</ImageStyleContext.Provider>;
};

export const useStyle = () => useContext(ImageStyleContext);
