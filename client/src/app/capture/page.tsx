"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import {useState, useEffect, useRef, useCallback} from "react";
import {useRouter} from "next/navigation";
import useSound from "use-sound";
import {NUM_OF_IMAGE} from "@/constants/constants";
import {ImCamera} from "react-icons/im";
import LoadingSpinner from "@/components/LoadingSpinner";

const CapturePage = () => {
  const duration = 3;
  const {setPhoto, photo} = usePhoto();
  const [count, setCount] = useState(duration);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [cycles, setCycles] = useState(1);
  const maxCycles = NUM_OF_IMAGE;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [image, setImage] = useState<Array<{id: string; data: string}>>([]);
  const [, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();
  const [cameraSize, setCameraSize] = useState<{width: number; height: number} | undefined>(undefined);
  const router = useRouter();
  const [playCameraShutterSound] = useSound("/shutter.mp3", {volume: 1});
  const [cameraConstraints, setCameraConstraints] = useState<MediaTrackConstraints | null>(null);

  useEffect(() => {
    if (!photo) return router.push("/");
    if (photo!.images!.length == maxCycles) return router.push("/capture/select");
  }, [photo, router, maxCycles]);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({video: true}).then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
        });

        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceInfos.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
        console.log("Available video devices:", videoDevices);
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };

    getVideoDevices();
  }, []);

  useEffect(() => {
    const calculateConstraints = async () => {
      if (!selectedDevice || !photo?.theme.frame.slotDimensions) return;

      try {
        const initialStream = await navigator.mediaDevices.getUserMedia({
          video: {deviceId: {exact: selectedDevice}},
        });
        const track = initialStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        track.stop();

        const aspectRatio = photo.theme.frame.slotDimensions.width / photo.theme.frame.slotDimensions.height;
        const multiplier =
          Math.min(
            Math.floor(capabilities.width!.max! / photo.theme.frame.slotDimensions.width),
            Math.floor(capabilities.height!.max! / photo.theme.frame.slotDimensions.height)
          ) / aspectRatio;

        setCameraConstraints({
          deviceId: {exact: selectedDevice},
          width: {ideal: photo.theme.frame.slotDimensions.width * multiplier},
          height: {ideal: photo.theme.frame.slotDimensions.height * multiplier},
        });
      } catch (err) {
        console.error("Error calculating constraints:", err);
      }
    };

    calculateConstraints();
  }, [selectedDevice, photo?.theme.frame.slotDimensions]);

  useEffect(() => {
    const getVideo = async () => {
      if (!selectedDevice || !cameraConstraints) {
        console.log("No device or constraints available");
        return;
      }

      try {
        console.log("Attempting to access camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraConstraints,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Video element metadata loaded");
            videoRef.current
              ?.play()
              .then(() => {
                console.log("Video playback started");
                setIsCameraReady(true);
                setIsCountingDown(true);
              })
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
  }, [selectedDevice, cameraConstraints]);

  const handleCapture = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = cameraSize!.width || photo!.theme.frame.slotDimensions.width;
        canvas.height = cameraSize!.height || photo!.theme.frame.slotDimensions.height;
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");

        setImage((prevItems) => [...prevItems, {id: cycles.toString(), data: dataURL}]);
      }
    }
  }, [cameraSize, cycles, photo]);

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
            setPhoto!((prevStyle) => {
              if (prevStyle) {
                return {
                  ...prevStyle,
                  images: image,
                };
              }
            });
            setIsCountingDown(false);
            router.push("/capture/select");
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [count, cycles, duration, handleCapture, image, isCountingDown, maxCycles, playCameraShutterSound, router, setPhoto]);

  useEffect(() => {
    const videoElement = videoRef.current;

    return () => {
      if (videoElement?.srcObject instanceof MediaStream) {
        const tracks = (videoElement.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => {
          track.stop();
          console.log("Camera track stopped");
        });
      }
    };
  }, []);

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
        {isCameraReady ? (
          <>
            <h1
              className={cn(
                "absolute top-1/2 left-1/2 text-8xl text-white text-center",
                !isCameraReady || cycles > maxCycles || count == 0 ? "hidden" : null
              )}
            >
              {count}
            </h1>
            <h1 className="font-bold text-5xl text-center mt-6">
              {cycles}/{maxCycles}
            </h1>
            <div className={cn("absolute w-full h-full bg-white top-0 opacity-0", count == 0 ? "flash-efect" : null)}></div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-16 flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="relative">
              <LoadingSpinner
                size={200}
                color="black"
              />
              <ImCamera
                className="text-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                size={80}
              />
            </div>
            <h1 className="font-bold text-3xl uppercase text-center whitespace-nowrap">Wating for camera ...</h1>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CapturePage;
