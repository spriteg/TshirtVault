# T-Shirt Database Design Guidelines

## Design Approach
**System-Based Approach**: Drawing from Linear's clean data management aesthetics, Notion's intuitive CRUD patterns, and Material Design's form controls for a utility-focused inventory management application.

**Core Principles**: 
- Efficiency over decoration - prioritize quick data entry and retrieval
- Clear visual hierarchy for scan-ability
- Consistent patterns for predictable interactions
- Minimal distractions - let the data be the focus

---

## Color Palette

**Light Mode:**
- Background: 0 0% 100%
- Surface: 0 0% 98%
- Border: 220 13% 91%
- Text Primary: 222 47% 11%
- Text Secondary: 215 14% 34%
- Primary: 221 83% 53% (vibrant blue for CTAs)
- Primary Hover: 221 83% 45%
- Success: 142 71% 45% (for confirmations)
- Destructive: 0 84% 60% (for delete actions)

**Dark Mode:**
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Border: 217 33% 24%
- Text Primary: 210 40% 98%
- Text Secondary: 215 20% 65%
- Primary: 217 91% 60%
- Primary Hover: 217 91% 70%
- Success: 142 71% 45%
- Destructive: 0 84% 60%

---

## Typography

**Font Stack**: Inter (via Google Fonts CDN) for clean, modern readability
- Headings: 600 weight, tight tracking
- Body: 400 weight
- Labels: 500 weight, uppercase with letter spacing
- Data/Numbers: 500 weight for emphasis

**Scale**:
- Page Title: text-2xl (24px)
- Section Headers: text-lg (18px)
- Body/Forms: text-base (16px)
- Table Data: text-sm (14px)
- Labels: text-xs uppercase (12px)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, and 12 consistently
- Component padding: p-6
- Section gaps: gap-8
- Form field spacing: space-y-4
- Table cell padding: p-4
- Button padding: px-4 py-2

**Container**: max-w-7xl mx-auto px-4 for main content area

---

## Component Library

### A. Navigation
- Top navigation bar with app title "T-Shirt Inventory"
- Dark background (bg-surface) with border-b
- Height: h-16
- Add New T-Shirt button prominently placed (top-right)

### B. Forms
**Add/Edit T-Shirt Form**:
- Modal overlay (backdrop blur)
- Card-style form container with rounded-lg and shadow
- Input fields for:
  - Size (dropdown: XS, S, M, L, XL, XXL)
  - Color (text input with color picker or predefined options)
- Labels above inputs (text-xs uppercase tracking-wide)
- Input styling: border, rounded-md, focus:ring-2 focus:ring-primary
- Action buttons at bottom: Cancel (ghost) + Save (primary)

### C. Data Display
**T-Shirt Table**:
- Full-width responsive table with sticky header
- Columns: Size | Color | Color Preview | Actions
- Color Preview: Small rounded square (w-8 h-8) showing actual color
- Alternating row backgrounds for scan-ability
- Hover state on rows (subtle bg change)
- Action buttons per row: Edit (icon) + Delete (icon, destructive)

**Empty State**: 
- Centered message with illustration concept
- "No t-shirts recorded yet" heading
- "Add your first t-shirt to get started" subtext
- Primary CTA button

### D. Buttons
- Primary: bg-primary text-white rounded-md with hover state
- Secondary/Ghost: border border-border with hover bg-surface
- Icon buttons: p-2 rounded hover:bg-surface
- Destructive: text-destructive hover:bg-destructive/10

### E. Filters/Search
- Search bar above table (w-full md:w-64)
- Filter chips for sizes (pill-shaped, toggleable)
- Clear filters button when active

### F. Feedback
- Toast notifications for success/error (top-right)
- Confirmation dialog for delete actions
- Loading states for async operations

---

## Animations
**Minimal Usage**:
- Smooth transitions on hover states (transition-colors duration-200)
- Modal fade-in (opacity and scale)
- No scroll animations or excessive motion

---

## Images
**No hero images required** - this is a data-focused utility application. Icons only:
- Use Heroicons (via CDN) for all UI icons
- Plus icon for "Add New"
- Pencil icon for Edit
- Trash icon for Delete
- Filter icon for filter controls
- Search icon in search input

---

## Responsive Behavior
- Desktop (lg+): Full table with all columns visible
- Tablet (md): Compact table, consider stacking some info
- Mobile (base): Card-based layout instead of table, stack form fields vertically

---

## Accessibility
- Consistent dark mode across all inputs and forms
- High contrast ratios (WCAG AA minimum)
- Focus indicators on all interactive elements
- Keyboard navigation support
- ARIA labels for icon-only buttons