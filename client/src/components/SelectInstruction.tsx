"use client";
import {usePhoto} from "@/context/StyleContext";
import {Button} from "./ui/button";
import {Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose} from "./ui/drawer";
import {useTranslation} from "react-i18next";

const SelectInstruction = () => {
  const {photo} = usePhoto();
  const {t} = useTranslation();
  return (
    <>
      {photo && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="w-full -mt-4 z-10 relative">{t("Instruction")}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm min-h-[50vh]">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>Set your daily activity goal.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2"></div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">{t("Close")}</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SelectInstruction;
