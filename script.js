// 1️⃣ Debounce setup
let debounceTimer;
const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const wordList = document.getElementById("wordList");
const wordCount = document.getElementById("wordCount");
const clearBtn = document.getElementById("clearBtn");
const toast = document.getElementById("copyToast");

// Attach event listener with debounce
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(smartSearch, 200);
});

searchType.addEventListener("change", smartSearch);

// 2️⃣ Smart Search Function
function smartSearch() {
  const input = searchInput.value.toLowerCase().trim();
  const type = searchType.value;

  if (!input) {
    wordList.innerHTML = '';
    wordCount.textContent = '';
    return;
  }

  const results = words.filter(word => {
    if (type === 'contains') return word.includes(input);
    if (type === 'starts') return word.startsWith(input);
    if (type === 'ends') return word.endsWith(input);
    return false;
  });

  wordCount.textContent = `Found ${results.length} words`;

  wordList.innerHTML = results
    .slice(0, 1000)
    .map(word => {
      let displayWord = word;
      if(type === 'contains') {
        const regex = new RegExp(`(${input})`, 'gi');
        displayWord = word.replace(regex, '<span class="highlight">$1</span>');
      } else if(type === 'starts') {
        displayWord = `<span class="highlight">${word.slice(0, input.length)}</span>${word.slice(input.length)}`;
      } else if(type === 'ends') {
        displayWord = `${word.slice(0, word.length - input.length)}<span class="highlight">${word.slice(-input.length)}</span>`;
      }
      return `<li>${displayWord}</li>`;
    }).join('');
}

// 3️⃣ Clear input button
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  wordList.innerHTML = "";
  wordCount.textContent = "";
  searchInput.focus();
});

// 4️⃣ Copy word when clicking on a word in the list
wordList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const text = e.target.textContent;
    navigator.clipboard.writeText(text).then(() => {
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1500);
    });
  }
});

// 5️⃣ Escape key clears input
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchInput.value = "";
    wordList.innerHTML = "";
    wordCount.textContent = "";
  }
});

// 6️⃣ Theme toggle
const themeSwitch = document.getElementById("themeSwitch");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  themeSwitch.checked = true;
}

// Toggle theme
themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }
});