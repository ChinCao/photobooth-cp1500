"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import {useState, useEffect, useRef, useCallback} from "react";
import {useRouter} from "next/navigation";

const CapturePage = () => {
  const duration = 5;
  const {setPhoto} = usePhoto();
  const [count, setCount] = useState(duration + 5);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [cycles, setCycles] = useState(1);
  const maxCycles = 6;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [image, setImage] = useState<string[]>([]);
  const [, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();
  const [cameraSize, setCameraSize] = useState<{width: number; height: number} | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const getVideoDevices = async () => {
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceInfos.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    };

    getVideoDevices();
  }, []);

  useEffect(() => {
    const getVideo = async () => {
      if (!selectedDevice) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {deviceId: selectedDevice ? {exact: selectedDevice} : undefined},
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          setCameraSize({width: settings.width || 0, height: settings.height || 0});
        }
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    };

    getVideo();
  }, [selectedDevice]);
  const handleCapture = useCallback(
    () => () => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (context) {
          canvas.width = cameraSize!.width || 640;
          canvas.height = cameraSize!.height || 480;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL("image/png");
          setImage((prevItems) => [...prevItems, dataURL]);
        }
      }
    },
    [cameraSize]
  );

  useEffect(() => {
    if (cycles < maxCycles + 1) {
      const timer = setInterval(() => {
        if (isCountingDown) {
          if (count > 0 && cycles <= maxCycles) {
            setCount((prevCount) => prevCount - 1);
          } else if (count == 0 && cycles < maxCycles) {
            handleCapture();
            setCycles((prevCycle) => prevCycle + 1);
            setCount(duration);
          } else {
            setPhoto!((prevStyle) => ({
              ...prevStyle,
              images: image,
            }));
            setIsCountingDown(false);
            router.push("/capture/print");
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [count, isCountingDown, cycles, handleCapture, setPhoto, image, router]);
  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-center p-8 flex-col gap-9">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          className="scale-x-[-1] w-[850px] h-full rounded pointer-events-none"
        />
        <h1 className={cn("absolute top-1/2 left-1/2 text-7xl text-white", cycles > maxCycles || count == 0 ? "hidden" : null)}>{count}</h1>
      </div>
      <h1>
        {cycles}/{maxCycles}
      </h1>
    </Card>
  );
};

export default CapturePage;
