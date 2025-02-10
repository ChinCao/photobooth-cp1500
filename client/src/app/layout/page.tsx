"use client";
import NavBar from "@/components/NavBar/NavBar";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Carousel, CarouselContent, CarouselItem, type CarouselApi} from "@/components/ui/carousel";
import {FrameOptions, ValidTheme} from "@/constants/constants";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import {WheelGesturesPlugin} from "embla-carousel-wheel-gestures";
import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useState} from "react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa6";
import {IoIosArrowBack, IoIosArrowForward, IoIosCheckmark} from "react-icons/io";
import {useRouter} from "next/navigation";

const LayoutPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  useEffect(() => {
    if (!photo) return router.push("/");
  }, [photo, router]);
  const maxQuantity = 5;
  const [api, setApi] = useState<CarouselApi>();
  const [apiPreview, setApiPreview] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const handleQuantityChange = (quantity: number) => {
    setPhoto!((prevStyle) => {
      if (prevStyle) {
        return {
          ...prevStyle,
          quantity: quantity,
        };
      }
    });
  };

  const handleFrameChange = useCallback(
    (frameAttribute: (typeof FrameOptions)[ValidTheme][number]) => {
      setPhoto!((prevStyle) => {
        if (prevStyle) {
          return {
            ...prevStyle,
            theme: {
              ...prevStyle.theme,
              frame: frameAttribute,
            },
          };
        }
      });
    },
    [setPhoto]
  );

  const handleLeftClick = useCallback(() => {
    api?.scrollPrev();
    apiPreview?.scrollPrev();
  }, [api, apiPreview]);

  const handleRightClick = useCallback(() => {
    api?.scrollNext();
    apiPreview?.scrollNext();
  }, [api, apiPreview]);

  const handleCarouselItemClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
      apiPreview?.scrollTo(index);
    },
    [api, apiPreview]
  );

  useEffect(() => {
    if (!api || !apiPreview || !photo) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      handleFrameChange(FrameOptions[photo!.theme.name][api.selectedScrollSnap()]);
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, apiPreview, handleFrameChange, photo]);

  return (
    <>
      {photo && (
        <>
          <NavBar />
          <Card className="bg-background w-[75%] min-h-[75vh] mb-8 flex items-center justify-between p-8 flex-col gap-9">
            <div className="flex items-stretch justify-center gap-10">
              <div className="flex items-start flex-col justify-center gap-4 w-max">
                <h1 className="text-4xl font-bold uppercase">Chọn frame</h1>
                <div
                  className={cn(
                    "rounded border-2 border-gray-500 flex items-center justify-center py-8 px-2 bg-gray-100",
                    photo!.theme.frame.type == "singular" ? "w-[550px]" : "w-[650px]"
                  )}
                >
                  <IoIosArrowBack
                    size={60}
                    className="text-primary hover:cursor-pointer carousel-pointer"
                    onClick={handleLeftClick}
                  />
                  <Carousel
                    setApi={setApi}
                    plugins={[WheelGesturesPlugin()]}
                    opts={{
                      align: "center",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {FrameOptions[photo!.theme.name].map((item, index) => (
                        <CarouselItem
                          key={index}
                          className="flex gap-4 basis-[100%] items-center justify-center "
                        >
                          {Array.from({length: photo!.theme.frame.type == "singular" ? 1 : 2}, (_, index) => {
                            return (
                              <Image
                                key={index}
                                src={item.src}
                                alt="Frame"
                                height={235}
                                width={photo!.theme.frame.type == "singular" ? 235 : 150}
                                className="bg-white"
                              />
                            );
                          })}
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  <IoIosArrowForward
                    size={60}
                    className="text-primary hover:cursor-pointer carousel-pointer"
                    onClick={handleRightClick}
                  />
                </div>
                <div className={cn(photo!.theme.frame.type == "singular" ? "w-[550px]" : "w-[650px]")}>
                  <Carousel
                    setApi={setApiPreview}
                    plugins={[WheelGesturesPlugin()]}
                    opts={{
                      align: "center",
                      loop: true,
                    }}
                  >
                    <CarouselContent className="p-2">
                      {FrameOptions[photo!.theme.name].map((item, index) => (
                        <CarouselItem
                          key={index}
                          className={cn(
                            "flex items-center justify-center cursor-pointer",
                            photo?.theme.frame.type == "singular" ? " basis-1/4" : "basis-[15%]"
                          )}
                          onClick={() => {
                            handleCarouselItemClick(index);
                            handleFrameChange(item);
                          }}
                        >
                          <div
                            className={cn(
                              "bg-gray-100 p-3 rounded border border-gray-300",
                              current === index + 1 ? "scale-[1.05] border-4 border-rose-500" : null
                            )}
                          >
                            <Image
                              className="bg-white w-full max-h-[100px]"
                              src={item.src}
                              height={100}
                              width={100}
                              alt="Frame"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
              <div className="flex gap-10 items-center flex-col justify-between">
                <div className="flex flex-col items-center justify-center gap-8">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className="text-4xl font-bold uppercase text-nowrap">Chọn số lượng in</h1>
                    <div className="flex gap-4 flex-wrap items-center justify-center w-[60%]">
                      {Array.from({length: maxQuantity}, (_, index) => {
                        const quantiy = (index + 1) * (photo?.theme.frame.type == "singular" ? 1 : 2);
                        return (
                          <Button
                            key={index}
                            onClick={() => handleQuantityChange(quantiy)}
                            className={cn("text-2xl p-9 px-8 hover:bg-unset", photo?.quantity == quantiy ? "bg-green-700" : "bg-black")}
                          >
                            {quantiy}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap items-center justify-center w-[350px]">
                    {FrameOptions[photo!.theme.name].map((item, index) => {
                      const thumbnail = item.thumbnail!;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            handleFrameChange(item);
                            handleCarouselItemClick(index);
                          }}
                          className="relative h-[100px] w-[100px] object-cover"
                        >
                          <Image
                            src={thumbnail}
                            height={100}
                            width={100}
                            alt="Option"
                            className="hover:cursor-pointer rounded w-full h-full"
                          />

                          <IoIosCheckmark
                            color="#4ade80 "
                            className={cn("absolute w-full h-full top-0 bg-black/50", photo?.theme.frame.thumbnail == thumbnail ? "block" : "hidden")}
                            size={50}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-[75%]">
                  <Link
                    href="/"
                    className="flex  text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-2 hover:opacity-[85%] w-full"
                  >
                    <FaArrowLeft />
                    Chọn lại theme
                  </Link>
                  <Link
                    href="/capture"
                    className="flex text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-2 hover:opacity-[85%] w-full bg-green-700"
                  >
                    Chụp
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default LayoutPage;
