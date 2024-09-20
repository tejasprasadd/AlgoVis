// Get necessary DOM elements
const arrayContainer = document.querySelector(".array-container");
const generateArrayButton = document.getElementById("generatearray");
const sizeSlider = document.getElementById("sizeSlider");
const sortArray = document.getElementById("sortArray");
const speedSlider = document.getElementById("speedSlider");

let insertionSortArray = [];
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

// Start sorting process (Insertion Sort example)
const startSorting = async () => {
  toggleButtons(true);
  isSorting = true;

  await insertionSort(insertionSortArray);

  // After sorting, color bars light green progressively
  const bars = document.querySelectorAll(".array-bar");
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = "lightgreen";
    await sleep(); // Add delay while coloring bars
  }

  toggleButtons(false);
  isSorting = false;
};

// Insertion Sort Algorithm
const insertionSort = async (array) => {
  const bars = document.querySelectorAll(".array-bar");
  const n = array.length;

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;

    // Highlight the current key
    bars[i].style.backgroundColor = "yellow"; // Highlight current key

    // Move elements of array[0..i-1] that are greater than key to one position ahead
    while (j >= 0 && array[j] > key) {
      bars[j].style.backgroundColor = "yellow"; // Highlight the compared element
      bars[j + 1].style.height = bars[j].style.height; // Move the bar up
      array[j + 1] = array[j]; // Move the element one position ahead
      j--;

      await sleep(); // Delay for visualization

      // Reset color after comparison
      if (j >= 0) {
        bars[j + 1].style.backgroundColor = "blue"; // Reset to default color
      }
    }

    // Place the key in its correct position
    array[j + 1] = key;
    bars[j + 1].style.height = `${key * 2}px`; // Set height for the key
    bars[j + 1].style.backgroundColor = "lightgreen"; // Color the sorted element

    // Reset the highlighted key color
    bars[i].style.backgroundColor = "blue"; // Reset the key color
  }
};

// Event listeners
sortArray.addEventListener("click", () => {
  if (!isSorting) startSorting();
});

generateArrayButton.addEventListener("click", () => {
  if (!isSorting) {
    insertionSortArray = generateRandomArray();
    displayBars(insertionSortArray);
  }
});

sizeSlider.addEventListener("change", () => {
  if (!isSorting) {
    insertionSortArray = generateRandomArray();
    displayBars(insertionSortArray);
  }
});

// Initialize array and display on page load
window.onload = () => {
  insertionSortArray = generateRandomArray();
  displayBars(insertionSortArray);
};
