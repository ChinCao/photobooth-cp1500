"use client";
import {usePhoto} from "@/context/StyleContext";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import {useTranslation} from "react-i18next";
const ReviewPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(6);
  const {t} = useTranslation();
  useEffect(() => {
    if (!photo) return router.push("/");
    if (!photo!.video.r2_url) return router.push("/");
  }, [photo, router, setPhoto]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      if (timeLeft == 1) {
        setPhoto!((prev) => ({...prev!, isTransition: true}));
      }
      return () => clearInterval(timerId);
    } else {
      setPhoto!(undefined);
      router.push("/");
    }
  }, [, router, setPhoto, timeLeft]);

  return (
    <div className="w-full h-full flex items-center justify-center gap-6 flex-col">
      {photo && (
        <div className="flex items-center justify-around gap-4">
          <video
            className="w-[70%] rounded-lg"
            src={photo.video.r2_url!}
            autoPlay
            muted
            loop
            playsInline
            ref={(el) => {
              if (el) el.playbackRate = 8;
            }}
          />
          <div className="flex flex-col gap-5 items-center justify-center">
            <h1 className="text-4xl font-bold text-center">{t("Please go outside to take the photo")}</h1>
            <p className="text-4xl font-bold text-center text-red-500">💫 {timeLeft}s</p>
            <div className="flex items-center justify-center">
              <Image
                src="/dance.gif"
                alt="logo"
                unoptimized
                width={160}
                height={160}
              />
              <Image
                src="/heart.gif"
                alt="logo"
                unoptimized
                width={160}
                height={160}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
