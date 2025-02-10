const test1 = [
  {
    slot: "0",
    item: "0",
  },
  {
    slot: "1",
    item: "1",
  },
  {
    slot: "2",
    item: "2",
  },
  {
    slot: "3",
    item: "3",
  },
];

const map1 = ["skibidi", null, null, null];

const test2 = [
  {
    slot: "0",
    item: "1",
  },
  {
    slot: "1",
    item: "0",
  },
  {
    slot: "2",
    item: "2",
  },
  {
    slot: "3",
    item: "3",
  },
];

const map2 = [null, "skibidi", null, null];

const test3 = [
  {
    slot: "0",
    item: "1",
  },
  {
    slot: "1",
    item: "2",
  },
  {
    slot: "2",
    item: "0",
  },
  {
    slot: "3",
    item: "3",
  },
];
const map3 = [null, null, "skibidi", null];

const test4 = [
  {
    slot: "0",
    item: "1",
  },
  {
    slot: "1",
    item: "0",
  },
  {
    slot: "2",
    item: "2",
  },
  {
    slot: "3",
    item: "3",
  },
];

// Function to find the indices that changed positions between two test arrays
function findChangedIndices(array1, array2) {
  // Compare array2 to array1 to find where items need to move
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

// Function to apply the change to a map array
function updateMap(sourceMap, change) {
  const newMap = [...sourceMap];
  // Swap the values

  const temp = newMap[change.from];
  newMap[change.from] = newMap[change.to];
  newMap[change.to] = temp;
  return newMap;
}

// Test the changes
const change1to2 = findChangedIndices(test2, test1);
const map2Updated = updateMap(map1, change1to2);
console.log("Map 2:", map2Updated);

const change2to3 = findChangedIndices(test3, test2);
const map3Updated = updateMap(map2, change2to3);
console.log("Map 3:", map3Updated);

const change3to4 = findChangedIndices(test4, test3);
const map4Updated = updateMap(map3Updated, change3to4);
console.log("Map 4:", map4Updated);
