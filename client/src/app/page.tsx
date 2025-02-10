"use client";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {FrameDefaults, PhotoOptions, ThemeSelectButton, ValidTheme} from "@/constants/constants";
import {usePhoto} from "@/context/StyleContext";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar/NavBar";

const ThemePage = () => {
  const {setPhoto} = usePhoto();

  const handleThemeChange = (name: ValidTheme) => {
    setPhoto!((prevStyle: PhotoOptions<typeof name> | undefined) => {
      if (prevStyle) {
        return {
          ...prevStyle,
          theme: {
            ...prevStyle.theme,
            name: name,
            frame: FrameDefaults[name],
          },
          quantity: 1 * (FrameDefaults[name].type == "singular" ? 1 : 2),
        };
      } else {
        return {
          theme: {
            name: name,
            frame: FrameDefaults[name],
          },
          quantity: 1 * (FrameDefaults[name].type == "singular" ? 1 : 2),
          images: [],
          selectedImages: [],
        };
      }
    });
  };
  return (
    <>
      <NavBar />
      <Card className="bg-background w-[75%] min-h-[75vh] mb-8 flex items-center justify-start p-8 flex-col gap-9">
        <CardTitle className="text-4xl uppercase">Chọn theme</CardTitle>
        <CardContent className="flex items-center justify-center gap-8 flex-wrap w-[90%]">
          {ThemeSelectButton.map((item, index) => (
            <Link
              href="/layout"
              onClick={() => handleThemeChange(item.theme)}
              key={index}
            >
              <div
                className="cursor-pointer w-[200px] h-[200px] hover:scale-[1.02] active:scale-[0.99]"
                title={item.title}
              >
                <Image
                  height={220}
                  width={220}
                  alt={item.title}
                  src={item.image_src}
                  className="rounded"
                  style={item.style}
                />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default ThemePage;
