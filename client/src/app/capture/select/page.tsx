"use client";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useRef, useState} from "react";
import {Layer, Stage} from "react-konva";
import useImage from "use-image";
import {Image as KonvaImage} from "react-konva";
import {FaArrowRight} from "react-icons/fa6";
import Image from "next/image";
import SelectedImage from "@/components/SelectedImage";
import {Layer as LayerElement} from "konva/lib/Layer";
import Link from "next/link";

const PrintPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  useEffect(() => {
    if (photo!.images!.length == 0) return router.push("/");
  }, [photo, router]);
  const [frameImg] = useImage(photo!.theme.frame.src);
  const containerRef = useRef<HTMLDivElement>(null);
  const capturedRef = useRef<LayerElement>(null);
  const [selectedImage, setSelectedImage] = useState<Array<{id: string; data: string}>>([]);
  const [timeLeft, setTimeLeft] = useState(25);
  const photoRef = useRef(photo);

  useEffect(() => {
    if (capturedRef.current) {
      capturedRef.current.moveToBottom();
    }
  }, [selectedImage]);

  const handleContextSelect = useCallback(
    (images: Array<{id: string; data: string}>) => {
      setPhoto!((prevStyle) => ({
        ...prevStyle,
        selectedImages: images,
      }));
    },
    [setPhoto]
  );

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
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
    }
  }, [handleContextSelect, router, selectedImage, timeLeft]);

  const handleSelect = (image: {id: string; data: string}) => {
    if (timeLeft > 0 && photo) {
      const isSelected = selectedImage.some((img) => img.id === image.id);
      const maxImages = photo.theme.frame.imageSlot;
      if (isSelected) {
        setSelectedImage((prevImages) => prevImages.filter((img) => img.id !== image.id));
      } else if (selectedImage.length < maxImages) {
        setSelectedImage((prevImages) => [...prevImages, image]);
      } else {
        setSelectedImage((prevImages) => [...prevImages.slice(0, -1), image]);
      }
    }
  };

  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-center flex-col p-8 relative gap-6">
      <div className="flex items-start justify-center w-full gap-4">
        <div className="flex flex-col items-center justify-center ">
          <h1 className="text-5xl font-bold mb-4">
            Chọn hình <span className="text-rose-500">{timeLeft}s</span>
          </h1>
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
              {Array.from({length: photo!.theme.frame.imageSlot}, (_, index) => {
                return (
                  <SelectedImage
                    key={index}
                    url={selectedImage[index]?.data}
                    y={photo!.theme.frame.modifers.image[index].position.y}
                    x={photo!.theme.frame.modifers.image[index].position.x}
                    widthMultiplier={photo!.theme.frame.modifers.image[index].scale_multiplier.width}
                    heightMultiplier={photo!.theme.frame.modifers.image[index].scale_multiplier.height}
                  />
                );
              })}
            </Layer>
          </Stage>
          <p className="text-rose-500 font-bold mt-4">*Có thể đổi thứ tự hình sau</p>
        </div>
        <div
          className="flex flex-wrap w-[55%] gap-4 items-center justify-center "
          ref={containerRef}
        >
          {photo!.images!.map((item, index) => (
            <div
              key={index}
              className={cn(
                "bg-gray-200 rounded border-4 border-transparent hover:border-black hover:cursor-pointer",
                selectedImage.some((img) => img.id === item.id) ? "border-rose-500 hover:border-rose-500" : null
              )}
              onClick={() => handleSelect(item)}
            >
              <Image
                height={300}
                width={300}
                src={item.data}
                alt="image"
                className="w-[300px] pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
      <Button asChild>
        <Link
          href="/capture/select/filter"
          className={cn(
            "flex items-center justify-center gap-2 text-2xl self-end px-14 py-6",
            photo!.theme.frame.imageSlot - selectedImage.length != 0 ? "pointer-events-none opacity-80" : null
          )}
          onClick={() => handleContextSelect(selectedImage)}
        >
          Chọn filter <FaArrowRight />
        </Link>
      </Button>
    </Card>
  );
};

export default PrintPage;
