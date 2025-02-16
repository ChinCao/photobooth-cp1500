/* eslint-disable @next/next/no-img-element */
"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {useRouter} from "next/navigation";
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
import NavBar from "@/components/NavBar/NavBar";
import {useSocket} from "@/context/SocketContext";
import {PiPrinter} from "react-icons/pi";

const FilterPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!photo) return router.push("/");
    if (photo!.selectedImages.length == 0) return router.push("/");
  }, [photo, router, setPhoto]);

  const [frameImg] = useImage(photo ? photo!.theme.frame.src : "");
  const [filter, setFilter] = useState<string | null>(null);
  const stageRef = useRef<StageElement | null>(null);
  const {socket, isConnected} = useSocket();

  const [timeLeft, setTimeLeft] = useState(30);
  const [printed, setPrinted] = useState(false);

  const printImage = useCallback(() => {
    if (stageRef.current && photo && socket) {
      if (!isConnected) {
        console.error("Socket not connected. Cannot print.");
        return;
      }

      setPrinted(true);
      const dataURL = stageRef.current.toDataURL({pixelRatio: 5});

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
          router.push("/layout/capture/select/filter/review");
        }
      );
    }
  }, [photo, router, socket, isConnected]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      printImage();
    }
  }, [printImage, router, setPhoto, timeLeft]);

  const selectRandomFilter = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * FILTERS.length);
    setFilter(FILTERS[randomIndex].value);

    setTimeout(() => {
      filterRefs.current[randomIndex]?.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }, 100);
  }, []);

  return (
    <>
      <NavBar />
      <Card
        className={cn(
          "bg-background w-[85%] h-[90vh] mb-8 flex items-center flex-col justify-center p-8 relative",
          !timeLeft ? "pointer-events-none" : null
        )}
      >
        <div className="self-center">
          {photo && frameImg && (
            <>
              <div className="flex items-start justify-evenly gap-6 mb-8 w-full">
                <div className="self-center">
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
                <div className="flex items-center justify-center flex-col gap-5">
                  <h1 className="text-4xl font-bold mb-4 uppercase">
                    Chọn filter <span className="text-rose-500">{timeLeft}s</span>
                  </h1>
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
                      Random filter - {FILTERS.find((item) => item.value == filter)?.name}
                    </Button>
                    <Button
                      className="w-full mt-2"
                      onClick={() => setFilter(null)}
                    >
                      Reset filter
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                className="flex text-xl text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-6 hover:opacity-[85%] w-full"
                disabled={printed}
                onClick={printImage}
              >
                <>
                  In
                  <PiPrinter size={15} />
                </>
              </Button>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default FilterPage;
