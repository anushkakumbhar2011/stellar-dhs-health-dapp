# DHS Design System - Visual Reference Guide

## 🎨 Color Palette

### Primary (Indigo)
- **Main**: `#6366F1` - Buttons, links, primary actions
- **Light**: `#E0E7FF` - Backgrounds, hover states, CID boxes
- **Soft**: `#A5B4FC` - Muted text, secondary elements
- **Dark**: `#4F46E5` - Text in colored backgrounds

### Accent (Pink)
- **Main**: `#FF6B9D` - Highlights, notifications, CTAs
- **Light**: `#FFE4EC` - Subtle backgrounds
- **Soft**: `#FF8FB5` - Hover states

### Secondary (Teal)
- **Main**: `#06B6D4` - Health-related elements
- **Light**: `#CFFAFE` - Backgrounds

### Status Colors
- **Success**: `#10B981` (Green) - Verified, completed
- **Warning**: `#F59E0B` (Amber) - Pending, caution
- **Error**: `#EF4444` (Red) - Failed, danger
- **Info**: `#3B82F6` (Blue) - Information, active

---

## 🧩 Component Patterns

### Buttons
```css
/* Primary Button */
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);

/* Secondary Button */
background: white;
border: 2px solid #E0E7FF;
color: #6366F1;

/* Accent Button */
background: linear-gradient(135deg, #FF6B9D 0%, #FB7185 100%);
box-shadow: 0 4px 14px rgba(255, 107, 157, 0.35);
```

### Cards
```css
background: white;
border: 2px solid #E0E7FF;
border-radius: 16px;
box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);

/* Hover */
box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
transform: translateY(-4px);
border-color: #E0E7FF;
```

### Status Badges
```css
/* Verified */
background: #D1FAE5;
color: #10B981;
border: 2px solid #6EE7B7;

/* Pending */
background: #FEF3C7;
color: #F59E0B;
border: 2px solid #FCD34D;

/* With pulsing dot */
&::before {
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px currentColor;
}
```

### CID/Code Boxes
```css
background: #E0E7FF;
border: 2px solid #6366F1;
color: #4F46E5;
font-family: 'SF Mono', monospace;
font-weight: 500;
border-radius: 12px;
```

---

## 📐 Spacing System

Based on 8px grid:
- `--space-1`: 8px
- `--space-2`: 16px
- `--space-3`: 24px
- `--space-4`: 32px
- `--space-5`: 40px
- `--space-6`: 48px

---

## 🔤 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;
```

### Headings
- **H1**: 34px / 700 weight
- **H2**: 28px / 600 weight
- **H3**: 22px / 600 weight
- **H4**: 18px / 600 weight
- **Body**: 15px / 400 weight

### Text Colors
- **Primary**: `#1E1B4B` (Deep Indigo)
- **Secondary**: `#4338CA` (Medium Indigo)
- **Tertiary**: `#6366F1` (Indigo)
- **Muted**: `#A5B4FC` (Soft Indigo)

---

## 🎭 Animations

### Hover Effects
```css
transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-4px);
```

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}
```

### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

## 🎯 Usage Examples

### Landing Page
- **Header**: Gradient background (#6366F1 → #8B5CF6)
- **Hero**: White background with indigo text
- **Stats**: White cards with colored values
- **CTA**: Gradient background with white text

### Dashboard
- **Sidebar**: White with indigo active states
- **Cards**: White with colored borders
- **Stats**: Colored icons with white backgrounds
- **Upload Zone**: Dashed indigo border

### Record Details
- **Proof Card**: Gradient background
- **CID Display**: Indigo background
- **Verification Badge**: Green with pulsing dot
- **Actions**: Gradient buttons

---

## ✨ Key Principles

1. **No Gray**: Use colored alternatives (indigo/lavender)
2. **High Contrast**: Ensure readability (WCAG AA)
3. **Vibrant**: Soft pastels, not washed out
4. **Professional**: Medical + premium aesthetic
5. **Consistent**: Same patterns across all pages
6. **Animated**: Smooth transitions and hover effects
7. **Accessible**: Focus states and reduced motion support

---

## 🚀 Quick Reference

### Most Used Colors
- Background: `#F8F9FE` (Soft Lavender)
- Card: `#FFFFFF` (White)
- Border: `#E0E7FF` (Light Lavender)
- Primary: `#6366F1` (Indigo)
- Text: `#1E1B4B` (Deep Indigo)

### Most Used Patterns
- Card hover: `translateY(-4px)` + colored shadow
- Button: Gradient background + colored shadow
- Badge: Colored background + pulsing dot
- Code: Indigo background + monospace font

---

**Last Updated**: April 29, 2026
