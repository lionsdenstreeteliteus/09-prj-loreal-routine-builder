# L'Oréal Routine Builder — Design System

## Brand Colors (Dynamic CSS Variables)

All colors are defined in `style.css` using CSS custom properties (variables) for easy customization:

### Primary Colors

- **Passionate Red** — `--color-red: #FF003B`
  - Primary action color
  - Used in buttons, borders, gradients
- **Eternal Gold** — `--color-gold: #E3A535`
  - Accent color
  - Used in hover states, gradients
- **Iconic Black** — `--color-black: #000000`
  - Text and neutral elements
- **Radiant White** — `--color-white: #FFFFFF`
  - Backgrounds and cards

### Supporting Colors

- **Text Dark** — `--color-text-dark: #1a1a1a`
- **Text Light** — `--color-text-light: #666666`
- **Background Light** — `--color-bg-light: #f9f7f7`
- **Border** — `--color-border: #e8e4e4`

### Semantic Aliases

- `--color-primary` → Passionate Red
- `--color-accent` → Eternal Gold
- `--color-neutral` → Iconic Black

## Visual Features

### Gradients

- **Brand Gradient**: Red to Gold linear gradient used for buttons and headings
- **Background Gradient**: White to light neutral gradient for full-page background

### Shadows & Depth

- **Subtle Shadow**: `0 2px 8px rgba(0, 0, 0, 0.06)` — cards at rest
- **Elevated Shadow**: `0 12px 32px rgba(255, 0, 59, 0.15)` — cards on hover
- **Button Shadow**: `0 4px 12px rgba(255, 0, 59, 0.2)` — interactive elements

### Animations

- **Slide In**: Chat bubbles animate in with slight upward movement
- **Hover Lift**: Product cards and buttons translate up on hover
- **Smooth Transitions**: All interactive elements use `0.3s ease`

### Typography

- **Font Family**: Montserrat (Google Fonts)
- **Weights**: 500 (regular), 600 (semi-bold), 700 (bold)
- **Sizes**: Responsive, scaling from 15px to 28px

## Component Styles

### Header

- Large gradient title with red-to-gold blend
- Red border bottom for visual separation
- Subtle red background gradient

### Product Cards

- Full-width image with brand gradient background
- Hover effect: Lift with enhanced shadow
- Accent bar appears on top on hover
- Smooth transitions

### Chat Bubbles

- **User**: Red-to-gold gradient with white text
- **Assistant**: Light background with subtle border
- Rounded corners (20px) for friendly appearance
- Slide-in animation

### Buttons

- Red-to-gold gradient background
- Elevated shadows with hover lift effect
- Uppercase text with letter spacing
- Smooth transitions

### Forms

- Focused inputs show red border with subtle glow
- Smooth transitions between states
- Color-coded brand styling

## How to Customize

To change the entire brand palette, edit the `:root` variables in `style.css`:

```css
:root {
  --color-red: #YOUR_COLOR;
  --color-gold: #YOUR_ACCENT;
  /* ... rest of colors ... */
}
```

All components will automatically update throughout the site!

## Accessibility

- High contrast ratios for text readability
- Focus states clearly visible with colored borders and glows
- Semantic HTML with proper ARIA labels
- Smooth animations respect `prefers-reduced-motion` (can be enhanced)
