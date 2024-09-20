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
const getSpeed = () => {
  const sliderValue = speedSlider.value;
  return (101 - sliderValue) * 10; // Map 1 to 100 slider to 1000ms (slow) to 10ms (fast)
};

// Sleep for dynamic duration
const sleep = () => {
  return new Promise((resolve) => setTimeout(resolve, getSpeed()));
};

// Start sorting process
const startSorting = async () => {
  toggleButtons(true);
  isSorting = true;

  await mergeSort(quickSortarray, 0, quickSortarray.length - 1);

  // After sorting, color bars light green progressively
  const bars = document.querySelectorAll(".array-bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "lightgreen";
    await sleep(); // Add delay while coloring bars
  }

  toggleButtons(false);
  isSorting = false;
};

// Merge Sort Algorithm
const mergeSort = async (array, left, right) => {
  if (left < right) {
    const middle = Math.floor((left + right) / 2);
    await mergeSort(array, left, middle);
    await mergeSort(array, middle + 1, right);
    await merge(array, left, middle, right);
  }
};

// Merge function for Merge Sort
const merge = async (array, left, middle, right) => {
  const leftArray = array.slice(left, middle + 1);
  const rightArray = array.slice(middle + 1, right + 1);

  let leftIndex = 0;
  let rightIndex = 0;
  let sortedIndex = left;

  const bars = document.querySelectorAll(".array-bar");

  while (leftIndex < leftArray.length && rightIndex < rightArray.length) {
    // Highlight the bars being compared
    bars[sortedIndex].style.backgroundColor = "yellow"; // Comparing bar

    await sleep(); // Allow some time for visualization

    if (leftArray[leftIndex] <= rightArray[rightIndex]) {
      array[sortedIndex] = leftArray[leftIndex];
      bars[sortedIndex].style.height = `${leftArray[leftIndex] * 2}px`;
      leftIndex++;
    } else {
      array[sortedIndex] = rightArray[rightIndex];
      bars[sortedIndex].style.height = `${rightArray[rightIndex] * 2}px`;
      rightIndex++;
    }

    bars[sortedIndex].style.backgroundColor = "lightgreen"; // Color the sorted bar
    sortedIndex++;
  }

  // Copy remaining elements of leftArray, if any
  while (leftIndex < leftArray.length) {
    array[sortedIndex] = leftArray[leftIndex];
    bars[sortedIndex].style.height = `${leftArray[leftIndex] * 2}px`;
    bars[sortedIndex].style.backgroundColor = "lightgreen"; // Color the sorted bar
    leftIndex++;
    sortedIndex++;
    await sleep();
  }

  // Copy remaining elements of rightArray, if any
  while (rightIndex < rightArray.length) {
    array[sortedIndex] = rightArray[rightIndex];
    bars[sortedIndex].style.height = `${rightArray[rightIndex] * 2}px`;
    bars[sortedIndex].style.backgroundColor = "lightgreen"; // Color the sorted bar
    rightIndex++;
    sortedIndex++;
    await sleep();
  }
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
