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
import {Layer as LayerElement} from "konva/lib/Layer";
import SelectedImage from "@/components/SelectedImage";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => utils.dynamicSwapy(swapyRef.current, photo!.selectedImages, "id", slotItemMap, setSlotItemMap), [photo]);
  const capturedRef = useRef<LayerElement>(null);
  useEffect(() => {
    if (capturedRef.current) {
      capturedRef.current.moveToBottom();
    }
  }, [slotItemMap]);

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
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-between p-8 relative gap-10">
      <div className="flex gap-4 items-center justify-center">
        <LuArrowUpDown size={50} />
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
                      className="w-[300px] pointer-events-none"
                    />
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-5xl font-bold mb-4 ">Chọn filter</h1>
        <Stage
          width={frameImg ? frameImg?.width / photo!.theme.frame.modifers.frame_scale_multiplier : undefined}
          height={frameImg ? frameImg?.height / photo!.theme.frame.modifers.frame_scale_multiplier : undefined}
        >
          <Layer>
            <KonvaImage
              image={frameImg}
              height={frameImg ? frameImg?.height / photo!.theme.frame.modifers.frame_scale_multiplier : undefined}
              width={frameImg ? frameImg?.width / photo!.theme.frame.modifers.frame_scale_multiplier : undefined}
            />
          </Layer>
          <Layer ref={capturedRef}>
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
                  />
                )
              );
            })}
          </Layer>
        </Stage>
      </div>
      <div className=""></div>
    </Card>
  );
};

export default FilterPage;
