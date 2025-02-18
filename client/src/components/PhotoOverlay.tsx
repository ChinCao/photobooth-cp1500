import {usePhoto} from "@/context/StyleContext";
import SlideTransition from "@/components/SlideTransition";

export default function PhotoOverlay() {
  const {photo} = usePhoto();
  return !photo ? <SlideTransition /> : null;
}
