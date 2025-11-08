# Product Descriptions & Modal Feature

## Overview

Each product card now displays a "Details" button that opens an accessible modal window showing the full product description and information.

## Features

### 1. **Details Button**

- Located at the bottom of each product card
- Gradient background (Red to Gold)
- Clear icon with "Details" label
- Hover effect with lift animation
- Text is uppercase for emphasis

### 2. **Modal Display**

The modal shows:

- **Product image** (200×200px on desktop, responsive on mobile)
- **Brand name** (uppercase, red/gold color)
- **Product name** (large, bold heading)
- **Full description** (multi-line text with proper line-height)
- **Close button** (gradient circle with X icon in top-right)

### 3. **Accessibility Features**

- **ARIA labels** on the Details button
- **Semantic HTML** with proper heading hierarchy
- **Keyboard support**:
  - Press `Escape` to close modal
  - Tab navigation works through modal elements
- **Screen reader friendly** descriptions

### 4. **Interaction Patterns**

Users can close the modal by:

1. Clicking the X button (top-right)
2. Clicking the dark overlay outside the modal
3. Pressing the `Escape` key

### 5. **Visual Feedback**

- **Smooth animations**:
  - Modal slides up from bottom on open
  - Modal slides down on close
  - Overlay fades in/out
- **Hover effects** on close button
- **Scale animation** on button click

## Code Structure

### JavaScript Functions

```javascript
/* Opens modal with product details */
openProductModal(card);

/* Closes modal with fade-out animation */
closeProductModal(modal);
```

### HTML Data Attributes

Each product card includes:

```html
data-product-description="Full product description text..."
```

### Event Handlers

- **Click Details button** → Opens modal
- **Click overlay** → Closes modal
- **Click X button** → Closes modal
- **Press Escape** → Closes modal
- **Click card (not button)** → Selects product (no modal)

## Styling

### Details Button

```css
.info-btn {
  background: linear-gradient(135deg, var(--color-red), var(--color-gold));
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.2s ease;
}

.info-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 0, 59, 0.3);
}
```

### Modal Container

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

### Content Layout

- **Desktop**: Image on left (200px), text on right (flex-based)
- **Mobile**: Image on top (100% width), text below (stacked)
- **Padding**: 32px on desktop, 24px on mobile
- **Gap**: 24px between image and text (16px on mobile)

## Animations

### Slide Up (Open)

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide Down (Close)

```css
@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(40px);
  }
}
```

## Responsive Design

### Mobile (≤600px)

- Modal width: 90% of screen
- Body layout: Stacked (flex-direction: column)
- Image: Full width, auto height
- Title: 20px (down from 24px)
- Description: 13px (down from 14px)
- Close button: Same size (40px)

### Desktop (>600px)

- Modal width: 600px max
- Body layout: Side-by-side
- Image: 200×200px (fixed)
- Title: 24px
- Description: 14px

## User Flow

1. User selects a category and views products
2. User clicks "Details" button on any product card
3. Modal opens with smooth slide-up animation
4. Modal displays:
   - Product image
   - Brand name (red/gold)
   - Product name (large heading)
   - Full description text
5. Dark overlay appears behind modal
6. User can:
   - Read the description
   - Click X to close
   - Click overlay to close
   - Press Escape to close
7. Modal closes with slide-down animation

## Future Enhancements

- Add "Add to Routine" button inside modal
- Show related products in modal
- Display reviews/ratings in modal
- Add product ingredients list (with expandable sections)
- Save to favorites from modal
- Share product via social media
- Print product details
