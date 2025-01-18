"use client";
import {Card, CardTitle} from "@/components/ui/card";
import {StyleOptions, ValidTheme} from "@/constants/constants";
import {useStyle} from "@/context/StyleContext";
import Image from "next/image";
import React from "react";

const ThemePage = () => {
  const {setImageStyle} = useStyle();
  const handleThemeChange = (name: ValidTheme) => {
    setImageStyle!((prevStyle: StyleOptions) => ({
      ...prevStyle,
      theme: {
        ...prevStyle.theme,
        name: name,
      },
    }));
  };
  return (
    <Card className="bg-background max-w-[75%] min-h-[80vh] mt-28 flex items-center justify-start p-8 flex-col gap-9">
      <CardTitle className="text-4xl uppercase">Choose a theme</CardTitle>
      <div className="flex items-center justify-center gap-8 flex-wrap w-[90%]">
        <button
          className="cursor-pointer w-[200px] h-[200px] border-2"
          title="PROM"
          onClick={() => handleThemeChange("PROM")}
        >
          <Image
            height={200}
            width={200}
            alt="option"
            src="/prom.jpg"
            className="rounded"
          />
        </button>
        <button
          className="cursor-pointer w-[200px] h-[200px]"
          title="Usagyuuun"
          onClick={() => handleThemeChange("usagyuun")}
        >
          <Image
            height={200}
            width={200}
            alt="option"
            src="/rabbit.jpg"
            className="rounded"
          />
        </button>
        <button
          className="cursor-pointer w-[200px] h-[200px]"
          title="Squid game"
          onClick={() => handleThemeChange("squid")}
        >
          <Image
            height={200}
            width={200}
            alt="option"
            src="/squid.jpg"
            className="rounded"
          />
        </button>
        <button
          className="cursor-pointer w-[200px] h-[200px] overflow-hidden"
          title="Powerpuff girls"
          onClick={() => handleThemeChange("powerpuff")}
        >
          <Image
            height={200}
            width={200}
            alt="option"
            src="/powerpuff.webp"
            className="rounded"
            style={{objectPosition: "0% -100px"}}
          />
        </button>
        <button
          className="cursor-pointer w-[200px] h-[200px] overflow-hidden"
          title="We bare bears"
          onClick={() => handleThemeChange("bear")}
        >
          <Image
            height={200}
            width={200}
            alt="option"
            src="/bear.jpg"
            className="rounded"
          />
        </button>
        <button
          className="cursor-pointer w-[200px] h-[200px] overflow-hidden"
          title="Otonya"
          onClick={() => handleThemeChange("otonya")}
        >
          <Image
            height={200}
            width={200}
            alt="option"
            src="/otonya.jpg"
            className="rounded"
          />
        </button>
        <button
          className="cursor-pointer w-[200px] h-[200px] overflow-hidden"
          title="Zookiz"
          onClick={() => handleThemeChange("zookiz")}
        >
          <Image
            height={200}
            width={200}
            alt="option"
            src="/zookiz.png"
            className="rounded"
          />
        </button>
      </div>
    </Card>
  );
};

export default ThemePage;
