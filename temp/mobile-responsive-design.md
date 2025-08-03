# Mobile-First Responsive Design Specifications

## Mobile Design Strategy

### Mobile-First Philosophy
**Why Mobile-First for Health Tools:**
- 70% of health information searches happen on mobile devices
- Users often complete health assessments during commutes or downtime
- Touch-based interactions can be more engaging than mouse clicks
- Mobile completion rates are often higher due to focused attention

**Design Priorities:**
1. **Thumb-Friendly Navigation:** All interactive elements within comfortable reach
2. **Single-Column Layouts:** Reduce cognitive load and scrolling complexity
3. **Large Touch Targets:** Minimum 44px for all tappable elements
4. **Fast Loading:** Optimized for slower mobile connections
5. **Readable Typography:** Clear fonts at mobile-appropriate sizes

## Breakpoint Strategy

### Responsive Breakpoints
```css
/* Mobile First Approach */
/* Base styles: 320px - 767px */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }

/* Specific Device Considerations */
@media (max-width: 320px) { /* Small phones */ }
@media (min-width: 768px) and (max-width: 1023px) { /* Tablet range */ }
@media (orientation: landscape) { /* Landscape optimizations */ }
```

### Device-Specific Optimizations

#### Small Phones (320px - 375px)
- Single-column layouts only
- Compressed header design
- Simplified navigation
- Larger font sizes (18px minimum for body text)
- Generous white space between sections

#### Standard Mobile (375px - 414px)
- Standard mobile layout
- Normal spacing and typography
- Full feature set available
- Optimized slider controls

#### Large Phones (414px - 768px)
- Enhanced layouts with more content visible
- Two-column sections where appropriate
- Standard desktop features available

#### Tablets (768px - 1024px)
- Hybrid mobile/desktop experience
- Side-by-side content blocks
- Enhanced visualizations
- Desktop-style navigation

## Mobile Landing Page Design

### Above-the-Fold Mobile Layout
```
┌─────────────────────────────────┐
│ [☰] BioTwin Research    [Badge] │
├─────────────────────────────────┤
│                                 │
│      Explore Your Heart         │
│      Health Future              │
│      ══════════════             │
│                                 │
│   See how lifestyle changes     │
│   could impact your             │
│   cardiovascular risk           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Start 5-Minute Assessment │ │ (60px height)
│ └─────────────────────────────┘ │
│                                 │
│   ✓ Research-based              │
│   ✓ Educational only            │
│   ✓ Privacy protected           │
│                                 │
│     [Preview visualization]     │
└─────────────────────────────────┘
```

### Mobile How It Works Section
```
┌─────────────────────────────────┐
│        How It Works             │
│        ═══════════              │
│                                 │
│    ┌─────────────────────┐      │
│    │        [1]          │      │
│    │     Answer          │      │
│    │    Questions        │      │
│    │                     │      │
│    │    3 minutes        │      │
│    │   simple inputs     │      │
│    └─────────────────────┘      │
│              ↓                  │
│    ┌─────────────────────┐      │
│    │        [2]          │      │
│    │     Explore         │      │
│    │    Scenarios        │      │
│    │                     │      │
│    │    Instant          │      │
│    │   what-if analysis  │      │
│    └─────────────────────┘      │
│              ↓                  │
│    ┌─────────────────────┐      │
│    │        [3]          │      │
│    │      Share          │      │
│    │     Results         │      │
│    │                     │      │
│    │    Optional         │      │
│    │  feedback & learn   │      │
│    └─────────────────────┘      │
│                                 │
│ ┌─────────────────────────────┐ │
│ │      Try It Now - Free      │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Mobile Form Design

### Mobile Form Best Practices

#### Input Field Specifications
```css
.mobile-input {
  height: 48px; /* Comfortable touch target */
  font-size: 16px; /* Prevents zoom on iOS */
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid #E2E8F0;
  width: 100%;
  box-sizing: border-box;
}

.mobile-input:focus {
  border-color: #2B5CE6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(43, 92, 230, 0.1);
}
```

#### Mobile-Optimized Input Types
- **Number inputs:** `type="number"` with `pattern="[0-9]*"` for iOS
- **Select dropdowns:** Custom styled with large touch targets
- **Radio buttons:** 44px minimum click area
- **Checkboxes:** Large visual indicators with text labels

### Mobile Form Flow

#### Step 1: Basic Information (Mobile)
```
┌─────────────────────────────────┐
│ ← Step 1 of 3          ●●○     │
├─────────────────────────────────┤
│                                 │
│      Basic Information          │
│      ═══════════════            │
│                                 │
│ Age (years)                     │
│ ┌─────────────────────────────┐ │
│ │         45                  │ │ (48px height)
│ └─────────────────────────────┘ │
│ ⓘ Used for age-related risk     │
│                                 │
│ Gender                          │
│ ┌─────────────────────────────┐ │
│ │ ○ Male   ○ Female   ○ Other │ │ (56px height)
│ └─────────────────────────────┘ │
│                                 │
│ Height                          │
│ ┌─────────┐  ┌─────────┐       │
│ │    5    │ft│    8    │in     │ (48px each)
│ └─────────┘  └─────────┘       │
│                                 │
│ Weight                          │
│ ┌─────────────────────────────┐ │
│ │         170          lbs    │ │ (48px height)
│ └─────────────────────────────┘ │
│                                 │
│ Activity Level                  │
│ ┌─────────────────────────────┐ │
│ │ ○ Sedentary (desk job)      │ │ (Each option
│ │ ○ Lightly active            │ │  52px height)
│ │ ○ Moderately active         │ │
│ │ ○ Very active               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │        Continue             │ │ (56px height)
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

#### Mobile Slider Design (What-If Scenarios)
```
┌─────────────────────────────────┐
│ Exercise Frequency              │
│ Current: Lightly Active         │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ None ●────────○────○ Daily  │ │ (Track: 8px height,
│ └─────────────────────────────┘ │  Handle: 24px)
│                                 │
│ → Change to "Moderately Active" │
│   could reduce risk by 3%       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │        Apply Change         │ │ (48px height)
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Mobile Results Visualization

### Mobile Risk Meter Design
```
┌─────────────────────────────────┐
│     Your Cardiovascular Risk    │
│     ══════════════════════      │
│                                 │
│  ┌─────────────────────────────┐ │
│  │                             │ │
│  │     MODERATE RISK           │ │
│  │        18%                  │ │ (Large, prominent)
│  │                             │ │
│  │ ┌─────────────────────────┐ │ │
│  │ │●●●●●●●○○○○○○○○○○○○○○○○○│ │ │ (Horizontal bar)
│  │ │Low    Moderate    High  │ │ │
│  │ └─────────────────────────┘ │ │
│  │                             │ │
│  │  Similar people your age:   │ │
│  │        12-25%               │ │
│  └─────────────────────────────┘ │
│                                 │
│   Key Contributing Factors:     │
│   • Age (45): Moderate impact   │
│   • Activity: Moderate impact   │
│   • Family History: High impact │
│                                 │
│ ┌─────────────────────────────┐ │
│ │    Explore What-If Scenarios│ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Mobile What-If Comparison
```
┌─────────────────────────────────┐
│      What-If Scenarios          │
│      ═══════════════            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  CURRENT RISK    NEW RISK   │ │
│ │                             │ │
│ │      18%           12%      │ │ (Large numbers)
│ │   Moderate         Low      │ │
│ │                             │ │
│ │        ↓ 6% reduction       │ │
│ └─────────────────────────────┘ │
│                                 │
│              versus             │
│                                 │
│ Exercise: Lightly Active        │
│ ┌─────────────────────────────┐ │
│ │ ●─────────○─────────○       │ │ (Large slider)
│ └─────────────────────────────┘ │
│ None    Moderate    Daily       │
│                                 │
│ → Change impact: -3% risk       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │      See All Changes        │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## Mobile Performance Optimization

### Loading Strategy
**Critical Path Rendering:**
1. Above-the-fold CSS inline
2. Hero section images optimized (WebP format)
3. JavaScript loaded asynchronously
4. Progressive enhancement for advanced features

**Image Optimization:**
```html
<picture>
  <source media="(max-width: 767px)" srcset="hero-mobile.webp">
  <source media="(min-width: 768px)" srcset="hero-desktop.webp">
  <img src="hero-fallback.jpg" alt="Risk visualization preview">
</picture>
```

### Mobile-Specific Features

#### Touch Interactions
- **Swipe gestures:** For form navigation and scenario comparison
- **Pinch-to-zoom:** Disabled on form elements to prevent accidental zoom
- **Touch feedback:** Visual response to all touch interactions
- **Pull-to-refresh:** Reload assessment data if needed

#### iOS-Specific Optimizations
```css
/* Prevent zoom on input focus */
input[type="number"] {
  font-size: 16px;
}

/* Remove iOS input styling */
input, textarea {
  -webkit-appearance: none;
  border-radius: 0;
}

/* Safe area handling for iPhone X+ */
.header {
  padding-top: env(safe-area-inset-top);
}
```

#### Android-Specific Optimizations
```css
/* Better select styling on Android */
select {
  background-image: url('dropdown-arrow.svg');
  background-repeat: no-repeat;
  background-position: right 12px center;
}

/* Material Design ripple effects */
.button {
  position: relative;
  overflow: hidden;
}
```

## Mobile Navigation & UX

### Mobile Navigation Patterns

#### Form Navigation
- **Progress indicators:** Always visible at top
- **Back button:** Consistent placement and behavior
- **Skip options:** For optional sections
- **Save progress:** Auto-save on mobile data connections

#### Results Navigation
- **Tab navigation:** Between risk overview, scenarios, insights
- **Sticky headers:** Keep section context visible while scrolling
- **Quick actions:** Share and export prominently placed

### Mobile Error Handling

#### Form Validation
- **Inline validation:** Immediate feedback without page refresh
- **Error states:** Clear visual indicators and helpful messaging
- **Recovery options:** Easy correction without data loss
- **Network errors:** Graceful degradation and retry options

#### Accessibility on Mobile

#### Touch Accessibility
- **Minimum 44px touch targets:** Follow Apple/Google guidelines
- **High contrast mode:** Support system accessibility settings
- **Voice input:** Compatible with voice-to-text features
- **Screen reader support:** Proper heading structure and ARIA labels

#### Motor Accessibility
- **Large buttons:** Easy to tap accurately
- **Generous spacing:** Prevent accidental taps
- **Alternative inputs:** Voice commands where possible
- **Gesture alternatives:** Button alternatives to swipe gestures

## Testing Strategy for Mobile

### Device Testing Matrix
**Priority Devices:**
- iPhone 12/13/14 (iOS 15+)
- Samsung Galaxy S21/S22 (Android 11+)
- Google Pixel 6/7 (Android 12+)
- iPad (Safari)
- Older devices: iPhone 8 (iOS 14), Samsung Galaxy S10

**Browser Testing:**
- Mobile Safari (iOS)
- Chrome Mobile (Android)
- Samsung Internet
- Firefox Mobile
- Edge Mobile

### Performance Testing
**Mobile Performance Targets:**
- First Contentful Paint: <2.5 seconds
- Largest Contentful Paint: <4 seconds
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms

**Testing Tools:**
- Google PageSpeed Insights
- WebPageTest (mobile simulation)
- Lighthouse mobile audits
- Real device testing with throttled connections