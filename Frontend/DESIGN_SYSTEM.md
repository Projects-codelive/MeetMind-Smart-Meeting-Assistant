# MeetMind Design System

## Premium Visual Identity

MeetMind's design system is inspired by elite 2026 AI SaaS products like Linear, Arc Browser, Framer, Stripe, Vercel, and Raycast. The system emphasizes premium typography, subtle motion, and refined visual hierarchy.

---

## Typography System

### Font Stack

**Heading Font:** Space Grotesk
- Modern geometric sans-serif
- Used for: Headlines, titles, navigation
- Weights: 400, 500, 600, 700
- CSS Variable: `--font-heading`
- Tailwind Class: `font-heading`

**Body Font:** Manrope
- Clean, readable sans-serif
- Used for: Body text, descriptions, UI labels
- Weights: 400, 500, 600, 700, 800
- CSS Variable: `--font-body`
- Tailwind Class: `font-body`

**Fallback Font:** Plus Jakarta Sans
- CSS Variable: `--font-plus-jakarta`

### Typography Usage Rules

```tsx
// Headings
<h1 className="font-heading text-5xl md:text-8xl font-bold tracking-tighter">
  Your meetings run themselves.
</h1>

// Subheadings
<h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter">
  Powerful Features
</h2>

// Body Text
<p className="font-body text-lg text-slate-600 leading-relaxed">
  MeetMind transcribes, summarizes, and automates every follow-up.
</p>

// Labels (uppercase, wider tracking)
<span className="font-body text-xs font-bold uppercase tracking-widest text-slate-500">
  AI Assistant
</span>

// Stats/Numbers
<span className="font-heading text-5xl font-bold tracking-tight">
  $12
</span>
```

### Letter Spacing

- **Headings:** `tracking-tighter` (-0.04em) or `tracking-tight` (-0.02em)
- **Body:** Default or `tracking-tight`
- **Labels:** `tracking-widest` for uppercase text
- **Numbers:** `tracking-tight` for sharp, impactful look

---

## Color System

### Light Premium Theme

```css
/* Backgrounds */
--background: #FFFFFF
--slate-50: #F8FAFC
--slate-100: #F1F5F9

/* Text */
--slate-900: #0F172A (Primary text)
--slate-600: #475569 (Secondary text)
--slate-500: #64748B (Muted text)

/* Accent Colors */
--blue-600: #3B82F6 (Primary accent)
--purple-600: #8B5CF6 (Secondary accent)

/* Borders */
--slate-200: #E2E8F0
```

### Usage Examples

```tsx
// Primary text
<p className="text-slate-900">

// Secondary text
<p className="text-slate-600">

// Muted text
<p className="text-slate-500">

// Backgrounds
<div className="bg-white">
<div className="bg-slate-50">
<div className="bg-slate-100">

// Borders
<div className="border border-slate-200">
```

---

## Component Styles

### Cards

```tsx
// Premium glass card
<div className="glass-card">
  {/* bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg */}
</div>

// Standard card with hover
<div className="rounded-2xl bg-white border border-slate-200 shadow-sm hover-lift">
  {/* Content */}
</div>
```

### Buttons

```tsx
// Primary button
<button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/10">
  Get Started
</button>

// Secondary button
<button className="px-6 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
  Watch Demo
</button>
```

### Shadows

```css
/* Premium shadows */
.shadow-premium {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.05);
}

.shadow-premium-lg {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 20px 25px -5px rgb(0 0 0 / 0.05);
}
```

### Glass Effect

```tsx
// Glass navigation
<nav className="glass border-b border-slate-200/60">
  {/* bg-white/70 backdrop-blur-xl */}
</nav>
```

---

## Motion & Transitions

### Principles

- Subtle, polished motion
- No flashy animations
- Duration: 300ms standard
- Easing: ease-out or spring physics

### Examples

```tsx
// Hover lift effect
<div className="hover-lift">
  {/* transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg */}
</div>

// Button hover
<button className="transition-all duration-300 hover:bg-slate-800">

// Framer Motion
<motion.div
  whileHover={{ scale: 1.03 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

---

## Spacing & Layout

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Section Padding
```tsx
<section className="py-32">
```

### Border Radius
- Small: `rounded-xl` (12px)
- Medium: `rounded-2xl` (16px)
- Large: `rounded-3xl` (24px)

---

## Utility Classes

### Custom Utilities

```css
/* Glass effect */
.glass {
  @apply bg-white/70 backdrop-blur-xl border border-slate-200;
}

.glass-card {
  @apply bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-lg;
}

/* Text gradient */
.text-gradient-blue {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text;
}

/* Hover lift */
.hover-lift {
  @apply transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg;
}
```

---

## Component Examples

### Hero Section
```tsx
<h1 className="font-heading text-5xl md:text-8xl font-bold tracking-tighter text-slate-900">
  Your meetings <br />
  <span className="text-gradient-blue">run themselves.</span>
</h1>
```

### Feature Card
```tsx
<div className="glass-card p-8 hover-lift">
  <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 tracking-tight">
    AI Transcription
  </h3>
  <p className="font-body text-slate-600 text-sm leading-relaxed">
    Convert speech to text with 99% accuracy.
  </p>
</div>
```

### Navigation Link
```tsx
<Link 
  href="/features" 
  className="font-body text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
>
  Features
</Link>
```

---

## Best Practices

1. **Always use font classes:** `font-heading` for titles, `font-body` for text
2. **Consistent spacing:** Use Tailwind's spacing scale (4, 6, 8, 10, 12, etc.)
3. **Subtle motion:** Keep transitions at 300ms with ease-out
4. **Premium shadows:** Use custom shadow utilities for consistency
5. **Glass effects:** Apply to navigation and overlay elements
6. **Border radius:** Use xl/2xl/3xl for modern, rounded corners
7. **Color hierarchy:** slate-900 → slate-600 → slate-500 for text importance

---

## Installation Notes

### Fonts
The design system uses Google Fonts for easy deployment:
- Space Grotesk (Heading)
- Manrope (Body)
- Plus Jakarta Sans (Fallback)

### Custom Font Option
To use General Sans (premium alternative):
1. Download from [Fontshare](https://www.fontshare.com/fonts/general-sans)
2. Place `GeneralSans-Variable.woff2` in `Frontend/src/app/fonts/`
3. Update `layout.tsx` to use `localFont` instead of Google Fonts

---

## References

Design inspiration:
- Linear (linear.app)
- Arc Browser (arc.net)
- Framer (framer.com)
- Stripe (stripe.com)
- Vercel (vercel.com)
- Raycast (raycast.com)
