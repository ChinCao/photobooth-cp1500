"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import {useRouter} from "next/navigation";
import useSound from "use-sound";
import {NUM_OF_IMAGE} from "@/constants/constants";
import {ImCamera} from "react-icons/im";
import LoadingSpinner from "@/components/LoadingSpinner";
import {uploadImageToR2} from "@/lib/r2";
import io from "socket.io-client";

const CapturePage = () => {
  const duration = 2;
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
  const [uploadedImages, setUploadedImages] = useState<Array<{id: string; href: string}>>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const socket = useMemo(
    () =>
      io("http://localhost:6969", {
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000,
      }),
    []
  );

  useEffect(() => {
    if (!photo) return router.push("/");
    if (photo!.images!.length == maxCycles) return router.push("/layout/capture/select");
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

    if (photo) {
      getVideoDevices();
    }
  }, [photo]);

  useEffect(() => {
    const calculateConstraints = async () => {
      if (!selectedDevice || !photo?.theme.frame.slotDimensions || !window) return;

      try {
        const initialStream = await navigator.mediaDevices.getUserMedia({
          video: {deviceId: {exact: selectedDevice}},
        });
        const track = initialStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        track.stop();

        const aspectRatio = window.innerWidth / window.innerHeight;

        const multiplier =
          (Math.min(window.innerWidth / photo.theme.frame.slotDimensions.width, window.innerHeight / photo.theme.frame.slotDimensions.height) /
            aspectRatio) *
          Math.min(
            capabilities.width!.max! > window.innerWidth
              ? capabilities.width!.max! / window.innerWidth
              : window.innerWidth / capabilities.width!.max!,
            capabilities.height!.max! > window.innerHeight
              ? capabilities.height!.max! / window.innerHeight
              : window.innerHeight / capabilities.height!.max!
          );

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

  const handleCapture = useCallback(async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", {colorSpace: "display-p3", willReadFrequently: true});

      if (context) {
        canvas.width = cameraSize!.width || photo!.theme.frame.slotDimensions.width;
        canvas.height = cameraSize!.height || photo!.theme.frame.slotDimensions.height;
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/jpeg", 1.0);
        setImage((prevItems) => [...prevItems, {id: cycles.toString(), data: dataURL}]);
        if (cycles == maxCycles) return;
        const r2Response = await uploadImageToR2(dataURL);
        const imageUrl = r2Response.url;
        setUploadedImages((prevItems) => [...prevItems, {id: cycles.toString(), href: imageUrl}]);
        console.log("Image URL:", imageUrl);
      }
    }
  }, [cameraSize, cycles, maxCycles, photo]);

  const handleRecording = useCallback(() => {
    if (!videoRef.current?.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const videoTrack = stream.getVideoTracks()[0];
    const {width, height} = videoTrack.getSettings();

    canvas.width = width!;
    canvas.height = height!;

    const flippedStream = canvas.captureStream();

    const drawVideo = () => {
      if (videoRef.current && ctx) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      }
      requestAnimationFrame(drawVideo);
    };
    drawVideo();

    const recorder = new MediaRecorder(flippedStream, {
      mimeType: "video/mp4",
      videoBitsPerSecond: 2000000,
    });

    let chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, {type: "video/mp4"});
      if (videoBlob.size > 0) {
        setPhoto!((prevStyle) => {
          if (prevStyle) {
            return {
              ...prevStyle,
              video: {
                data: videoBlob,
                uploaded: false,
              },
            };
          }
        });
      }
      chunks = [];
    };

    setMediaRecorder(recorder);
    recorder.start();
  }, [setPhoto]);

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
                handleRecording();
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
  }, [selectedDevice, cameraConstraints, handleRecording]);

  useEffect(() => {
    if (cycles < maxCycles + 1) {
      const timer = setInterval(async () => {
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
          if (cycles == maxCycles && count == 0 && uploadedImages.length == maxCycles - 1) {
            if (mediaRecorder) {
              mediaRecorder.stop();
            }
            setPhoto!((prevStyle) => {
              if (prevStyle) {
                return {
                  ...prevStyle,
                  images: image.map((item) => ({...item, href: uploadedImages.find((image) => image.id == item.id)?.href || ""})),
                };
              }
            });
            setIsCountingDown(false);
            router.push("/layout/capture/select");
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [
    count,
    cycles,
    duration,
    handleCapture,
    image,
    isCountingDown,
    maxCycles,
    mediaRecorder,
    playCameraShutterSound,
    router,
    setPhoto,
    uploadedImages,
  ]);

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

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server.");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Card className="bg-background w-[90%] h-[90vh] mb-8 flex items-center justify-start p-8 flex-col gap-9 relative">
      {photo && (
        <>
          <div className="w-[80%] relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain -scale-x-100"
            />
            {isCameraReady && (
              <>
                <h1
                  className={cn(
                    "absolute top-1/2 left-[calc(50%-15px)] text-8xl text-white text-center",
                    !isCameraReady || cycles > maxCycles || count === 0 ? "hidden" : null
                  )}
                >
                  {count}
                </h1>

                <div className={cn("absolute w-full h-full bg-white top-0 opacity-0", count === 0 ? "flash-efect" : null)}></div>
              </>
            )}
          </div>
          {isCameraReady && (
            <h1 className="font-bold text-4xl text-center mt-3 absolute left-[calc(50%-15px)] bottom-[2%]">
              {cycles}/{maxCycles}
            </h1>
          )}
          {!isCameraReady && (
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
              <h1 className="font-bold text-3xl uppercase text-center whitespace-nowrap">Waiting for camera ...</h1>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default CapturePage;
