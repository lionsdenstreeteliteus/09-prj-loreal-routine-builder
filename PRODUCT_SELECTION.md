# Product Selection Feature

## Overview

Users can now select and deselect products by clicking on product cards. Selected products are visually highlighted and appear in a dedicated "Selected Products" section.

## Features

### 1. **Click to Select/Deselect**

- Click any product card to select it
- Click again to deselect it
- Selection state is tracked in a JavaScript `Set` for fast lookups

### 2. **Visual Feedback**

Selected product cards display:

- **3px red border** (Passionate Red)
- **Glowing shadow effect** with red highlight
- **Gradient top bar** becomes fully visible
- Smooth transition animations

### 3. **Selected Products Section**

Below the product grid, a dedicated section shows:

- **Product tags** with the brand gradient (Red to Gold)
- **Remove button** (X) on each tag for quick deselection
- **Empty state message** when no products are selected
- **Slide-in animation** as tags are added

### 4. **Product Tag Design**

Each selected product tag includes:

- Product name (truncated if too long)
- Semi-transparent white remove button
- Hover effect with opacity increase
- Smooth scale animation on interaction

### 5. **Remove from List**

Users can remove products in two ways:

1. Click the product card again to deselect
2. Click the X button on the product tag

Both methods sync the selection state instantly.

## Code Structure

### JavaScript

- **`selectedProducts`** (Set) — Stores product IDs for fast O(1) lookups
- **`toggleProductSelection(card)`** — Adds/removes product from selection
- **`updateSelectedProductsList()`** — Renders tags and update the UI

### HTML Data Attributes

Each product card stores metadata:

```html
<div
  class="product-card"
  data-product-id="..."
  data-product-name="..."
  data-product-brand="..."
  data-product-image="..."
></div>
```

### CSS Classes

- **`.selected`** — Applied to selected product cards
- **`.product-tag`** — Styled container for each selected product
- **`.remove-btn`** — Close button styling
- **`.empty-state`** — Placeholder text styling

## Styling

### Selected Card

```css
.product-card.selected {
  border: 3px solid var(--color-primary);
  box-shadow: 0 0 0 4px rgba(255, 0, 59, 0.15), 0 12px 32px rgba(255, 0, 59, 0.15);
}
```

### Product Tag

```css
.product-tag {
  background: linear-gradient(
    135deg,
    var(--color-red) 0%,
    var(--color-gold) 100%
  );
  border-radius: 20px;
  padding: 8px 12px;
  animation: slideIn 0.3s ease;
}
```

## User Experience Flow

1. User selects a category from dropdown
2. Product grid displays with cards
3. User clicks a card → Card highlights with border & glow
4. Selected product appears as a tag in the list below
5. User can:
   - Click card again to deselect
   - Click X on tag to remove
   - Click multiple cards to build a collection
6. Empty state shows until first selection

## Future Enhancements

- Save selected products to localStorage
- Generate routine based on selected products using OpenAI API
- Reorder selected products via drag-and-drop
- Export selected routine as PDF
