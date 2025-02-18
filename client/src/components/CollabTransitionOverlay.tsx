import {usePhoto} from "@/context/StyleContext";
import SlideTransition from "@/components/SlideTransition";

export default function CollabTransitionOverlay() {
  const {photo} = usePhoto();
  return photo?.isTransition || !photo ? <SlideTransition /> : null;
}
