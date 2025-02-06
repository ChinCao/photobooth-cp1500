"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import {useState, useEffect, useRef, useCallback} from "react";
import {useRouter} from "next/navigation";
import useSound from "use-sound";
import {NUM_OF_IMAGE} from "@/constants/constants";

const CapturePage = () => {
  const duration = 5;
  const {setPhoto} = usePhoto();
  const [count, setCount] = useState(duration);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [cycles, setCycles] = useState(1);
  const maxCycles = NUM_OF_IMAGE;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [image, setImage] = useState<Array<{id: string; data: string}>>([]);
  const [, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();
  const [cameraSize, setCameraSize] = useState<{width: number; height: number} | undefined>(undefined);
  const router = useRouter();
  const [playCameraShutterSound] = useSound("/shutter.mp3", {volume: 1});

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceInfos.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
        console.log("Available video devices:", videoDevices); // Debug log
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };

    getVideoDevices();
  }, []);

  useEffect(() => {
    const getVideo = async () => {
      if (!selectedDevice) {
        console.log("No device selected");
        return;
      }

      // Log the current URL to verify protocol
      console.log("Current URL:", window.location.href);

      try {
        console.log("Attempting to access camera...");
        const constraints = {
          video: {
            deviceId: selectedDevice ? {exact: selectedDevice} : undefined,
            width: {ideal: 1280},
            height: {ideal: 720},
          },
        };
        console.log("Using constraints:", constraints);

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Stream obtained:", stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Video element metadata loaded");
            videoRef.current
              ?.play()
              .then(() => console.log("Video playback started"))
              .catch((e) => console.error("Video playback failed:", e));
          };

          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          console.log("Camera settings:", settings);
          setCameraSize({width: settings.width || 0, height: settings.height || 0});
        } else {
          console.error("Video ref is not available");
        }
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        if (err instanceof DOMException) {
          console.error("Error name:", err.name);
          console.error("Error message:", err.message);
        }
      }
    };

    getVideo();
  }, [selectedDevice]);
  const handleCapture = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = cameraSize!.width || 640;
        canvas.height = cameraSize!.height || 480;
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        setImage((prevItems) => [...prevItems, {id: cycles.toString(), data: dataURL}]);
      }
    }
  }, [cameraSize, cycles]);

  useEffect(() => {
    if (cycles < maxCycles + 1) {
      const timer = setInterval(() => {
        if (isCountingDown) {
          if (count > 0 && cycles <= maxCycles) {
            setCount((prevCount) => prevCount - 1);
            if (count == 1) {
              handleCapture();
              playCameraShutterSound();
            }
          }
          if (count == 0 && cycles < maxCycles) {
            setCycles((prevCycle) => prevCycle + 1);
            setCount(duration);
          }
          if (cycles == maxCycles && count == 0) {
            setPhoto!((prevStyle) => ({
              ...prevStyle,
              images: image,
            }));
            setIsCountingDown(false);
            router.push("/capture/select");
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [count, cycles, handleCapture, image, isCountingDown, maxCycles, playCameraShutterSound, router, setPhoto]);

  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-center p-8 flex-col gap-9">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain -scale-x-100"
        />
        <h1 className={cn("absolute top-1/2 left-1/2 text-8xl text-white", cycles > maxCycles || count == 0 ? "hidden" : null)}>{count}</h1>
        <div className={cn("absolute w-full h-full bg-white top-0 opacity-0", count == 0 ? "flash-efect" : null)}></div>
      </div>
      <h1 className="font-bold text-5xl">
        {cycles}/{maxCycles}
      </h1>
    </Card>
  );
};

export default CapturePage;
