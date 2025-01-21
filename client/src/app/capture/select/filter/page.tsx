"use client";
import {Card} from "@/components/ui/card";
import {usePhoto} from "@/context/StyleContext";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const FilterPage = () => {
  const {photo, setPhoto} = usePhoto();
  const router = useRouter();
  useEffect(() => {
    if (photo!.selectedImages.length == 0) return router.push("/");
  }, [photo, router]);
  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-center flex-col p-8 relative gap-6">
      {photo!.selectedImages!.map((item, index) => (
        <div
          key={index}
          className={cn("bg-gray-200 rounded border-4 border-transparent hover:border-black hover:cursor-pointer")}
        >
          <Image
            height={300}
            width={300}
            src={item.data}
            alt="image"
            className="w-[300px] pointer-events-none"
          />
        </div>
      ))}
    </Card>
  );
};

export default FilterPage;
