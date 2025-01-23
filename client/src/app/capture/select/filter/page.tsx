/* eslint-disable @next/next/no-img-element */
"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {useRouter} from "next/navigation";
import {useEffect, useMemo, useRef, useState} from "react";
import {createSwapy, SlotItemMapArray, Swapy, utils} from "swapy";
import {LuArrowUpDown} from "react-icons/lu";
import useImage from "use-image";
import {Image as KonvaImage} from "react-konva";
import {Layer, Stage} from "react-konva";
import SelectedImage from "@/components/SelectedImage";
import {Button} from "@/components/ui/button";
import {FILTERS} from "@/constants/constants";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/ui/scroll-area";

const FilterPage = () => {
  const {photo} = usePhoto();
  const router = useRouter();
  useEffect(() => {
    if (photo!.selectedImages.length == 0) return router.push("/");
  }, [photo, router]);
  const swapyRef = useRef<Swapy | null>(null);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(utils.initSlotItemMap(photo!.selectedImages, "id"));
  const slottedItems = useMemo(() => utils.toSlottedItems(photo!.selectedImages, "id", slotItemMap), [photo, slotItemMap]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameImg] = useImage(photo!.theme.frame.src);
  const [filter, setFilter] = useState<string | null>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => utils.dynamicSwapy(swapyRef.current, photo!.selectedImages, "id", slotItemMap, setSlotItemMap), [photo]);

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      animation: "dynamic",
      autoScrollOnDrag: true,
      swapMode: "hover",
      enabled: true,
      dragAxis: "both",
      dragOnHold: false,
    });

    swapyRef.current.onSwap((event) => {
      setSlotItemMap(event.newSlotItemMap.asArray);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center flex-col justify-evenly p-8 relative">
      <div className="flex items-start justify-evenly mb-8 w-full">
        <div className="flex gap-4 items-center justify-center">
          <LuArrowUpDown size={50} />
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold uppercase">Chọn vị trí</h1>
            <div
              className="flex flex-col gap-8"
              ref={containerRef}
            >
              {slottedItems.map(
                ({slotId, itemId, item}) =>
                  item && (
                    <div
                      key={slotId}
                      data-swapy-slot={slotId}
                      className="bg-gray-200 rounded hover:cursor-pointer"
                    >
                      <div
                        data-swapy-item={itemId}
                        key={itemId}
                        className="hover:border-black border-4 border-transparent "
                      >
                        <img
                          src={item.data}
                          alt="image"
                          className={cn("pointer-events-none", photo!.theme.frame.type == "singular" ? "w-[300px]" : "w-[180px]")}
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        {frameImg && (
          <Stage
            width={frameImg?.width / photo!.theme.frame.modifers.frame_scale_multiplier}
            height={frameImg?.height / photo!.theme.frame.modifers.frame_scale_multiplier / 2}
          >
            <Layer>
              {slottedItems.map(({slotId, item}, index) => {
                return (
                  item && (
                    <SelectedImage
                      key={slotId}
                      url={item.data}
                      y={photo!.theme.frame.modifers.image[index].position.y}
                      x={photo!.theme.frame.modifers.image[index].position.x}
                      widthMultiplier={photo!.theme.frame.modifers.image[index].scale_multiplier.width}
                      heightMultiplier={photo!.theme.frame.modifers.image[index].scale_multiplier.height}
                      filter={filter}
                    />
                  )
                );
              })}
            </Layer>
            <Layer>
              {slottedItems.map(({slotId, item}, index) => {
                return (
                  item && (
                    <SelectedImage
                      key={slotId}
                      url={item.data}
                      y={photo!.theme.frame.modifers.image[index].position.y}
                      x={photo!.theme.frame.modifers.image[index].position.x + frameImg.width}
                      widthMultiplier={photo!.theme.frame.modifers.image[index].scale_multiplier.width}
                      heightMultiplier={photo!.theme.frame.modifers.image[index].scale_multiplier.height}
                      filter={filter}
                    />
                  )
                );
              })}
            </Layer>
            <Layer>
              <KonvaImage
                image={frameImg}
                height={frameImg?.height / photo!.theme.frame.modifers.frame_scale_multiplier / 2}
                width={frameImg?.width / photo!.theme.frame.modifers.frame_scale_multiplier / 2}
              />
            </Layer>
            <Layer>
              <KonvaImage
                image={frameImg}
                x={246}
                height={frameImg?.height / photo!.theme.frame.modifers.frame_scale_multiplier / 2}
                width={frameImg?.width / photo!.theme.frame.modifers.frame_scale_multiplier / 2}
              />
            </Layer>
          </Stage>
        )}
        <div className="flex items-center justify-center flex-col gap-5">
          <h1 className="text-4xl font-bold mb-4 uppercase">Chọn filter</h1>
          <ScrollArea className=" h-[470px] w-[350px] ">
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
      </div>
      <Button className="flex text-xl text-center items-center justify-center gap-2 bg-foreground text-background rounded px-4 py-6 hover:opacity-[85%] w-full">
        In
      </Button>
    </Card>
  );
};

export default FilterPage;
