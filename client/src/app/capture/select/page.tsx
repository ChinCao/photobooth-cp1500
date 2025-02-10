/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn, findChangedIndices, updateMap} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Layer, Rect, Stage} from "react-konva";
import useImage from "use-image";
import {Image as KonvaImage} from "react-konva";
import {FaArrowRight} from "react-icons/fa6";
import Image from "next/image";
import SelectedImage from "@/components/SelectedImage";
import Link from "next/link";
import {FRAME_HEIGHT, FRAME_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, OFFSET_X, OFFSET_Y} from "@/constants/constants";
import {createSwapy, SlotItemMapArray, Swapy, utils} from "swapy";

const PrintPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  useEffect(() => {
    if (photo!.images!.length == 0) return router.push("/");
  }, [photo, router]);
  const [frameImg] = useImage(photo!.theme.frame.src);
  const [selectedImage, setSelectedImage] = useState<Array<{id: string; data: string} | null>>(
    Array.from({length: photo!.theme.frame.imageSlot}, () => null)
  );
  const [timeLeft, setTimeLeft] = useState(Infinity);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const photoRef = useRef(photo);

  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<Swapy | null>(null);
  const placeHolderDivs = useMemo(
    () =>
      Array.from({length: photo!.theme.frame.imageSlot}, (_, _index) => {
        return {
          id: _index,
        };
      }),
    []
  );

  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(utils.initSlotItemMap(placeHolderDivs, "id"));
  const slottedItems = useMemo(() => utils.toSlottedItems(placeHolderDivs, "id", slotItemMap), [placeHolderDivs, slotItemMap]);
  useEffect(() => {
    utils.dynamicSwapy(swapyRef.current, placeHolderDivs, "id", slotItemMap, setSlotItemMap);
  }, [placeHolderDivs]);

  useEffect(() => {
    if (containerRef.current) {
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
        setSelectedImage((prevImages) => {
          const slotChange = findChangedIndices(event.oldSlotItemMap.asArray, event.newSlotItemMap.asArray);
          return updateMap(prevImages, slotChange);
        });
      });
    }
    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  const handleContextSelect = useCallback(
    async (images: Array<{id: string; data: string}>) => {
      try {
        setPhoto!((prevStyle) => ({
          ...prevStyle,
          selectedImages: images,
        }));
        router.push("/capture/select/filter");
      } catch (error) {
        console.error("Failed to upload images:", error);
      }
    },
    [setPhoto, router]
  );

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setIsTimeOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!isTimeOver) return;

    const itemLeft = photoRef.current!.theme.frame.imageSlot - selectedImage.length;
    if (itemLeft > 0) {
      const unselectedImage = photoRef.current!.images.filter((item) => !selectedImage.includes(item));
      for (let i = unselectedImage.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unselectedImage[i], unselectedImage[j]] = [unselectedImage[j], unselectedImage[i]];
      }
      handleContextSelect([...selectedImage, ...unselectedImage.slice(0, itemLeft)]);
      setSelectedImage((prevImages) => [...prevImages, ...unselectedImage.slice(0, itemLeft)]);
    } else {
      handleContextSelect(selectedImage);
    }
    router.push("/capture/select/filter");
  }, [isTimeOver, handleContextSelect, router, selectedImage]);

  const handleSelect = (image: {id: string; data: string} | null) => {
    if (timeLeft > 0 && photo && image !== null) {
      const isSelected = selectedImage.some((img) => img?.id === image?.id);
      const maxImages = photo.theme.frame.imageSlot;
      if (!isSelected) {
        setSelectedImage((prevImages) => {
          const firstNullIndex = prevImages.findIndex((img) => img === null);

          if (firstNullIndex !== -1) {
            const newImages = [...prevImages];
            newImages[firstNullIndex] = image;
            return newImages;
          }
          return [...prevImages, image];
        });
      } else if (isSelected) {
        setSelectedImage((prevImages) => {
          const firstNullIndex = prevImages.findIndex((img) => img === null);
          if (firstNullIndex !== -1) {
            const newImages = [...prevImages];
            newImages[firstNullIndex] = image;
            return newImages;
          }
          return [...prevImages, image];
        });
      }
    }
  };

  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-center flex-col p-8 relative gap-6">
      <div className="flex items-start justify-center w-full gap-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-4">
            Chọn hình <span className="text-rose-500">{timeLeft}s</span>
          </h1>

          <div className="relative">
            <div
              className="flex  absolute flex-col "
              style={{
                top: photo!.theme.frame.slotPositions[0].y + OFFSET_Y,
                left: photo!.theme.frame.slotPositions[0].x + OFFSET_X,
                gap: photo!.theme.frame.slotPositions[0].y,
              }}
              ref={containerRef}
            >
              {slottedItems.map(({slotId, itemId}) => (
                <div
                  className="z-50"
                  key={slotId}
                  data-swapy-slot={slotId}
                  onClick={() => {
                    if (selectedImage[Number(slotId)]) {
                      handleSelect(selectedImage[Number(slotId)]);
                    }
                  }}
                >
                  <div
                    style={{
                      zIndex: 100,
                      width: photo!.theme.frame.slotDimensions.width,
                      height: photo!.theme.frame.slotDimensions.height,
                    }}
                    className="bg-transparent hover:cursor-pointer"
                    data-swapy-item={itemId}
                    key={itemId}
                  ></div>
                </div>
              ))}
            </div>

            {frameImg && photo && (
              <Stage
                width={IMAGE_WIDTH / (photo.theme.frame.type == "singular" ? 1 : 2)}
                height={IMAGE_HEIGHT}
              >
                <Layer>
                  <Rect
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                    fill="white"
                  />
                </Layer>
                <Layer
                  x={OFFSET_X}
                  y={OFFSET_Y}
                >
                  {slottedItems.map(({slotId}) => (
                    <SelectedImage
                      key={slotId}
                      url={selectedImage[Number(slotId)]?.data}
                      y={photo.theme.frame.slotPositions[Number(slotId)].y}
                      x={photo.theme.frame.slotPositions[Number(slotId)].x}
                      filter={null}
                      height={photo.theme.frame.slotDimensions.height}
                      width={photo.theme.frame.slotDimensions.width}
                    />
                  ))}
                </Layer>
                <Layer
                  x={OFFSET_X}
                  y={OFFSET_Y}
                >
                  <KonvaImage
                    image={frameImg}
                    height={FRAME_HEIGHT}
                    width={FRAME_WIDTH / (photo.theme.frame.type == "singular" ? 1 : 2)}
                  />
                </Layer>
              </Stage>
            )}
          </div>

          <p className="text-rose-500 font-bold mt-4">*Kéo hình để đổi thứ tự hình</p>
          <p className="text-rose-500 font-bold mt-4">*Ấn vào hình bạn không thích để xóa</p>
        </div>
        <div className="flex flex-wrap w-[55%] gap-4 items-center justify-center self-center">
          {photo && (
            <>
              {photo.images.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-gray-200 rounded border-4 border-transparent hover:border-black hover:cursor-pointer",
                    selectedImage.some((img) => img?.id === item.id) ? "border-rose-500 hover:border-rose-500" : null
                  )}
                  onClick={() => handleSelect(item)}
                >
                  <Image
                    height={300}
                    width={300}
                    src={item.data}
                    alt="image"
                    priority
                    className="w-[300px] pointer-events-none"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Button asChild>
        <Link
          href="/capture/select/filter"
          className={cn(
            "flex items-center justify-center gap-2 text-2xl self-end px-14 py-6 w-full",
            photo!.theme.frame.imageSlot - selectedImage.length != 0 ? "pointer-events-none opacity-80" : null
          )}
          onClick={() => handleContextSelect(selectedImage.filter((img) => img !== null))}
        >
          Chọn filter <FaArrowRight />
        </Link>
      </Button>
    </Card>
  );
};

export default PrintPage;
