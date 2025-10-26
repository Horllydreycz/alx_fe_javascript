// DOM Elements
const quoteBtn = document.getElementById("newQuote");
const quotesDisplay = document.getElementById("quoteDisplay");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFileInput = document.getElementById("importFile");

// Default quotes
const defaultQuotes = [
  {
    text: "The secret of business is to know something that nobody else knows.",
    category: "Business",
    author: "Aristotle Onassis",
  },
  {
    text: "The sole meaning of life is to serve humanity.",
    category: "Humanity",
    author: "Leo Tolstoy",
  },
  {
    text: "The important thing is to never stop questioning.",
    category: "Science",
    author: "Albert Einstein",
  },
];

// Initialize quotes array from local storage or use defaults
let quotes = loadQuotesFromLocalStorage();

// Load quotes from local storage
function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    try {
      return JSON.parse(storedQuotes);
    } catch (error) {
      console.error("Error parsing quotes from local storage:", error);
      return [...defaultQuotes];
    }
  }
  return [...defaultQuotes];
}

// Save quotes to local storage
function saveQuotesToLocalStorage() {
  try {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    console.log("Quotes saved to local storage");
  } catch (error) {
    console.error("Error saving quotes to local storage:", error);
    alert("Failed to save quotes. Storage might be full.");
  }
}

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quotesDisplay.innerHTML = "<p>No quotes available. Please add one.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quotesDisplay.innerHTML = `
    <blockquote>
      <p>"${randomQuote.text}"</p>
      <footer>— ${randomQuote.author} <em>(${randomQuote.category})</em></footer>
    </blockquote>
  `;

  // Save last displayed quote to session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Add a new quote
function addQuote() {
  const newText = prompt("Enter the quote text:");
  if (!newText || !newText.trim()) return;

  const newAuthor = prompt("Enter the author name:");
  if (!newAuthor || !newAuthor.trim()) return;

  const newCategory = prompt("Enter the category:");
  if (!newCategory || !newCategory.trim()) return;

  const newQuote = {
    text: newText.trim(),
    author: newAuthor.trim(),
    category: newCategory.trim(),
  };

  quotes.push(newQuote);
  saveQuotesToLocalStorage();
  populateCategories();

  alert("Quote added successfully!");

  quotesDisplay.innerHTML = `
        <blockquote>
          <p>"${newQuote.text}"</p>
          <footer>— ${newQuote.author} <em>(${newQuote.category})</em></footer>
        </blockquote>
      `;

  updateQuoteInfo(getFilteredQuotes().length);
}
// Export quotes to JSON file
function exportQuotes() {
  if (quotes.length === 0) {
    alert("No quotes to export!");
    return;
  }

  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `quotes_${new Date().toISOString().slice(0, 10)}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
  alert("Quotes exported successfully!");
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      // Validate the imported data
      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid format: Expected an array of quotes");
      }

      // Validate each quote has required fields
      const isValid = importedQuotes.every(
        (quote) => quote.text && quote.author && quote.category
      );

      if (!isValid) {
        throw new Error(
          "Invalid quote format: Each quote must have text, author, and category"
        );
      }

      // Ask user if they want to replace or merge
      const shouldReplace = confirm(
        `Import ${importedQuotes.length} quotes?\n\nOK = Replace existing quotes\nCancel = Merge with existing quotes`
      );

      if (shouldReplace) {
        quotes = importedQuotes;
      } else {
        quotes = [...quotes, ...importedQuotes];
      }

      saveQuotesToLocalStorage();
      alert(`Successfully imported ${importedQuotes.length} quotes!`);
      showRandomQuote();
    } catch (error) {
      console.error("Error importing quotes:", error);
      alert(`Failed to import quotes: ${error.message}`);
    }

    // Reset file input
    event.target.value = "";
  };

  reader.onerror = function () {
    alert("Failed to read file");
    event.target.value = "";
  };

  reader.readAsText(file);
}

// Load last displayed quote from session storage on page load
function loadLastQuoteFromSession() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    try {
      const quote = JSON.parse(lastQuote);
      quotesDisplay.innerHTML = `
        <blockquote>
          <p>"${quote.text}"</p>
          <footer>— ${quote.author} <em>(${quote.category})</em></footer>
        </blockquote>
      `;
      return true;
    } catch (error) {
      console.error("Error loading last quote from session:", error);
    }
  }
  return false;
}

// Event Listeners
if (quoteBtn) {
  quoteBtn.addEventListener("click", showRandomQuote);
}

if (addQuoteBtn) {
  addQuoteBtn.addEventListener("click", addQuote);
}

if (exportBtn) {
  exportBtn.addEventListener("click", exportQuotes);
}

if (importBtn && importFileInput) {
  importBtn.addEventListener("click", function () {
    importFileInput.click();
  });

  importFileInput.addEventListener("change", importQuotes);
}

// Initialize: Load last quote from session or show random quote
if (!loadLastQuoteFromSession()) {
  showRandomQuote();
}

// Display quote count on load
console.log(`Loaded ${quotes.length} quotes from local storage`);
function populateCategories() {
  const categories = ["all"];
  const uniqueCategories = new Set();

  quotes.forEach((quote) => {
    if (quote.category && quote.category.trim()) {
      uniqueCategories.add(quote.category.trim());
    }
  });
}
const sortedCategories = Array.from(uniqueCategories).sort();
categories.push(...sortedCategories);

categoryFilter.innerHTML = "";

categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category === "all" ? "All Categories" : category;
  categoryFilter.appendChild(option);
});
const lastFilter = loadLastSelectedFilter();
categoryFilter.value = lastFilter;

function getFilteredQuotes() {
  const selectedCategory = categoryFilter.value;

  if (selectedCategory === "all") {
    return quotes;
  }

  return quotes.filter((quote) => quote.category === selectedCategory);
}
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  saveLastSelectedFilter(selectedCategory);

  const filteredQuotes = getFilteredQuotes();

  if (filteredQuotes.length === 0) {
    quotesDisplay.innerHTML = `<p>No quotes available in the "${selectedCategory}" category.</p>`;
    updateQuoteInfo(0);
    return;
  }
}
populateCategories();
