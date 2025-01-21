import useImage from "use-image";
import {Image as KonvaImage} from "react-konva";

const SelectedImage = ({
  url,
  y,
  x,
  heightMultiplier,
  widthMultiplier,
}: {
  url: string;
  y: number;
  x: number;
  heightMultiplier: number;
  widthMultiplier: number;
}) => {
  const [image] = useImage(url);
  return (
    <KonvaImage
      image={image}
      height={image ? image?.height / heightMultiplier : undefined}
      width={image ? image?.width / widthMultiplier : undefined}
      x={x}
      y={y}
    />
  );
};

export default SelectedImage;
