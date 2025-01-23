import React, {useCallback, useEffect, useState} from "react";
import {Image as KonvaImage} from "react-konva";

const SelectedImage = ({
  url,
  y,
  x,
  heightMultiplier,
  widthMultiplier,
  filter,
}: {
  url: string;
  y: number;
  x: number;
  heightMultiplier: number;
  widthMultiplier: number;
  filter?: string | null;
}) => {
  const [image, setImage] = useState<HTMLCanvasElement | null>(null);

  const loadImage = useCallback(() => {
    const img = document.createElement("img");
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      if (context) {
        if (typeof context.filter !== "undefined" && filter) {
          context.filter = filter;
        }
        context.drawImage(img, 0, 0);
      }
      setImage(canvas);
    };
  }, [filter, url]);

  useEffect(() => {
    loadImage();
  }, [loadImage, url, filter]);

  return (
    <KonvaImage
      image={image!}
      height={image ? image.height / heightMultiplier : undefined}
      width={image ? image.width / widthMultiplier : undefined}
      x={x}
      y={y}
    />
  );
};

export default SelectedImage;
