/* eslint-disable @next/next/no-img-element */
"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import useImage from "use-image";
import {Image as KonvaImage, Rect} from "react-konva";
import {Layer, Stage} from "react-konva";
import SelectedImage from "@/components/SelectedImage";
import {Button} from "@/components/ui/button";
import {FILTERS, FRAME_HEIGHT, FRAME_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, OFFSET_X, OFFSET_Y} from "@/constants/constants";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Stage as StageElement} from "konva/lib/Stage";
import {io} from "socket.io-client";

const FilterPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  useEffect(() => {
    if (!photo) return router.push("/");
    if (photo!.selectedImages.length == 0) return router.push("/");
  }, [photo, router]);

  const [frameImg] = useImage(photo ? photo!.theme.frame.src : "");
  const [filter, setFilter] = useState<string | null>();
  const socket = useMemo(() => io("http://localhost:6969"), []);
  const stageRef = useRef<StageElement | null>(null);

  const [timeLeft, setTimeLeft] = useState(250000);
  const [printed, setPrinted] = useState(false);

  socket.on("connect", () => {
    console.log("Connected to server.");
  });

  const printImage = useCallback(() => {
    if (stageRef.current && photo) {
      setPrinted(true);
      const dataURL = stageRef.current.toDataURL({pixelRatio: 5});
      socket.emit("print", {
        quantity: photo.theme.frame.type == "singular" ? photo.quantity : photo.quantity / 2,
        dataURL: dataURL,
        theme: photo.theme.name,
      });
      setPhoto!(undefined);
      router.push("/");
    }
  }, [photo, router, setPhoto, socket]);

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

  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center flex-col justify-evenly p-8 relative">
      <div className="self-center">
        {photo && frameImg && (
          <>
            <div className="flex items-start justify-center gap-12 mb-8 w-full">
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
              <div className="flex items-center justify-center flex-col gap-5 ">
                <h1 className="text-4xl font-bold mb-4 uppercase">Chọn filter</h1>
                <ScrollArea className=" h-[470px] w-[700px] ">
                  <div className="flex-wrap flex gap-4 items-center justify-center">
                    {FILTERS.map((item, index) => (
                      <div
                        className={cn(
                          "flex flex-col gap-2 items-center justify-center border-2 cursor-pointer rounded hover:border-black",
                          filter == item.value ? "border-rose-500 hover:border-rose-500" : null
                        )}
                        key={index}
                        onClick={() => setFilter(item.value)}
                      >
                        <img
                          src={photo?.selectedImages[0]?.data}
                          alt="filtered image"
                          className={cn(item.filter, "w-24")}
                        />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button
                  className="w-full mt-2"
                  onClick={() => setFilter(null)}
                >
                  Reset filter
                </Button>
              </div>
            </div>{" "}
            <Button
              className="flex text-xl text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-6 hover:opacity-[85%] w-full"
              disabled={printed}
              onClick={printImage}
            >
              In {timeLeft}s
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default FilterPage;
