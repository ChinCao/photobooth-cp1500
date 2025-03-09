"use client";
import {Carousel, CarouselContent, CarouselItem, type CarouselApi} from "@/components/ui/carousel";
import {FrameOptions, ValidTheme} from "@/constants/constants";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import {WheelGesturesPlugin} from "embla-carousel-wheel-gestures";
import Image from "next/image";
import Link from "next/link";
import {useCallback, useEffect, useRef, useState} from "react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa6";
import {IoIosArrowBack, IoIosArrowForward, IoIosCheckmark} from "react-icons/io";
import {useRouter} from "next/navigation";
import {useTranslation} from "react-i18next";
import {GlowEffect} from "@/components/ui/glow-effect";
import {ScrollArea} from "@/components/ui/scroll-area";
import {AnimatedBackground} from "@/components/ui/animated-background";

const LayoutPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  const {t} = useTranslation();
  useEffect(() => {
    if (!photo) return router.push("/");
    if (photo!.images.length > 0) return router.push("/layout/capture/");
  }, [photo, router]);
  const maxQuantity = 5;
  const [api, setApi] = useState<CarouselApi>();
  const [apiPreview, setApiPreview] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const handleQuantityChange = (quantity: number) => {
    setPhoto!((prevStyle) => {
      if (prevStyle) {
        return {
          ...prevStyle,
          quantity: quantity,
        };
      }
      return prevStyle;
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
  }, [api]);

  const handleRightClick = useCallback(() => {
    api?.scrollNext();
  }, [api]);

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

    const handleAPISelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      handleCarouselItemClick(api.selectedScrollSnap());
      handleFrameChange(FrameOptions[photo!.theme.name][api.selectedScrollSnap()]);
      thumbnailRefs.current[api.selectedScrollSnap()]?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    };

    const handlePreviewAPISelect = () => {
      setCurrent(apiPreview.selectedScrollSnap() + 1);
      handleCarouselItemClick(apiPreview.selectedScrollSnap());
      handleFrameChange(FrameOptions[photo!.theme.name][apiPreview.selectedScrollSnap()]);
      thumbnailRefs.current[apiPreview.selectedScrollSnap()]?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    };

    api.on("select", handleAPISelect);
    apiPreview.on("select", handlePreviewAPISelect);
    return () => {
      api.off("select", handleAPISelect);
      apiPreview.off("select", handlePreviewAPISelect);
    };
  }, [api, apiPreview, handleCarouselItemClick, handleFrameChange, photo]);

  return (
    <>
      {photo && (
        <div className="flex items-center justify-center gap-10 h-full">
          <div className="flex items-start flex-col justify-center gap-4 w-max">
            <h1 className="text-4xl font-bold uppercase">{t("Choose a frame")}</h1>
            <div className="rounded border-2 border-gray-500 flex items-center justify-center py-8 px-2 bg-gray-100 w-[40vw]">
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
                            width={photo!.theme.frame.type == "singular" ? 235 : 120}
                            className={cn(photo!.theme.frame.type == "singular" ? "w-[17vw]" : "w-[9vw]")}
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
            <div className="w-[40vw]">
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
          <div className="flex flex-col items-center justify-center gap-8 h-full">
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="text-4xl font-bold uppercase text-nowrap">{t("Choose number of copies")}</h1>
              <div className="flex gap-2 flex-wrap items-center justify-center w-[75%]">
                <AnimatedBackground
                  defaultValue={photo?.quantity?.toString()}
                  className="rounded-lg bg-green-700"
                  transition={{
                    ease: "easeInOut",
                    duration: 0.2,
                  }}
                >
                  {Array.from({length: maxQuantity}, (_, index) => {
                    const quantiy = (index + 1) * (photo?.theme.frame.type == "singular" ? 1 : 2);
                    return (
                      <div
                        className={cn(
                          " text-2xl text-white w-[90px] hover:cursor-pointer h-[90px] flex items-center justify-center mb-3 rounded-lg border bg-black"
                        )}
                        key={index}
                        data-id={quantiy.toString()}
                        onClick={() => handleQuantityChange(quantiy)}
                      >
                        {quantiy}
                      </div>
                    );
                  })}
                </AnimatedBackground>
              </div>
            </div>
            <ScrollArea className="w-[350px] h-[35%]">
              <div className="flex gap-4 flex-wrap items-center justify-center w-full">
                {FrameOptions[photo!.theme.name].map((item, index) => {
                  const thumbnail = item.thumbnail;
                  if (!thumbnail) return null;
                  return (
                    <div
                      ref={(el) => {
                        thumbnailRefs.current[index] = el;
                      }}
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
            </ScrollArea>
            <div className="flex flex-col gap-4 w-[75%]">
              <Link
                href="/"
                className="flex  text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-2 hover:opacity-[85%] w-full"
              >
                <FaArrowLeft />
                {t("Choose another theme")}
              </Link>
              <div className="relative">
                <GlowEffect
                  colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                  mode="colorShift"
                  blur="soft"
                  duration={3}
                  scale={1.02}
                />
                <Link
                  href="/layout/capture"
                  className="flex text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-2 hover:opacity-[85%] w-full bg-green-700 z-10 relative "
                >
                  {t("Capture")}
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LayoutPage;
