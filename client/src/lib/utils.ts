import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PositionChange {
  from: number;
  to: number;
  fromItem: string;
  toItem: string;
}

interface TestItem {
  slot: string;
  item: string;
}

export function findChangedIndices(array1: TestItem[], array2: TestItem[]): PositionChange {
  for (let i = 0; i < array2.length; i++) {
    const currentItem = array2[i].item;

    const targetPosition = array1.findIndex((item) => item.item === currentItem);

    if (i !== targetPosition) {
      return {
        from: i,
        to: targetPosition, // Where it needs to move to match array1
        fromItem: array2[i].item,
        toItem: array1[i].item,
      };
    }
  }

  throw new Error("No changes found between arrays");
}

export function updateMap(sourceMap: Array<{id: string; data: string} | null>, change: PositionChange): Array<{id: string; data: string} | null> {
  const newMap = [...sourceMap];
  const temp = newMap[change.from];
  newMap[change.from] = newMap[change.to];
  newMap[change.to] = temp;
  return newMap;
}
