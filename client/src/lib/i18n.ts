"use client";

import i18next from "i18next";
import {initReactI18next} from "react-i18next";

const i18nConfig = {
  resources: {
    en: {
      translation: {
        "Choose a theme": "Choose a theme",
        "Select language...": "Select language...",
        "Choose a frame": "Choose a frame",
        "Choose number of copies": "Choose number of copies",
        "Choose another theme": "Choose another theme",
        Capture: "Capture",
        "This application is developed and sponsored by VECTR": "This application is developed and sponsored by VECTR",
        "Waiting for camera...": "Waiting for camera...",
        "Choose pictures": "Choose pictures",
        "Choose a filter": "Choose a filter",
        Instruction: "Instruction",
        Close: "Close",
        Print: "Print",
        "Reset filter": "Reset filter",
        "Please go outside to take the photo": "Please go outside to take the photo",
        "Random filter": "Random filter",
      },
    },
    vi: {
      translation: {
        "Choose a theme": "Chọn theme",
        "Select language...": "Chọn ngôn ngữ...",
        "Choose a frame": "Chọn frame",
        "Choose number of copies": "Chọn số lượng in",
        "Choose another theme": "Chọn theme khác",
        Capture: "Chụp",
        "This application is developed and sponsored by VECTR": "Ứng dụng này được phát triển và tài trợ bởi CLB VECTR",
        "Waiting for camera...": "Đang chờ camera...",
        "Choose pictures": "Chọn hình",
        "Choose a filter": "Chọn filter",
        Instruction: "Hướng dẫn",
        Close: "Đóng",
        Print: "In",
        "Reset filter": "Filter mặc định",
        "Please go outside to take the photo": "Hãy đi ra ngoài lấy ảnh nhé!",
        "Random filter": "Filter ngẫu nhiên",
      },
    },
    fr: {
      translation: {
        "Choose a theme": "Choisir le thème",
        "Select language...": "Choisir la langue...",
        "Choose a frame": "Choisir le cadre",
        "Choose number of copies": "Choisir le nombre de copies",
        "Choose another theme": "Choisir un autre thème",
        Capture: "Capturer",
        "This application is developed and sponsored by VECTR": "Cette application est développée et soutenue par VECTR",
        "Waiting for camera...": "En attente de la caméra...",
        "Choose pictures": "Choisir les images",
        "Choose a filter": "Choisir un filtre",
        Instruction: "Instruction",
        Close: "Fermer",
        Print: "Imprimer",
        "Reset filter": "Réinitialiser le filtre",
        "Please go outside to take the photo": "Allez dehors pour prendre la photo",
        "Random filter": "Filtre aléatoire",
      },
    },
    cn: {
      translation: {
        "Choose a theme": "选择主题",
        "Select language...": "选择语言...",
        "Choose a frame": "选择框架",
        "Choose number of copies": "选择打印数量",
        "Choose another theme": "选择另一个主题",
        Capture: "拍摄",
        "This application is developed and sponsored by VECTR": "本应用程序由VECTR开发和赞助",
        "Waiting for camera...": "等待相机...",
        "Choose pictures": "选择图片",
        "Choose a filter": "选择滤镜",
        Instruction: "指令",
        Close: "关闭",
        Print: "打印",
        "Reset filter": "重置滤镜",
        "Please go outside to take the photo": "请出去拍照",
        "Random filter": "随机滤镜",
      },
    },
  },
  lng: "vi",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
};

i18next.use(initReactI18next).init(i18nConfig);

export default i18next;
