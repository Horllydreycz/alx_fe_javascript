const quotes = [
  {
    quote1:
      "The secret of business is to know something that nobody else knows.",
    category: "Business",
    author: "Aristotle Onassis",
  },
  {
    quote2: "The sole meaning of life is to serve humanity.",
    category: "Humanity",
    author: "Leo Tolstoy",
  },
  {
    quote3: "The important thing is to never stop questioning.",
    category: "Science",
    author: "Albert Einstein",
  },
];

function showRandomQuote() {
  if (quotes.length === 0) {
    console.log("No quotes available. Please add one.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  console.log(randomQuote);
}
showRandomQuote();
function createAddQuoteForm() {
  document.createElement("form");
}
createAddQuoteForm();
