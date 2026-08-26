# STNET Radio Website Design Guidelines

## Icons

All user-interface icons on the STNET Radio Website must use **Font Awesome**.

### Required rules

- Use Font Awesome for navigation, social, platform, action, status, playback, external-link, arrow, menu, and other interface icons.
- Do not use emoji as UI icons.
- Do not use Unicode glyphs or text characters as substitutes for UI icons, including arrows such as `→`, `↗`, play symbols, circles, or manually drawn icon characters.
- Do not create CSS-drawn or HTML-span-drawn icons when an appropriate Font Awesome icon exists. This includes hamburger and close icons.
- Brand icons should use Font Awesome Brands when available, for example `fa-apple`, `fa-spotify`, `fa-facebook-f`, `fa-x-twitter`, and `fa-instagram`.
- Decorative punctuation that is part of normal text is not considered an icon. Brand typography such as `STNET Radio+` may retain its `+` character when it is text rather than an interactive icon.
- Decorative Font Awesome icons that add no additional meaning should use `aria-hidden="true"`. Icon-only interactive controls must retain an accessible text label through `aria-label` or equivalent accessible naming.

### Current library

The homepage currently loads Font Awesome Free 7.3.1 from cdnjs:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css" referrerpolicy="no-referrer" />
```

When upgrading Font Awesome, update the dependency deliberately and verify that every icon class used by the site still exists in the selected version.

## Scope

This guideline applies to new UI and to existing UI whenever that component is redesigned or materially modified. New code should not introduce a second icon library without an explicit project-level decision.
