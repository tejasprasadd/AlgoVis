// Get necessary DOM elements
const arrayContainer = document.querySelector(".array-container");
const generateArrayButton = document.getElementById("generatearray");
const sizeSlider = document.getElementById("sizeSlider");
const sortArray = document.getElementById("sortArray");
const speedSlider = document.getElementById("speedSlider");

let bubbleSortArray = [];
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

// Start sorting process (Bubble Sort example)
const startSorting = async () => {
  toggleButtons(true);
  isSorting = true;

  await bubbleSort(bubbleSortArray);

  // After sorting, color bars light green progressively
  const bars = document.querySelectorAll(".array-bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "lightgreen";
    await sleep(); // Add delay while coloring bars
  }

  toggleButtons(false);
  isSorting = false;
};

// Bubble Sort Algorithm
const bubbleSort = async (array) => {
  const bars = document.querySelectorAll(".array-bar");
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight the bars being compared
      bars[j].style.backgroundColor = "yellow";
      bars[j + 1].style.backgroundColor = "yellow";

      if (array[j] > array[j + 1]) {
        // Swap if elements are in wrong order
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        await swapBars(bars[j], bars[j + 1], "yellow", "yellow");
      }

      // Reset colors after comparison
      bars[j].style.backgroundColor = "blue";
      bars[j + 1].style.backgroundColor = "blue";
      await sleep(); // Delay for visualization
    }
  }
};

// Event listeners
sortArray.addEventListener("click", () => {
  if (!isSorting) startSorting();
});

generateArrayButton.addEventListener("click", () => {
  if (!isSorting) {
    bubbleSortArray = generateRandomArray();
    displayBars(bubbleSortArray);
  }
});

sizeSlider.addEventListener("change", () => {
  if (!isSorting) {
    bubbleSortArray = generateRandomArray();
    displayBars(bubbleSortArray);
  }
});

// Initialize array and display on page load
window.onload = () => {
  bubbleSortArray = generateRandomArray();
  displayBars(bubbleSortArray);
};
