const quoteBtn = document.getElementById("newQuote");
const quotesDisplay = document.getElementById("quoteDisplay");
const newText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const newQuoteAuthor = document.getElementById("newQuoteAuthor");

const quotes = [
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

function showRandomQuote() {
  if (quotes.length === 0) {
    quotesDisplay.textContent = "No quotes available. Please add one.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Format the quote as HTML
  quotesDisplay.innerHTML = `
    <blockquote>
      <p>"${randomQuote.text}"</p>
      <footer>— ${randomQuote.author} <em>(${randomQuote.category})</em></footer>
    </blockquote>
  `;
}

function createAddQuoteForm() {
  const form = document.createElement("form");

  // Quote input
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a quote";
  quoteInput.required = true;

  // Author input
  const authorInput = document.createElement("input");
  authorInput.type = "text";
  authorInput.placeholder = "Enter author name";
  authorInput.required = true;

  // Category input
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter a category";
  categoryInput.required = true;

  // Submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  form.appendChild(quoteInput);
  form.appendChild(authorInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    quotes.push({
      text: quoteInput.value.trim(),
      author: authorInput.value.trim(),
      category: categoryInput.value.trim(),
    });
    form.reset();
    alert("Quote added successfully!");
  });

  return form;
}

// Event listener - just call showRandomQuote directly
if (quoteBtn) {
  quoteBtn.addEventListener("click", showRandomQuote);
}

function addQuote() {
  /*const newText = prompt("Enter the quote text:");
  const newAuthor = prompt("Enter the author name:");
  const newCategory = prompt("Enter the category:");
  */
  const newTextValue = newText.value.trim();
  const newCategoryValue = newQuoteCategory.value.trim();
  const newQuoteAuthorValue = newQuoteAuthor.value.trim();
  if (newTextValue && newQuoteAuthorValue && newCategoryValue) {
    quotes.push({
      text: newTextValue,
      author: newQuoteAuthorValue,
      category: newCategoryValue,
    });
    alert("Quote added successfully!");
    newText.textContent = "";
    newQuoteAuthor.innerHTML = "";
    newQuoteCategory.innerHTML = "";
    showRandomQuote(); // Display the new quote
  }
}
function saveQuoteToLocalStorage() {
  try {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  } catch (error) {
    console.error("Error saving quotes to local storage:", error);
    alert("Failed to save quotes. Storage might be full.");
  }
}
saveQuoteToLocalStorage();
