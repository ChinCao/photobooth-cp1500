"use client";
import {FrameDefaults, PhotoOptions, ValidTheme} from "@/constants/constants";
import {createContext, ReactNode, useContext, useState} from "react";

interface PhotoContextType {
  photo: PhotoOptions<ValidTheme> | undefined;
  setPhoto: React.Dispatch<React.SetStateAction<PhotoOptions<ValidTheme>>> | undefined;
}

const defaultStyle: PhotoOptions<"prom"> = {
  theme: {
    name: "prom",
    frame: FrameDefaults.prom,
  },
  quantity: 1,
  images: [],
};

const PhotoContext = createContext<PhotoContextType>({photo: undefined, setPhoto: undefined});

export const PhotoProvider = ({children}: {children: ReactNode}) => {
  const [photo, setPhoto] = useState<PhotoOptions<ValidTheme>>(defaultStyle);

  return <PhotoContext.Provider value={{photo, setPhoto}}>{children}</PhotoContext.Provider>;
};

export const usePhoto = () => useContext(PhotoContext);
