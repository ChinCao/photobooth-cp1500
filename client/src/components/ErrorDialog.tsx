import {t} from "i18next";
import {Dialog, DialogDescription, DialogTitle} from "./ui/dialog";
import {DialogContent} from "./ui/dialog";
import React from "react";
import {MdWarning} from "react-icons/md";
import {DialogHeader} from "./ui/dialog";

const ErrorDialog = () => {
  return (
    <Dialog defaultOpen>
      <DialogContent className="flex flex-col items-center justify-center gap-4 border border-red-500">
        <DialogHeader>
          <DialogTitle className="text-red-600 text-4xl font-bold">{t("An error occurred")}</DialogTitle>
        </DialogHeader>
        <MdWarning
          className="text-red-500"
          size={100}
        />
        <DialogDescription className="text-2xl">{t("Please try again")}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
