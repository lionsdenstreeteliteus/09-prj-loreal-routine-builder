// Filter and display products by category and search
function filterAndDisplayProducts() {
  const category = categoryFilter.value;
  const search = document
    .getElementById("productSearch")
    .value.trim()
    .toLowerCase();
  let filtered = allProducts;
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search))
    );
  }
  displayProducts(filtered);
}
/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductsList = document.getElementById("selectedProductsList");

/* Track selected products globally
   Using a Set to store product IDs makes lookups fast and avoids duplicates */
const SELECTED_PRODUCTS_KEY = "loreal_selected_products";
const selectedProducts = new Set();

// Load selections from localStorage on page load
function loadSelectedProductsFromStorage() {
  const saved = localStorage.getItem(SELECTED_PRODUCTS_KEY);
  if (saved) {
    try {
      const arr = JSON.parse(saved);
      arr.forEach((id) => selectedProducts.add(id));
    } catch (e) {
      // ignore parse errors
    }
  }
}

// Save current selections to localStorage
function saveSelectedProductsToStorage() {
  localStorage.setItem(
    SELECTED_PRODUCTS_KEY,
    JSON.stringify(Array.from(selectedProducts))
  );
}

/* Store all products for reference */
let allProducts = [];

/* Keep the conversation messages in memory on the client so
   we can send context to the model. */
const messages = [
  {
    role: "system",
    content:
      "You are a helpful skincare expert for L'Oréal. Only answer questions about skincare routines, products, and beauty advice. Stay on topic and use the full conversation history for context. If the user asks about something else, politely guide them back to skincare. When generating a routine, use the selected products and their categories as context. Format the routine as clear, concise bullet points for each step.",
  },
];

/* Show initial placeholder until user selects a category */

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card" data-product-id="${product.id}" data-product-name="${product.name}" data-product-brand="${product.brand}" data-product-image="${product.image}" data-product-description="${product.description}">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
        <button class="info-btn" aria-label="View details for ${product.name}">
          <i class="fas fa-circle-info"></i> Details
        </button>
      </div>
    </div>
  `
    )
    .join("");

  /* Add click event listeners to all product cards for selection */
  const cards = productsContainer.querySelectorAll(".product-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      /* Prevent selection toggle if info button is clicked */
      if (!e.target.closest(".info-btn")) {
        toggleProductSelection(card);
      }
    });

    /* Add click listener for info button */
    const infoBtn = card.querySelector(".info-btn");
    if (infoBtn) {
      infoBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openProductModal(card);
      });
    }
  });
}

/* Open product modal with full description */
function openProductModal(card) {
  const productName = card.getAttribute("data-product-name");
  const productBrand = card.getAttribute("data-product-brand");
  const productImage = card.getAttribute("data-product-image");
  const productDescription = card.getAttribute("data-product-description");

  /* Create modal HTML */
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close" aria-label="Close modal">
        <i class="fas fa-times"></i>
      </button>
      <div class="modal-body">
        <img src="${productImage}" alt="${productName}" class="modal-image">
        <div class="modal-text">
          <p class="modal-brand">${productBrand}</p>
          <h2 class="modal-title">${productName}</h2>
          <p class="modal-description">${productDescription}</p>
        </div>
      </div>
    </div>
  `;

  /* Add modal to page */
  document.body.appendChild(modal);

  /* Trigger animation */
  setTimeout(() => modal.classList.add("active"), 10);

  /* Close modal on overlay click */
  const overlay = modal.querySelector(".modal-overlay");
  overlay.addEventListener("click", () => closeProductModal(modal));

  /* Close modal on close button click */
  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.addEventListener("click", () => closeProductModal(modal));

  /* Close modal on Escape key */
  const handleEscape = (e) => {
    if (e.key === "Escape") {
      closeProductModal(modal);
      document.removeEventListener("keydown", handleEscape);
    }
  };
  document.addEventListener("keydown", handleEscape);
}

/* Close product modal with fade out animation */
function closeProductModal(modal) {
  modal.classList.remove("active");
  setTimeout(() => {
    modal.remove();
  }, 300);
}

/* Filter and display products when category changes */
function toggleProductSelection(card) {
  const productId = card.getAttribute("data-product-id");
  const productName = card.getAttribute("data-product-name");
  const productBrand = card.getAttribute("data-product-brand");
  const productImage = card.getAttribute("data-product-image");

  /* Check if product is already selected */
  if (selectedProducts.has(productId)) {
    /* Remove from selection */
    selectedProducts.delete(productId);
    card.classList.remove("selected");
  } else {
    /* Add to selection */
    selectedProducts.add(productId);
    card.classList.add("selected");
  }
  saveSelectedProductsToStorage();
  /* Update the selected products list display */
  updateSelectedProductsList();
}

/* Render the list of selected products with remove buttons */
function updateSelectedProductsList() {
  if (selectedProducts.size === 0) {
    selectedProductsList.innerHTML = `
      <p class="empty-state">No products selected yet. Click on a product card to add it!</p>
    `;
    return;
  }

  // Group selected products by category
  const selectedData = Array.from(selectedProducts)
    .map((productId) => allProducts.find((p) => p.id == productId))
    .filter(Boolean);

  if (selectedData.length === 0) {
    selectedProductsList.innerHTML = `
      <p class="empty-state">No products selected yet. Click on a product card to add it!</p>
    `;
    return;
  }

  // Group by category
  const grouped = {};
  selectedData.forEach((product) => {
    if (!grouped[product.category]) grouped[product.category] = [];
    grouped[product.category].push(product);
  });

  // Build HTML for each category group
  let html = "";
  Object.keys(grouped).forEach((cat) => {
    html += `<div class="selected-category-group">
      <div class="selected-category-label">${
        cat.charAt(0).toUpperCase() + cat.slice(1)
      }</div>
      <div class="selected-category-tags">`;
    grouped[cat].forEach((product) => {
      html += `
        <div class="product-tag">
          <span>${product.name}</span>
          <button class="remove-btn" data-product-id="${product.id}" aria-label="Remove ${product.name}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
    });
    html += `</div></div>`;
  });
  // Add clear all button if there are any selections
  if (Object.keys(grouped).length > 0) {
    html += `<button id="clearSelectedProducts" class="clear-btn">Clear All</button>`;
  }
  selectedProductsList.innerHTML = html;

  // Add click handlers to remove buttons
  const removeButtons = selectedProductsList.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute("data-product-id");
      // Find and toggle the card to deselect it (if visible), otherwise just remove from set
      const card = productsContainer.querySelector(
        `[data-product-id="${productId}"]`
      );
      if (card) {
        toggleProductSelection(card);
      } else {
        selectedProducts.delete(productId);
        saveSelectedProductsToStorage();
        updateSelectedProductsList();
      }
    });
  });

  // Add click handler for clear all button
  const clearBtn = document.getElementById("clearSelectedProducts");
  if (clearBtn) {
    clearBtn.onclick = () => {
      selectedProducts.clear();
      saveSelectedProductsToStorage();
      updateSelectedProductsList();
      // Remove selected class from all cards
      document
        .querySelectorAll(".product-card.selected")
        .forEach((card) => card.classList.remove("selected"));
    };
  }
}

/* Helper: Collect selected product data */
function getSelectedProductData() {
  return Array.from(selectedProducts)
    .map((productId) => allProducts.find((p) => p.id == productId))
    .filter(Boolean);
}

/* Generate Routine button handler */
const generateBtn = document.getElementById("generateRoutine");
if (generateBtn) {
  generateBtn.addEventListener("click", generateRoutineWithAI);
}

/* Main function to generate routine using OpenAI API directly */
async function generateRoutineWithAI() {
  if (selectedProducts.size === 0) {
    addMessageBubble(
      "Please select at least one product before generating a routine!",
      "assistant"
    );
    return;
  }

  const selectedProductData = getSelectedProductData();
  if (selectedProductData.length === 0) {
    addMessageBubble(
      "Unable to load product data. Please try again.",
      "assistant"
    );
    return;
  }

  // Build the prompt
  const productList = selectedProductData
    .map((p) => `- ${p.name} (${p.brand}, ${p.category}): ${p.description}`)
    .join("\n");
  const userPrompt = `Based on these selected L'Oréal products, create a personalized skincare routine:\n\n${productList}\n\nProvide a clear, step-by-step routine with morning and evening steps as applicable.`;

  // Add user message to chat and conversation history
  addMessageBubble(
    `Generate routine for ${selectedProductData.length} product(s)`,
    "user"
  );
  messages.push({ role: "user", content: userPrompt });

  // Show loading indicator in chat
  const loadingId = `loading-${Date.now()}`;
  const loadingBubble = document.createElement("div");
  loadingBubble.className = "chat-bubble assistant";
  loadingBubble.id = loadingId;
  loadingBubble.textContent = "Generating your personalized routine...";
  chatWindow.appendChild(loadingBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Call Cloudflare Worker endpoint with full conversation history
    const response = await fetch(
      "https://rapid-smoke-3f7b.mkamal21.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
        }),
      }
    );

    const data = await response.json();
    const assistantContent =
      data?.choices?.[0]?.message?.content ??
      "Unable to generate routine. Please try again.";

    // Remove loading bubble
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();
    addMessageBubble(assistantContent, "assistant");
    messages.push({ role: "assistant", content: assistantContent });
  } catch (err) {
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();
    addMessageBubble(
      "Error generating routine. Please check your network connection.",
      "assistant"
    );
    console.error("Cloudflare Worker error:", err);
  }
}

/* Filter and display products when category changes */

/* Load all products on page load for later reference */
loadProducts().then((products) => {
  allProducts = products;
  displayProducts(products); // Show all products by default
  loadSelectedProductsFromStorage();
  updateSelectedProductsList();
  // Add search and filter listeners
  const searchInput = document.getElementById("productSearch");
  if (searchInput) {
    searchInput.addEventListener("input", filterAndDisplayProducts);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterAndDisplayProducts);
  }
});

/* Helper function to add a message bubble to the chat window
   Supports both user messages (right-aligned gradient) and 
   assistant responses (left-aligned with brand colors) */
function addMessageBubble(message, sender = "user") {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  if (typeof message === "string") {
    // Format bullet points as a list if present
    if (/^(\s*[-*]\s)/m.test(message)) {
      // Split into lines, wrap bullet points in <li>, others in <p>
      const lines = message.split(/\n/);
      let inList = false;
      let html = "";
      for (let line of lines) {
        if (/^\s*[-*]\s/.test(line)) {
          if (!inList) {
            html += "<ul>";
            inList = true;
          }
          html += `<li>${line.replace(/^\s*[-*]\s/, "")}</li>`;
        } else if (line.trim() === "") {
          if (inList) {
            html += "</ul>";
            inList = false;
          }
          html += "<br>";
        } else {
          if (inList) {
            html += "</ul>";
            inList = false;
          }
          html += `<p>${line}</p>`;
        }
      }
      if (inList) html += "</ul>";
      bubble.innerHTML = html;
    } else {
      bubble.innerHTML = message.replace(/\n/g, "<br>");
    }
  } else {
    bubble.innerHTML = JSON.stringify(message, null, 2);
  }
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Chat form submission handler - placeholder for OpenAI integration
   For now shows a placeholder; will integrate with OpenAI API */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  /* Get the input field and extract user message */
  const inputField = document.getElementById("userInput");
  const userMessage = inputField.value.trim();

  if (!userMessage) return;

  /* Display user message in chat */
  addMessageBubble(userMessage, "user");

  /* Add user message to conversation history */
  messages.push({
    role: "user",
    content: userMessage,
  });

  /* Clear input field for next message */
  inputField.value = "";

  /* Show loading indicator */
  const loadingId = `loading-${Date.now()}`;
  const loadingBubble = document.createElement("div");
  loadingBubble.className = "chat-bubble assistant";
  loadingBubble.id = loadingId;
  loadingBubble.textContent = "Thinking...";
  chatWindow.appendChild(loadingBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  /* Send message to OpenAI API */
  sendMessageToOpenAI(loadingId);
});

/* Send messages to OpenAI API directly */
async function sendMessageToOpenAI(loadingId) {
  try {
    // Call Cloudflare Worker endpoint with full conversation history
    const response = await fetch(
      "https://rapid-smoke-3f7b.mkamal21.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messages,
        }),
      }
    );

    const data = await response.json();

    /* Extract assistant response */
    const assistantContent =
      data?.choices?.[0]?.message?.content ??
      "Unable to get response. Please try again.";

    /* Remove loading bubble */
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();

    /* Add assistant response to chat */
    addMessageBubble(assistantContent, "assistant");

    /* Add response to conversation history */
    messages.push({
      role: "assistant",
      content: assistantContent,
    });
  } catch (err) {
    /* Handle errors */
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();
    addMessageBubble(
      "Error connecting to API. Make sure your network connection is working.",
      "assistant"
    );
    console.error("Cloudflare Worker error:", err);
  }
}
