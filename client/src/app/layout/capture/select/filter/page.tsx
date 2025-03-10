/* eslint-disable @next/next/no-img-element */
"use client";
import {usePhoto} from "@/context/StyleContext";
import {useCallback, useEffect, useRef, useState} from "react";
import useImage from "use-image";
import {Image as KonvaImage, Rect} from "react-konva";
import {Layer, Stage} from "react-konva";
import SelectedImage from "@/components/SelectedImage";
import {Button} from "@/components/ui/button";
import {FILTERS, FRAME_HEIGHT, FRAME_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, OFFSET_X, OFFSET_Y} from "@/constants/constants";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Stage as StageElement} from "konva/lib/Stage";
import {useSocket} from "@/context/SocketContext";
import {PiPrinter} from "react-icons/pi";
import {useTranslation} from "react-i18next";
import {GlowEffect} from "@/components/ui/glow-effect";
import {SlidingNumber} from "@/components/ui/sliding-number";
import {useViewportScale} from "@/hooks/useViewportScale";
import usePreventNavigation from "@/hooks/usePreventNavigation";
import {createImage, updateFilter} from "@/server/actions";

const FilterPage = () => {
  const {photo, setPhoto} = usePhoto();
  const {navigateTo} = usePreventNavigation();
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scaleContainerRef = useViewportScale();

  const {t} = useTranslation();

  useEffect(() => {
    if (!photo) return navigateTo("/");
    if (photo!.selectedImages.length == 0) return navigateTo("/");
  }, [photo, navigateTo, setPhoto]);

  const [frameImg] = useImage(photo ? photo!.theme.frame.src : "");
  const [filter, setFilter] = useState<string | null>(null);
  const stageRef = useRef<StageElement | null>(null);
  const {socket, isConnected} = useSocket();
  const [isAllImageUploaded, setIsAllImageUploaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(99999);
  const [printed, setPrinted] = useState(false);

  const printImage = useCallback(async () => {
    if (stageRef.current && photo && socket) {
      if (!isConnected) {
        console.error("Socket not connected. Cannot print.");
        return;
      }
      if (printed) return;
      setPrinted(true);
      const filterReponse = await updateFilter(photo.id!, filter ? filter : "Original");
      if (filterReponse.error) {
        console.error("Failed to update filter");
      } else {
        console.log("Filter updated sucessfully to database!");
      }

      const dataURL = stageRef.current.toDataURL({pixelRatio: 5});
      const videoPreload = new Promise((resolve) => {
        if (photo.video.r2_url) {
          const video = document.createElement("video");
          video.src = photo.video.r2_url;
          video.preload = "auto";
          video.onloadeddata = () => resolve(true);
          video.onerror = () => resolve(false);
        } else {
          resolve(false);
        }
      });
      socket.emit(
        "print",
        {
          quantity: photo.theme.frame.type == "singular" ? photo.quantity : photo.quantity / 2,
          dataURL: dataURL,
          theme: photo.theme.name,
        },
        async (response: {success: boolean; message?: string}) => {
          console.log("Print event emitted:", response);
          if (!response.success) {
            console.error("Print failed:", response.message);
          }
          await videoPreload;
          if (isAllImageUploaded) {
            navigateTo("/layout/capture/select/filter/review");
          }
        }
      );
    }
  }, [photo, socket, isConnected, printed, filter, isAllImageUploaded, navigateTo]);

  useEffect(() => {
    async function uploadImageToDatabase() {
      for (const image of photo!.images) {
        const slotPosition = photo!.selectedImages.findIndex((selectedImage) => selectedImage.id == image.id);
        await createImage(image.data, photo!.id!, slotPosition);
      }
      setIsAllImageUploaded(true);
    }
    uploadImageToDatabase();
  }, [isAllImageUploaded, photo]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      printImage();
    }
  }, [printImage, navigateTo, setPhoto, timeLeft]);

  const selectRandomFilter = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * FILTERS.length);
    setFilter(FILTERS[randomIndex].value);

    filterRefs.current[randomIndex]?.scrollIntoView({
      behavior: "instant",
      block: "center",
    });
  }, []);

  return (
    <div className={cn(!timeLeft || printed ? "pointer-events-none" : null, "w-full h-full flex items-center justify-center flex-col")}>
      {photo && frameImg && (
        <>
          <div className="flex items-start justify-evenly gap-3 w-full h-full">
            <div className="h-full flex items-center justify-center">
              <div
                ref={scaleContainerRef}
                className="transform-gpu scale-[calc(var(--scale-factor,0.75))] origin-center"
              >
                <Stage
                  ref={stageRef}
                  width={IMAGE_WIDTH}
                  height={IMAGE_HEIGHT}
                >
                  <Layer>
                    <Rect
                      width={IMAGE_WIDTH}
                      height={IMAGE_HEIGHT}
                      fill="white"
                    />
                  </Layer>
                  {Array.from({length: photo.theme.frame.type == "singular" ? 1 : 2}, (_, _index) => (
                    <Layer
                      key={_index}
                      x={OFFSET_X}
                      y={OFFSET_Y}
                    >
                      {photo.selectedImages.map(({id, data}, index) => {
                        return (
                          data && (
                            <SelectedImage
                              key={id}
                              url={data}
                              y={photo.theme.frame.slotPositions[index].y}
                              x={photo.theme.frame.slotPositions[index].x + (FRAME_WIDTH / 2) * _index}
                              height={photo.theme.frame.slotDimensions.height}
                              width={photo.theme.frame.slotDimensions.width}
                              filter={filter}
                            />
                          )
                        );
                      })}
                    </Layer>
                  ))}

                  {Array.from({length: photo.theme.frame.type == "singular" ? 1 : 2}, (_, index) => (
                    <Layer
                      key={index}
                      x={OFFSET_X}
                      y={OFFSET_Y}
                    >
                      <KonvaImage
                        image={frameImg}
                        x={(FRAME_WIDTH / 2) * index}
                        height={FRAME_HEIGHT}
                        width={FRAME_WIDTH / (photo.theme.frame.type == "singular" ? 1 : 2)}
                      />
                    </Layer>
                  ))}
                </Stage>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col gap-5">
              <div className="flex gap-2 items-center justify-center mb-4">
                <h1 className="text-4xl font-bold  uppercase">{t("Choose a filter")}</h1>
                <span className="text-rose-500 text-4xl font-bold ">
                  <SlidingNumber
                    value={timeLeft}
                    padStart={true}
                  />
                </span>
              </div>
              <ScrollArea className=" h-[60vh] w-[100%] ">
                <div className="flex-wrap flex gap-4 items-center justify-center">
                  {FILTERS.map((item, index) => (
                    <div
                      ref={(el) => {
                        filterRefs.current[index] = el;
                      }}
                      className={cn(
                        "basis-1/6 flex flex-col gap-2 items-center justify-center border-[4px] cursor-pointer rounded hover:border-black",
                        filter == item.value ? "border-rose-500 hover:border-rose-500" : null
                      )}
                      key={index}
                      onClick={() => setFilter(item.value)}
                    >
                      <img
                        src={photo?.selectedImages[0]?.data}
                        alt="filtered image"
                        className={cn(item.filter, "w-full")}
                      />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2 w-full">
                <Button
                  className="w-full mt-2"
                  onClick={selectRandomFilter}
                >
                  {t("Random filter")} - {FILTERS.find((item) => item.value == filter)?.name}
                </Button>
                <Button
                  className="w-full mt-2"
                  onClick={() => setFilter(null)}
                >
                  {t("Reset filter")}
                </Button>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <GlowEffect
              colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
              mode="colorShift"
              blur="soft"
              duration={3}
              scale={1}
            />
            <Button
              className={cn(
                "flex text-xl text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-6 hover:opacity-[85%] w-full relative z-10",
                printed ? "pointer-events-none opacity-[85%]" : null
              )}
              onClick={printImage}
            >
              <>
                {t("Print")}
                <PiPrinter size={15} />
              </>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterPage;
