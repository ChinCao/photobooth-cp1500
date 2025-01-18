"use client";
import {StyleOptions} from "@/constants/constants";
import {createContext, ReactNode, useContext, useState} from "react";

interface ImageStyleContextType {
  imageStyle: StyleOptions | undefined;
  setImageStyle: React.Dispatch<React.SetStateAction<StyleOptions>> | undefined;
}

const defaultStyle: StyleOptions = {
  theme: {
    name: "PROM",
    background: "default",
  },
  quantity: 2,
};

const ImageStyleContext = createContext<ImageStyleContextType>({imageStyle: undefined, setImageStyle: undefined});

export const StyleProvider = ({children}: {children: ReactNode}) => {
  const [imageStyle, setImageStyle] = useState<StyleOptions>(defaultStyle);

  return <ImageStyleContext.Provider value={{imageStyle, setImageStyle}}>{children}</ImageStyleContext.Provider>;
};

export const useStyle = () => useContext(ImageStyleContext);
