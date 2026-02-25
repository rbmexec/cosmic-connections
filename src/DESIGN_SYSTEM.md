# Cosmic Connections Design System

> Reference for AI-generated components. Read this before creating any new screen.

---

## 1. Design Tokens

All colors defined via `@theme` in `globals.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-cosmic-bg` | `#020617` | Page background |
| `--color-cosmic-card` | `#0f172a` | Card backgrounds |
| `--color-cosmic-border` | `rgba(100,116,139,0.2)` | Default borders |
| `--color-mode-personal` | `#a78bfa` | Personal mode (purple) |
| `--color-mode-attraction` | `#f97316` | Attraction mode (orange) |
| `--color-mode-business` | `#10b981` | Business mode (green) |
| `--color-mode-partner` | `#ec4899` | Partner mode (pink) |
| `--color-mode-messages` | `#6366f1` | Messages mode (indigo) |
| `--color-element-metal` | `#94a3b8` | Metal element |
| `--color-element-water` | `#3b82f6` | Water element |
| `--color-element-wood` | `#22c55e` | Wood element |
| `--color-element-fire` | `#ef4444` | Fire element |
| `--color-element-earth` | `#a16207` | Earth element |
| `--color-amber-accent` | `#fbbf24` | Primary accent |

Tailwind usage: `text-mode-personal`, `bg-amber-accent`, `border-element-water`, etc.

---

## 2. Glass Card System

Three tiers with increasing opacity and blur:

| Tier | Class | When to Use |
|------|-------|-------------|
| **Default** | `glass-card` | Content cards, list items, sections |
| **Strong** | `glass-card-strong` | Modals, important overlays, emphasis panels |
| **Subtle** | `glass-card-subtle` | Banners, secondary info, inline highlights |

```css
/* default */  background: rgba(15,23,42,0.65); blur(24px) saturate(1.5); border: 1px solid rgba(148,163,184,0.1);
/* strong */   background: rgba(15,23,42,0.8);  blur(32px) saturate(1.8); border: 1px solid rgba(148,163,184,0.15);
/* subtle */   background: rgba(15,23,42,0.45); blur(16px) saturate(1.3); border: 1px solid rgba(148,163,184,0.08);
```

Always pair with `rounded-2xl` (or `rounded-[28px]` for hero cards).

**Using the `<GlassCard>` primitive:**
```tsx
import { GlassCard } from "@/components/ui";

<GlassCard tier="default" className="p-4">Content</GlassCard>
<GlassCard tier="strong" className="p-6">Modal content</GlassCard>
<GlassCard as="button" onClick={handleClick}>Clickable card</GlassCard>
```

---

## 3. CSS Utility Classes

### Gradient Texts
- `text-gradient-cosmic` — purple -> pink -> orange (for branding, titles)
- `text-gradient-gold` — amber -> yellow -> dark amber (for premium, scores)

### Photo Overlays
- `photo-gradient` — Strong bottom-to-top fade (for card photos)
- `photo-gradient-subtle` — Lighter fade
- `photo-gradient-deep` — Deepest fade with top vignette

### Glows (per mode)
- `glow-personal` / `glow-attraction` / `glow-business` / `glow-partner` / `glow-messages`
- Applied via `box-shadow`, use on focused/active cards

### Effects
- `shimmer` — Horizontal shimmer sweep (3s infinite)
- `pulse-glow` — Pulsing opacity + scale (2s infinite)
- `card-stack-shadow` — Multi-layer depth shadow

### Tags & Badges
- `cosmic-tag` — Pill shape: `padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 600`
- `premium-badge` — Gold gradient pill: `font-size: 9px; font-weight: 800`

### Scrollbar
- `scrollbar-hide` — Hides scrollbar cross-browser

---

## 4. Animation Standards

### Spring Configs

| Name | Config | Use For |
|------|--------|---------|
| **Snappy** | `{ type: "spring", stiffness: 400, damping: 17 }` | Buttons, toggles, small interactions |
| **Smooth** | `{ type: "spring", stiffness: 300, damping: 25 }` | Modals, panels, large elements |
| **Stiff** | `{ type: "spring", stiffness: 400, damping: 30 }` | Layout animations, tab indicators |

### Hover/Tap Patterns

```tsx
// Buttons — subtle
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.97 }}

// Icon buttons — pronounced
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.9 }}

// Large action buttons (swipe actions)
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.92 }}
```

### Entry/Exit Patterns

```tsx
// Overlay fade
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}

// Card stack transition
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9, y: -20 }}
transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}

// Modal pop-in
initial={{ scale: 0.5, opacity: 0, y: 60 }}
animate={{ scale: 1, opacity: 1, y: 0 }}
exit={{ scale: 0.5, opacity: 0, y: 60 }}
transition={{ type: "spring", stiffness: 300, damping: 25 }}
```

### Stagger Delays

```tsx
// List items
transition={{ delay: index * 0.05 }}

// Cascading sections
transition={{ delay: 0.1 }} // first
transition={{ delay: 0.2 }} // second
```

---

## 5. Typography Scale

| Level | Classes | Use For |
|-------|---------|---------|
| **Page title** | `text-lg font-bold text-white` | Overlay headers, section titles |
| **Card title** | `text-2xl font-bold text-white` | Profile names |
| **Section header** | `text-[9px] text-slate-500 uppercase tracking-wider font-semibold` | Section labels |
| **Section header (amber)** | `text-[10px] uppercase tracking-[0.15em] font-bold text-amber-400` | Feature sections with icon |
| **Body** | `text-sm text-slate-200` | Primary content |
| **Secondary** | `text-xs text-slate-400` | Descriptions, metadata |
| **Micro** | `text-[11px] text-slate-400` | Counters, timestamps |
| **Tiny** | `text-[10px] text-slate-600` | Taglines, footer text |

### Color Hierarchy
1. `text-white` — Primary headings, names
2. `text-slate-200` — Important body text
3. `text-slate-400` — Secondary, descriptions
4. `text-slate-500` — Labels, micro text
5. `text-slate-600` — Subtle footer text
6. `text-amber-400` — Accent, feature highlights
7. `text-purple-400` — Cosmic/premium accents

---

## 6. Component Conventions

- Every component starts with `"use client";`
- Icons: `lucide-react` only, sizes 12-20px
- Cards: `rounded-2xl` standard, `rounded-[28px]` for hero/full cards
- Border pattern: `border border-slate-700/50` or `border border-{color}-400/20`
- Spacing: `p-4` standard, `p-6` for modals, `p-8` for hero content
- Container: `max-w-lg mx-auto px-4`

---

## 7. Subscription Gating

```tsx
import { useSubscription } from "@/lib/subscription-context";

const { features, isPro, isCosmicPlus } = useSubscription();

// Gate a feature
if (!features.someFlag) {
  return (
    <button onClick={() => onUpgradeRequired("featureName")}
      className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-amber-400/20 hover:border-amber-400/40 transition-colors">
      <Lock size={12} className="text-amber-400" />
      <span className="text-xs text-amber-400 font-semibold">Unlock Feature</span>
    </button>
  );
}
```

Key feature flags: `dailyForecast`, `cosmicBlueprint`, `myCircle`, `icebreakerComments`, `retrogradeAlerts`, `discoveryFilters`, `compatibilityQuiz`, `eventsRsvp`, `voiceNotes`, `videoIntros`, `videoCall`, `compatibilityReport`, `referrals`.

---

## 8. Data Access

```tsx
import { sampleProfiles } from "@/data/profiles";        // 20 profiles, IDs "1"-"20"
import { calculateCompatibility } from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";

// currentUser is passed as a prop from page.tsx
// openUpgrade (trigger?: string) => void is the upgrade modal trigger
```

---

## 9. Shared Primitives Reference

All primitives: `import { GlassCard, CosmicButton, FullScreenOverlay, SectionHeader, Badge, IconButton } from "@/components/ui";`

### `<GlassCard>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tier` | `"default" \| "strong" \| "subtle"` | `"default"` | Glass tier |
| `as` | `"div" \| "button"` | `"div"` | Clickable card (adds hover/tap) |
| `className` | `string` | `""` | Additional classes |

### `<CosmicButton>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger" \| "cosmic"` | `"primary"` | Visual style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `icon` | `ReactNode` | — | Icon before text |
| `fullWidth` | `boolean` | `false` | Full width |
| `disabled` | `boolean` | `false` | Disabled state |

Variants: `primary` = amber gradient, `secondary` = border, `ghost` = minimal, `danger` = red, `cosmic` = purple gradient.

### `<FullScreenOverlay>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Visibility |
| `onClose` | `() => void` | — | Close handler |
| `title` | `string` | — | Header title |
| `titleIcon` | `ReactNode` | — | Icon next to title |
| `variant` | `"standard" \| "fullscreen"` | `"standard"` | Backdrop style |

### `<SectionHeader>`
Renders the `text-[9px] text-slate-500 uppercase tracking-wider font-semibold` pattern.

### `<Badge>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "amber" \| "purple" \| "green" \| "red" \| "blue" \| "pink"` | `"default"` | Color |

### `<IconButton>`
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | — | The icon |
| `label` | `string` | — | Aria label |

The `w-8 h-8 rounded-full` icon button pattern with hover animation.

---

## 10. Overlay Registration

To add a new screen as an overlay:

```tsx
// 1. Create your component: src/components/MyNewScreen.tsx
"use client";
import { GlassCard, CosmicButton, SectionHeader, Badge } from "@/components/ui";

interface MyNewScreenProps {
  onClose: () => void;  // always provided by OverlayOutlet
  // ... your props
}

export default function MyNewScreen({ onClose, ...props }: MyNewScreenProps) {
  return (
    <div className="space-y-4">
      <SectionHeader>Section Title</SectionHeader>
      <GlassCard className="p-4">
        <p className="text-sm text-slate-200">Content here</p>
        <Badge variant="amber">Tag</Badge>
      </GlassCard>
      <CosmicButton variant="primary" fullWidth>
        Action
      </CosmicButton>
    </div>
  );
}

// 2. Register in src/overlays/index.ts (add 1 line):
registerOverlay("myNewScreen", {
  component: lazy(() => import("@/components/MyNewScreen")),
  title: "My New Screen",
  titleIcon: createElement(Sparkles, { size: 18, className: "text-amber-400" }),
});

// 3. Open from anywhere:
const { openOverlay } = useOverlay();
openOverlay("myNewScreen", { /* props */ });
```

No changes to `page.tsx`. No i18n edits for prototypes (use hardcoded English).

---

## Component Template: View Screen

```tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { GlassCard, CosmicButton, SectionHeader, Badge } from "@/components/ui";

interface MyViewProps {
  onClose: () => void;
}

export default function MyView({ onClose }: MyViewProps) {
  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <GlassCard tier="strong" className="p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles size={24} className="text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">Title</h3>
          <p className="text-sm text-slate-400">Subtitle here</p>
        </motion.div>
      </GlassCard>

      {/* Content Section */}
      <div>
        <SectionHeader>Section Label</SectionHeader>
        <div className="mt-2 space-y-2">
          {[1, 2, 3].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Item {item}</p>
                  <p className="text-xs text-slate-400">Description</p>
                </div>
                <Badge variant="purple">Label</Badge>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action */}
      <CosmicButton variant="primary" fullWidth>
        Primary Action
      </CosmicButton>
    </div>
  );
}
```
