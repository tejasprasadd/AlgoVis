// Get necessary DOM elements
const arrayContainer = document.querySelector(".array-container");
const generateArrayButton = document.getElementById("generatearray");
const sizeSlider = document.getElementById("sizeSlider");
const sortArray = document.getElementById("sortArray");
const speedSlider = document.getElementById("speedSlider");

let quickSortarray = [];
let isSorting = false;

// Disable or enable buttons during sorting, keeping the speedSlider enabled
const toggleButtons = (disable) => {
  generateArrayButton.disabled = disable;
  sizeSlider.disabled = disable;
  sortArray.disabled = disable;
};

// Generate random array based on sizeSlider value and display the bars
const generateRandomArray = () => {
  const size = sizeSlider.value;
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 200) + 1);
  }
  return array;
};

// Display array bars in the container
const displayBars = (array) => {
  arrayContainer.innerHTML = "";
  array.forEach((value) => {
    const bar = document.createElement("div");
    bar.classList.add("array-bar");
    bar.style.height = `${value * 2}px`;
    bar.style.width = `${100 / array.length}%`;
    arrayContainer.appendChild(bar);
  });
};

// Get dynamic speed from slider during sorting
// Get dynamic speed from slider during sorting
const getSpeed = () => {
  const sliderValue = speedSlider.value;
  return (101 - sliderValue) * 10; // Map 1 to 100 slider to 1000ms (slow) to 10ms (fast)
};

// Sleep for dynamic duration
const sleep = () => {
  return new Promise((resolve) => setTimeout(resolve, getSpeed()));
};

// Swap two bars' heights and highlight them
const swapBars = async (bar1, bar2, color1, color2) => {
  bar1.style.backgroundColor = color1;
  bar2.style.backgroundColor = color2;
  await sleep(); // Use dynamic sleep during swap
  [bar1.style.height, bar2.style.height] = [
    bar2.style.height,
    bar1.style.height,
  ];
  bar1.style.backgroundColor = "blue";
  bar2.style.backgroundColor = "blue";
};

// Start sorting process (quick sort example)
const startSorting = async () => {
  toggleButtons(true);
  isSorting = true;

  await quickSort(quickSortarray, 0, quickSortarray.length - 1);

  // After sorting, color bars light green progressively
  const bars = document.querySelectorAll(".array-bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "lightgreen";
    await sleep(); // Add delay while coloring bars
  }

  toggleButtons(false);
  isSorting = false;
};

// Quick Sort Algorithm with dynamic speed and visual updates
const quickSort = async (array, left = 0, right = array.length - 1) => {
  if (left < right) {
    const pivotIndex = await partition(array, left, right);
    await quickSort(array, left, pivotIndex - 1);
    await quickSort(array, pivotIndex + 1, right);
  }
};

// Partition function for quick sort
const partition = async (array, left, right) => {
  const bars = document.querySelectorAll(".array-bar");
  const pivot = array[right];
  bars[right].style.backgroundColor = "red"; // Mark pivot as red
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (array[j] < pivot) {
      i++;
      await swapBars(bars[i], bars[j], "yellow", "yellow");
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  await swapBars(bars[i + 1], bars[right], "red", "yellow");
  [array[i + 1], array[right]] = [array[right], array[i + 1]];
  bars[right].style.backgroundColor = "blue"; // Reset pivot color
  return i + 1;
};

// Event listeners
sortArray.addEventListener("click", () => {
  if (!isSorting) startSorting();
});

generateArrayButton.addEventListener("click", () => {
  if (!isSorting) {
    quickSortarray = generateRandomArray();
    displayBars(quickSortarray);
  }
});

sizeSlider.addEventListener("change", () => {
  if (!isSorting) {
    quickSortarray = generateRandomArray();
    displayBars(quickSortarray);
  }
});

// Initialize array and display on page load
window.onload = () => {
  quickSortarray = generateRandomArray();
  displayBars(quickSortarray);
};
