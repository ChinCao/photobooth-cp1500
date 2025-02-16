"use client";
import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {FrameDefaults, ThemeSelectButton, ValidTheme} from "@/constants/constants";
import {usePhoto} from "@/context/StyleContext";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar/NavBar";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useTranslation} from "react-i18next";

const language = [
  {
    value: "vi",
    label: "Tiếng Việt",
    image_src: "/vn.svg",
  },
  {
    value: "en",
    label: "English",
    image_src: "/gb.svg",
  },
  {
    value: "fr",
    label: "Français",
    image_src: "/fr.svg",
  },
  {
    value: "cn",
    label: "繁體中文",
    image_src: "/cn.svg",
  },
];

const ThemePage = () => {
  const {setPhoto} = usePhoto();
  const {t, i18n} = useTranslation();

  const handleThemeChange = (name: ValidTheme) => {
    setPhoto!(() => {
      return {
        theme: {
          name: name,
          frame: FrameDefaults[name],
        },
        quantity: 1 * (FrameDefaults[name].type == "singular" ? 1 : 2),
        images: [],
        selectedImages: [],
        video: {
          data: new Blob(),
          r2_url: null,
        },
      };
    });
  };

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(() => {
    const defaultLang = language.find((lang) => lang.value === i18n.language);
    return defaultLang?.label ?? "English";
  });

  const handleLanguageSelect = (currentValue: string) => {
    const selectedLang = language.find((lang) => lang.label === currentValue);
    if (selectedLang) {
      setValue(currentValue);
      i18n.changeLanguage(selectedLang.value);
    }
    setOpen(false);
  };

  return (
    <>
      <NavBar />
      <Card className="bg-background w-[85%] min-h-[90vh] mb-8 flex items-center justify-start p-8 flex-col gap-9">
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between self-end"
            >
              <div className="flex items-center gap-2 justify-center">
                {value ? language.find((language) => language.label === value)?.label : t("Select language...")}
                <Image
                  src={language.find((language) => language.label === value)?.image_src ?? ""}
                  alt="language"
                  width={20}
                  height={20}
                />
              </div>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {language.map((language) => (
                    <CommandItem
                      key={language.value}
                      value={language.label}
                      onSelect={handleLanguageSelect}
                    >
                      {language.label}
                      <Image
                        src={language.image_src}
                        alt="language"
                        width={20}
                        height={20}
                      />
                      <Check className={cn("ml-auto", value === language.label ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <CardTitle className="text-4xl uppercase">{t("Choose theme")}</CardTitle>
          <CardContent className="flex items-center justify-center gap-8 flex-wrap w-[90%]">
            {ThemeSelectButton.map((item, index) => (
              <Link
                href="/layout"
                onClick={() => handleThemeChange(item.theme)}
                key={index}
              >
                <div
                  className="cursor-pointer w-[200px] h-[200px] hover:scale-[1.02] active:scale-[0.99]"
                  title={item.title}
                >
                  <Image
                    height={220}
                    width={220}
                    alt={item.title}
                    src={item.image_src}
                    className="rounded"
                    style={item.style}
                  />
                </div>
              </Link>
            ))}
          </CardContent>
        </div>
      </Card>
    </>
  );
};

export default ThemePage;
