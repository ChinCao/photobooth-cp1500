"use client";
import {PhotoOptions, ValidTheme} from "@/constants/constants";
import {createContext, ReactNode, useContext, useState} from "react";

interface PhotoContextType {
  photo: PhotoOptions<ValidTheme> | undefined;
  setPhoto: React.Dispatch<React.SetStateAction<PhotoOptions<ValidTheme> | undefined>> | undefined;
}

const PhotoContext = createContext<PhotoContextType>({photo: undefined, setPhoto: undefined});

export const PhotoProvider = ({children}: {children: ReactNode}) => {
  const [photo, setPhoto] = useState<PhotoOptions<ValidTheme> | undefined>(undefined);

  return <PhotoContext.Provider value={{photo, setPhoto}}>{children}</PhotoContext.Provider>;
};

export const usePhoto = () => useContext(PhotoContext);
