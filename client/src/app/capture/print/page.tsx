/* eslint-disable @next/next/no-img-element */
"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
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
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(utils.initSlotItemMap(photo!.images!, "id"));
  const slottedItems = useMemo(() => utils.toSlottedItems(photo!.images!, "id", slotItemMap), [photo, slotItemMap]);
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => utils.dynamicSwapy(swapyRef.current, photo!.images!, "id", slotItemMap, setSlotItemMap), [photo]);

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
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-center p-8 ">
      <Image
        width={400}
        height={400}
        alt="Frame"
        src={photo!.theme.frame.src}
      />
      <div
        className="flex gap-4 flex-wrap items-center justify-center w-[60%]"
        ref={containerRef}
      >
        {slottedItems.map(({slotId, itemId, item}) => (
          <div
            key={slotId}
            data-swapy-slot={slotId}
            className="bg-gray-200 rounded"
          >
            {item && (
              <div
                data-swapy-item={itemId}
                key={itemId}
              >
                <img
                  src={item.data}
                  alt="image"
                  className="w-[300px] pointer-events-none rounded"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PrintPage;
