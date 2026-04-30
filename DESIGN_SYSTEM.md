# DHS Design System - Apple Health Inspired

## 🎨 Color Palette

### Background Colors
```
Primary Background:   #F8FAFB  (Soft tinted white)
Secondary Background: #FFFFFF  (Pure white for cards)
Tertiary Background:  #F0F4F8  (Light gray-blue tint)
```

### Primary Colors (Soft Blue)
```
Primary:       #007AFF  (Apple blue)
Primary Light: #E5F2FF  (Soft blue tint)
Primary Soft:  #4DA3FF  (Lighter blue)
Primary Dark:  #0051D5  (Darker blue)
```

### Accent Colors (Health Green)
```
Accent:       #34C759  (Apple green)
Accent Light: #E8F8EC  (Soft green tint)
Accent Soft:  #5DD97C  (Lighter green)
```

### Secondary Colors (Medical Purple)
```
Secondary:       #5856D6  (Soft purple)
Secondary Light: #EFEFFB  (Soft purple tint)
```

### Text Colors
```
Primary:     #1C1C1E  (Almost black, high contrast)
Secondary:   #3A3A3C  (Dark gray)
Tertiary:    #8E8E93  (Medium gray)
Quaternary:  #C7C7CC  (Light gray)
```

### Border Colors
```
Light:  #E5E5EA  (Very subtle)
Medium: #D1D1D6  (Slightly more visible)
```

### Status Colors
```
Success:     #34C759  Background: #E8F8EC
Warning:     #FF9500  Background: #FFF4E5
Error:       #FF3B30  Background: #FFE5E5
Info:        #007AFF  Background: #E5F2FF
```

---

## 📐 Tailwind Config

Add this to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Background
        'dhs-bg': {
          primary: '#F8FAFB',
          secondary: '#FFFFFF',
          tertiary: '#F0F4F8',
        },
        // Primary (Blue)
        'dhs-primary': {
          DEFAULT: '#007AFF',
          light: '#E5F2FF',
          soft: '#4DA3FF',
          dark: '#0051D5',
        },
        // Accent (Green)
        'dhs-accent': {
          DEFAULT: '#34C759',
          light: '#E8F8EC',
          soft: '#5DD97C',
        },
        // Secondary (Purple)
        'dhs-secondary': {
          DEFAULT: '#5856D6',
          light: '#EFEFFB',
        },
        // Text
        'dhs-text': {
          primary: '#1C1C1E',
          secondary: '#3A3A3C',
          tertiary: '#8E8E93',
          quaternary: '#C7C7CC',
        },
        // Border
        'dhs-border': {
          light: '#E5E5EA',
          medium: '#D1D1D6',
        },
        // Status
        'dhs-success': {
          DEFAULT: '#34C759',
          bg: '#E8F8EC',
        },
        'dhs-warning': {
          DEFAULT: '#FF9500',
          bg: '#FFF4E5',
        },
        'dhs-error': {
          DEFAULT: '#FF3B30',
          bg: '#FFE5E5',
        },
        'dhs-info': {
          DEFAULT: '#007AFF',
          bg: '#E5F2FF',
        },
      },
      borderRadius: {
        'dhs-sm': '10px',
        'dhs-md': '14px',
        'dhs-lg': '18px',
        'dhs-xl': '22px',
      },
      boxShadow: {
        'dhs-card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'dhs-card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'dhs-card-active': '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)',
        'dhs-primary': '0 2px 8px rgba(0, 122, 255, 0.25)',
        'dhs-success': '0 2px 8px rgba(52, 199, 89, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## 🧩 Component Examples

### Card
```jsx
// Basic Card
<div className="bg-dhs-bg-secondary rounded-dhs-md shadow-dhs-card p-4 hover:shadow-dhs-card-hover transition-all duration-250">
  Card content
</div>

// Card with border (flat style)
<div className="bg-dhs-bg-secondary border border-dhs-border-light rounded-dhs-md p-4">
  Card content
</div>
```

### Sidebar Item

```jsx
// Inactive
<a className="flex items-center gap-3 px-4 py-3 text-dhs-text-secondary rounded-dhs-sm transition-all hover:bg-dhs-bg-tertiary hover:text-dhs-text-primary">
  <Icon size={20} />
  <span className="font-medium">Dashboard</span>
</a>

// Active
<a className="flex items-center gap-3 px-4 py-3 bg-dhs-primary-light text-dhs-primary rounded-dhs-sm font-semibold">
  <Icon size={20} />
  <span>Dashboard</span>
</a>
```

### Buttons

```jsx
// Primary Button
<button className="inline-flex items-center gap-2 px-5 py-3 bg-dhs-primary text-white rounded-dhs-sm font-semibold shadow-dhs-primary hover:bg-dhs-primary-dark hover:shadow-lg transition-all">
  Get Started
</button>

// Secondary Button
<button className="inline-flex items-center gap-2 px-5 py-3 bg-dhs-bg-secondary text-dhs-primary border-1.5 border-dhs-border-light rounded-dhs-sm font-semibold shadow-dhs-card hover:bg-dhs-primary-light hover:border-dhs-primary transition-all">
  Learn More
</button>

// Ghost Button
<button className="inline-flex items-center gap-2 px-5 py-3 bg-dhs-bg-tertiary text-dhs-text-secondary rounded-dhs-sm font-medium hover:bg-dhs-border-light hover:text-dhs-text-primary transition-all">
  Cancel
</button>

// Success Button
<button className="inline-flex items-center gap-2 px-5 py-3 bg-dhs-accent text-white rounded-dhs-sm font-semibold shadow-dhs-success hover:shadow-lg transition-all">
  Verify
</button>
```

### Status Badges

```jsx
// Verified Badge
<span className="inline-flex items-center gap-2 px-4 py-1.5 bg-dhs-success-bg text-dhs-success rounded-full text-sm font-semibold">
  <span className="w-1.5 h-1.5 bg-dhs-success rounded-full"></span>
  Verified
</span>

// Pending Badge
<span className="inline-flex items-center gap-2 px-4 py-1.5 bg-dhs-warning-bg text-dhs-warning rounded-full text-sm font-semibold">
  <span className="w-1.5 h-1.5 bg-dhs-warning rounded-full"></span>
  Pending
</span>

// Error Badge
<span className="inline-flex items-center gap-2 px-4 py-1.5 bg-dhs-error-bg text-dhs-error rounded-full text-sm font-semibold">
  <span className="w-1.5 h-1.5 bg-dhs-error rounded-full"></span>
  Failed
</span>

// Info Badge
<span className="inline-flex items-center gap-2 px-4 py-1.5 bg-dhs-info-bg text-dhs-info rounded-full text-sm font-semibold">
  <span className="w-1.5 h-1.5 bg-dhs-info rounded-full"></span>
  Active
</span>
```

### File/CID Card (Refined)

```jsx
// Light, refined CID box
<div className="bg-dhs-bg-tertiary border border-dhs-border-light rounded-dhs-sm p-3">
  <div className="flex items-center justify-between">
    <span className="text-xs font-medium text-dhs-text-tertiary uppercase tracking-wide">IPFS CID</span>
    <button className="p-1 hover:bg-dhs-border-light rounded transition-colors">
      <Copy size={14} className="text-dhs-text-tertiary" />
    </button>
  </div>
  <code className="block mt-2 text-sm font-mono text-dhs-text-secondary break-all">
    QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5
  </code>
</div>

// Primary highlighted CID box
<div className="bg-dhs-primary-light border border-dhs-primary rounded-dhs-sm p-3">
  <div className="flex items-center justify-between">
    <span className="text-xs font-semibold text-dhs-primary uppercase tracking-wide">IPFS CID</span>
    <button className="p-1 hover:bg-dhs-primary/10 rounded transition-colors">
      <Copy size={14} className="text-dhs-primary" />
    </button>
  </div>
  <code className="block mt-2 text-sm font-mono text-dhs-primary-dark break-all font-medium">
    QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5
  </code>
</div>
```

### Metric Card (Apple Health style)

```jsx
<div className="bg-dhs-bg-secondary rounded-dhs-md shadow-dhs-card p-4 hover:shadow-dhs-card-hover transition-all">
  <div className="text-xs font-semibold text-dhs-text-tertiary uppercase tracking-wide mb-2">
    Total Records
  </div>
  <div className="text-3xl font-bold text-dhs-text-primary mb-1">
    127
  </div>
  <div className="text-sm font-semibold text-dhs-success">
    ↑ 12% from last month
  </div>
</div>
```

### Input Field

```jsx
<input 
  type="text"
  placeholder="Search records..."
  className="w-full px-4 py-3 bg-dhs-bg-secondary border-1.5 border-dhs-border-light rounded-dhs-sm text-dhs-text-primary placeholder:text-dhs-text-tertiary focus:border-dhs-primary focus:ring-4 focus:ring-dhs-primary-light transition-all"
/>
```

---

## 🎯 Design Principles

### 1. **Soft Backgrounds**
- Use `#F8FAFB` for main background (not pure white)
- Use `#FFFFFF` for cards to create elevation
- Use `#F0F4F8` for subtle sections

### 2. **Subtle Shadows**
- Cards: `shadow-dhs-card` (very subtle)
- Hover: `shadow-dhs-card-hover` (gentle lift)
- Active: `shadow-dhs-card-active` (prominent)

### 3. **Rounded Components**
- Small: `10px` (buttons, inputs)
- Medium: `14px` (cards)
- Large: `18px` (modals)
- Pills: `100px` (badges)

### 4. **High Contrast Text**
- Primary text: `#1C1C1E` (almost black)
- Never use pure gray on gray
- Ensure WCAG AA compliance

### 5. **Calm Colors**
- Primary: Soft blue (#007AFF)
- Accent: Health green (#34C759)
- Avoid harsh neon or dark crypto colors

### 6. **Smooth Transitions**
- Use `transition-all duration-250` for most interactions
- Use cubic-bezier for scale animations
- Subtle hover states (lift + shadow)

---

## ✅ Checklist

- [ ] Replace all gray backgrounds with soft tinted whites
- [ ] Update sidebar active state to use `bg-dhs-primary-light`
- [ ] Add subtle shadows to all cards
- [ ] Update buttons to use new color system
- [ ] Refine status badges with dot indicators
- [ ] Lighten CID/hash display boxes
- [ ] Ensure all text has high contrast
- [ ] Add smooth transitions to interactive elements
- [ ] Test on light mode (primary use case)
- [ ] Verify WCAG AA compliance

---

**Result:** Clean, premium, medical-grade UI inspired by Apple Health 🏥✨
