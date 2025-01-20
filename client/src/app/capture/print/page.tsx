/* eslint-disable @next/next/no-img-element */
"use client";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect, useMemo, useRef, useState} from "react";
import {createSwapy, SlotItemMapArray, Swapy, utils} from "swapy";

const PrintPage = () => {
  const {photo} = usePhoto();
  const router = useRouter();
  useEffect(() => {
    if (photo!.images!.length == 0) return router.push("/");
  }, [photo, router]);
  const swapyRef = useRef<Swapy | null>(null);
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(utils.initSlotItemMap(photo!.images, "id"));
  const slottedItems = useMemo(() => utils.toSlottedItems(photo!.images, "id", slotItemMap), [photo, slotItemMap]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => utils.dynamicSwapy(swapyRef.current, photo!.images, "id", slotItemMap, setSlotItemMap), [photo]);

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

  const handleSelect = (image: string) => {
    if (selectedImage.includes(image)) {
      setSelectedImage((prevImages) => prevImages.filter((a) => a != image));
    } else if (selectedImage.length < photo!.theme.frame.imageSlot) {
      setSelectedImage((prevImages) => [...prevImages, image]);
    }
  };

  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-center p-8 ">
      <div className="flex flex-col items-center justify-center gap-10">
        <h1 className="text-5xl font-bold">Chọn hình</h1>
        <Image
          width={500}
          height={500}
          alt="Frame"
          useMap=""
          className="relative z-[1]"
          src={photo!.theme.frame.src}
        />
      </div>
      <div
        className="flex flex-wrap w-[55%] gap-4 items-center justify-center "
        ref={containerRef}
      >
        {slottedItems.map(
          ({slotId, itemId, item}) =>
            item && (
              <div
                key={slotId}
                data-swapy-slot={slotId}
                className={cn(
                  "bg-gray-200 rounded border-4 border-transparent hover:border-black hover:cursor-pointer",
                  selectedImage.includes(item.data) ? "border-rose-500 hover:border-rose-500" : null
                )}
                onClick={() => handleSelect(item.data)}
              >
                <div
                  data-swapy-item={itemId}
                  key={itemId}
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
      <Button className="text-2xl p-4 py-6">In ảnh</Button>
    </Card>
  );
};

export default PrintPage;
