// Get necessary DOM elements
const arrayContainer = document.querySelector(".array-container");
const generateArrayButton = document.getElementById("generatearray");
const sizeSlider = document.getElementById("sizeSlider");
const sortArray = document.getElementById("sortArray");
const speedSlider = document.getElementById("speedSlider");

let selectionSortArray = [];
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
const swapBars = async (bar1, bar2) => {
  [bar1.style.height, bar2.style.height] = [
    bar2.style.height,
    bar1.style.height,
  ];
};

// Start sorting process (Selection Sort example)
const startSorting = async () => {
  toggleButtons(true);
  isSorting = true;

  await selectionSort(selectionSortArray);

  // After sorting, color bars light green progressively
  const bars = document.querySelectorAll(".array-bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "lightgreen";
    await sleep(); // Add delay while coloring bars
  }

  toggleButtons(false);
  isSorting = false;
};

// Selection Sort Algorithm
const selectionSort = async (array) => {
  const bars = document.querySelectorAll(".array-bar");
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      // Reset previous highlights
      for (let k = i; k < n; k++) {
        if (k !== minIndex) {
          bars[k].style.backgroundColor = "blue"; // Reset to default color
        }
      }

      // Highlight current element being compared
      bars[j].style.backgroundColor = "yellow"; // Highlight current element
      bars[minIndex].style.backgroundColor = "yellow"; // Highlight minimum candidate

      // Compare elements
      if (array[j] < array[minIndex]) {
        // If a new minimum is found, reset the previous min highlight
        if (minIndex !== i) {
          bars[minIndex].style.backgroundColor = "blue"; // Reset previous min highlight
        }
        minIndex = j; // Update minimum index
      }
      await sleep(); // Delay for visualization
    }

    // Highlight the minimum element found in red before swapping
    bars[minIndex].style.backgroundColor = "red";

    // Swap the found minimum element with the first element
    await swapBars(bars[i], bars[minIndex]);
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    bars[minIndex].style.backgroundColor = "blue"; // Reset minimum highlight
  }
};

// Event listeners
sortArray.addEventListener("click", () => {
  if (!isSorting) startSorting();
});

generateArrayButton.addEventListener("click", () => {
  if (!isSorting) {
    selectionSortArray = generateRandomArray();
    displayBars(selectionSortArray);
  }
});

sizeSlider.addEventListener("change", () => {
  if (!isSorting) {
    selectionSortArray = generateRandomArray();
    displayBars(selectionSortArray);
  }
});

// Initialize array and display on page load
window.onload = () => {
  selectionSortArray = generateRandomArray();
  displayBars(selectionSortArray);
};
