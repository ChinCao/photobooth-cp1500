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
import Image from "next/image";
import SelectedImage from "@/components/SelectedImage";
import Link from "next/link";
import {FRAME_HEIGHT, FRAME_WIDTH, IMAGE_HEIGHT, IMAGE_WIDTH, OFFSET_X, OFFSET_Y} from "@/constants/constants";
import {createSwapy, SlotItemMapArray, Swapy, utils} from "swapy";
import {uploadImageToR2} from "@/lib/r2";
import {MdOutlineCloudDone} from "react-icons/md";
import LoadingSpinner from "@/components/LoadingSpinner";
import SelectInstruction from "@/components/SelectInstruction";
import NavBar from "@/components/NavBar/NavBar";
import {useSocket} from "@/context/SocketContext";

const PrintPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  const {socket, isConnected} = useSocket();
  const [videoProcessed, setVideoProcessed] = useState(false);
  const lastImageUploaded = useMemo(() => {
    if (photo) {
      return photo!.images[photo!.images.length - 1].href != "";
    }
  }, [photo]);
  const videoRequestSent = useRef(false);

  useEffect(() => {
    if (socket && isConnected && photo && !videoRequestSent.current) {
      videoRequestSent.current = true;
      socket.emit(
        "process-video",
        {
          dataURL: photo.video.data,
        },
        (response: {success: boolean; r2_url: string}) => {
          if (response.success) {
            console.log("Video processed", response.r2_url);
            setPhoto!((prevStyle) => {
              if (prevStyle) {
                return {...prevStyle, video: {...prevStyle.video, r2_url: response.r2_url}};
              }
            });
            setVideoProcessed(true);
          }
        }
      );
    }
  }, [isConnected, photo, setPhoto, socket]);

  useEffect(() => {
    if (!photo) return router.push("/");
    if (photo!.selectedImages.length == photo!.theme.frame.imageSlot) return router.push("/layout/capture/select/filter");

    const uploadImage = async () => {
      const r2Response = await uploadImageToR2(photo!.images[photo!.images.length - 1].data);
      setPhoto!((prevStyle) => {
        if (prevStyle) {
          return {
            ...prevStyle,
            images: prevStyle.images.map((item) => (item.id == photo!.images[photo!.images.length - 1].id ? {...item, href: r2Response.url} : item)),
          };
        }
      });
    };
    if (!lastImageUploaded) {
      uploadImage();
    }
  }, [photo, router, setPhoto, lastImageUploaded]);
  const [frameImg] = useImage(photo ? photo!.theme.frame.src : "");

  const [selectedImage, setSelectedImage] = useState<Array<{id: string; data: string; href: string} | null>>(
    Array.from({length: photo ? photo!.theme.frame.imageSlot : 0}, () => null)
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeOver, setIsTimeOver] = useState(false);
  const photoRef = useRef(photo);
  const [lastRemovedImage, setLastRemovedImage] = useState<number>(photo ? photo!.theme.frame.imageSlot - 1 : 0);
  const isSingle = useMemo(() => {
    if (!photo) return 1;
    return photo.theme.frame.type == "singular" ? 1 : 2;
  }, [photo]);
  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<Swapy | null>(null);
  const placeHolderDivs = useMemo(
    () =>
      Array.from({length: photo ? photo!.theme.frame.imageSlot : 0}, (_, _index) => {
        return {
          id: _index,
        };
      }),
    [photo]
  );

  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(utils.initSlotItemMap(placeHolderDivs, "id"));
  const slottedItems = useMemo(() => utils.toSlottedItems(placeHolderDivs, "id", slotItemMap), [placeHolderDivs, slotItemMap]);
  useEffect(() => {
    utils.dynamicSwapy(swapyRef.current, placeHolderDivs, "id", slotItemMap, setSlotItemMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeHolderDivs]);

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current!, {
        manualSwap: true,
        animation: "none",
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
          if (slotChange) {
            return updateMap(prevImages, slotChange);
          }
          return prevImages;
        });
      });
    }
    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  const handleContextSelect = useCallback(
    async (images: Array<{id: string; data: string; href: string}>) => {
      try {
        setPhoto!((prevStyle) => {
          if (prevStyle) {
            return {
              ...prevStyle,
              selectedImages: images,
            };
          }
        });
        router.push("/layout/capture/select/filter");
      } catch (error) {
        console.error("Failed to upload images:", error);
      }
    },
    [router, setPhoto]
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

  const handleSelect = useCallback(
    (image: {id: string; data: string; href: string} | null) => {
      if (photo && image !== null) {
        const isSelected = selectedImage.some((img) => img?.id === image.id);
        const maxImages = photo.theme.frame.imageSlot;
        const currentSelectedImages = selectedImage.filter((img) => img !== null);
        if (!isSelected && maxImages - currentSelectedImages.length > 0) {
          setSelectedImage((prevImages) => {
            const firstNullIndex = prevImages.findIndex((img) => img === null);

            if (firstNullIndex !== -1) {
              const newImages = [...prevImages];
              newImages[firstNullIndex] = image;
              return newImages;
            }
            return [...prevImages, image];
          });
        } else if (isSelected && maxImages - currentSelectedImages.length >= 0) {
          setSelectedImage((prevImages) => {
            const newImage = [...prevImages];
            const index = prevImages.findIndex((img) => img?.id === image.id);
            if (index !== -1) {
              newImage[index] = null;
              setLastRemovedImage(index);
            }
            return newImage;
          });
        } else if (maxImages - currentSelectedImages.length == 0) {
          setSelectedImage((prevImages) => {
            const newImage = [...prevImages];
            newImage[lastRemovedImage!] = image;
            return newImage;
          });
        }
      }
    },
    [lastRemovedImage, photo, selectedImage]
  );

  const filteredSelectedImages = useMemo(() => selectedImage.filter((img) => img !== null), [selectedImage]);

  useEffect(() => {
    if (!isTimeOver || !photoRef.current) return;

    const itemLeft = photoRef.current!.theme.frame.imageSlot - filteredSelectedImages.length;
    if (itemLeft > 0) {
      const unselectedImage = photoRef.current!.images.filter((item) => !filteredSelectedImages.includes(item));

      const shuffledImages = [...unselectedImage].sort(() => Math.random() - 0.5);

      setSelectedImage((prevImages) => {
        const newImages = [...prevImages];
        let currentIndex = 0;

        for (let i = 0; i < newImages.length && currentIndex < itemLeft; i++) {
          if (newImages[i] === null) {
            newImages[i] = shuffledImages[currentIndex];
            currentIndex++;
          }
        }
        return newImages;
      });
    }
  }, [isTimeOver, filteredSelectedImages, photo, lastImageUploaded]);

  useEffect(() => {
    if (isTimeOver && lastImageUploaded && videoProcessed) {
      handleContextSelect(filteredSelectedImages);
    }
  }, [isTimeOver, filteredSelectedImages, handleContextSelect, lastImageUploaded, videoProcessed]);

  return (
    <>
      <NavBar />
      <Card className="bg-background w-[85%] h-[90vh] mb-8 flex items-center justify-center flex-col p-8 relative gap-6">
        <div className={cn("flex items-center justify-evenly w-full", isTimeOver ? "pointer-events-none" : null)}>
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div
                className="flex  absolute flex-col "
                style={{
                  top: photo ? photo!.theme.frame.slotPositions[0].y + OFFSET_Y : 0,
                  left: photo ? photo!.theme.frame.slotPositions[0].x + OFFSET_X : 0,
                  gap: photo ? photo!.theme.frame.slotPositions[0].y : 0,
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
                  width={IMAGE_WIDTH / isSingle}
                  height={IMAGE_HEIGHT}
                >
                  <Layer>
                    <Rect
                      width={IMAGE_WIDTH / isSingle}
                      height={IMAGE_HEIGHT}
                      fill="white"
                    />
                  </Layer>
                  <Layer
                    x={OFFSET_X / isSingle}
                    y={OFFSET_Y / isSingle}
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
                    x={OFFSET_X / isSingle}
                    y={OFFSET_Y / isSingle}
                  >
                    <KonvaImage
                      image={frameImg}
                      height={FRAME_HEIGHT}
                      width={FRAME_WIDTH / isSingle}
                    />
                  </Layer>
                </Stage>
              )}

              <SelectInstruction />
            </div>
          </div>
          <div className="flex flex-wrap w-[55%] gap-4 items-start justify-center ">
            {photo && (
              <h1 className="text-5xl font-bold mb-4">
                Chọn hình <span className="text-rose-500">{timeLeft}s</span>
              </h1>
            )}

            <div className="flex gap-4 items-center justify-center flex-wrap ">
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
                        height={280}
                        width={280}
                        src={item.data}
                        alt="image"
                        priority
                        className="w-[280px] pointer-events-none"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        {photo && (
          <Button asChild>
            <Link
              href="/layout/capture/select/filter"
              className={cn(
                "flex items-center justify-center gap-2 text-2xl self-end px-14 py-6 w-full",
                photo
                  ? photo!.theme.frame.imageSlot - filteredSelectedImages.length != 0 || isTimeOver || !lastImageUploaded || !videoProcessed
                    ? "pointer-events-none opacity-80"
                    : null
                  : null
              )}
              onClick={() => handleContextSelect(filteredSelectedImages)}
            >
              Chọn filter
              {!lastImageUploaded || !videoProcessed ? (
                <LoadingSpinner size={15} />
              ) : (
                <MdOutlineCloudDone
                  size={15}
                  color="white"
                />
              )}
            </Link>
          </Button>
        )}
      </Card>
    </>
  );
};

export default PrintPage;
