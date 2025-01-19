"use client";
import NavBar from "@/components/NavBar/NavBar";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {FrameOptions, ValidTheme} from "@/constants/constants";
import {useStyle} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa6";
import {IoIosCheckmark} from "react-icons/io";

const LayoutPage = () => {
  const {imageStyle, setImageStyle} = useStyle();
  const maxQuantity = 5;
  const handleQuantityChange = (quantity: number) => {
    setImageStyle!((prevStyle) => ({
      ...prevStyle,
      quantity: quantity,
    }));
  };
  const handleFrameChange = (frameAttribute: (typeof FrameOptions)[ValidTheme][number]) => {
    setImageStyle!((prevStyle) => ({
      ...prevStyle,
      theme: {
        ...prevStyle.theme,
        frame: frameAttribute,
      },
    }));
  };
  return (
    <>
      <NavBar />
      <Card className="bg-background w-[75%] min-h-[75vh] mt-28 mb-8 flex items-center justify-start p-8 flex-col gap-9">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-2 self-start hover:opacity-[85%]"
        >
          <FaArrowLeft />
          Chọn theme
        </Link>
        <div className="flex flex-col gap-10 items-start">
          <div className="flex gap-10 items-center justify-center">
            <h1 className="text-4xl font-bold uppercase text-nowrap">Chọn số lượng</h1>
            <div className="flex gap-4 flex-wrap items-center justify-center w-[60%]">
              {Array.from({length: maxQuantity}, (_, index) => {
                const quantiy = (index + 1) * (imageStyle?.theme.frame.type == "singular" ? 1 : 2);
                return (
                  <Button
                    key={index}
                    onClick={() => handleQuantityChange(quantiy)}
                    className={cn("text-2xl p-9 px-8 hover:bg-unset", imageStyle?.quantity == quantiy ? "bg-green-700" : "bg-black")}
                  >
                    {quantiy}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-28">
            <h1 className="text-4xl font-bold uppercase text-nowrap">Chọn frame</h1>
            <div className=" flex gap-8">
              <Image
                width={250}
                height={250}
                alt="Frame"
                src={imageStyle!.theme.frame.src}
              />
              <div className="flex gap-4">
                {FrameOptions[imageStyle!.theme.name].map((item, index) => {
                  const thumbnail = item.thumbnail!;
                  return (
                    <div
                      key={index}
                      onClick={() => handleFrameChange(item)}
                      className="relative h-max"
                    >
                      <Image
                        src={thumbnail}
                        height={75}
                        width={75}
                        alt="Option"
                        className="hover:cursor-pointer rounded"
                      />

                      <IoIosCheckmark
                        color="#4ade80 "
                        className={cn(
                          "absolute w-full h-full top-0 bg-black/50",
                          imageStyle?.theme.frame.thumbnail == thumbnail ? "block" : "hidden"
                        )}
                        size={50}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <Link
          href="/capture"
          className="flex w-full items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-2 self-end hover:opacity-[85%]"
        >
          Chụp
          <FaArrowRight />
        </Link>
      </Card>
    </>
  );
};

export default LayoutPage;
