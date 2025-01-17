"use client";
import {useRef, useState, useEffect} from "react";

const LiveCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();
  const [cameraSize, setCameraSize] = useState<{width: number; height: number} | null>(null);

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

  const handleCapture = () => {
    const canvas = canvasRef.current;
    if (canvas && videoRef.current) {
      const context = canvas.getContext("2d");
      if (context) {
        context.save();
        context.scale(-1, 1);
        context.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();

        const dataURL = canvas.toDataURL("image/png");
        setImage(dataURL);
      }
    }
  };

  return (
    <div>
      <select
        onChange={(e) => setSelectedDevice(e.target.value)}
        value={selectedDevice}
      >
        {devices.map((device) => (
          <option
            key={device.deviceId}
            value={device.deviceId}
          >
            {device.label || `Camera ${devices.indexOf(device) + 1}`}
          </option>
        ))}
      </select>
      <video
        ref={videoRef}
        autoPlay
        style={{
          width: "100%",
          maxWidth: "500px",
          transform: "scaleX(-1)",
        }}
      />
      <button onClick={handleCapture}>Capture Image</button>
      <canvas
        ref={canvasRef}
        style={{display: "none"}}
        width={cameraSize?.width}
        height={cameraSize?.height}
      ></canvas>
      {image && (
        <div>
          <h2>Captured Image:</h2>
          <img
            src={image}
            alt="Captured"
            style={{width: "300px"}}
          />
        </div>
      )}
    </div>
  );
};

export default LiveCamera;
