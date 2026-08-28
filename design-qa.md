# Design QA Report

## Comparison Target

- Source visual truth: `design-reference/option-2-selected.png`
- Browser-rendered implementation: `screenshots/group-portfolio-desktop-cloud.jpg`
- Side-by-side comparison: `screenshots/design-qa-comparison.png`
- Source pixels: `1487 × 1058`
- Implementation screenshot pixels: `1348 × 926`
- CSS viewport: `1363 × 936`
- Device density: `1×`
- Normalization: the source was proportionally resized and north-cropped to `1348 × 926` before the two images were placed in one comparison canvas.
- State: desktop hero, dark theme, animations settled, default navigation state.

## Findings

No actionable P0, P1, or P2 differences remain after the comparison-and-fix iteration.

- Fonts and typography: the implementation preserves the source's oversized white/violet headline, compact uppercase chapter labels, strong member-name hierarchy, and readable secondary text. Mike's and Van Yowrick's longer roles wrap intentionally without colliding with adjacent content.
- Spacing and layout rhythm: the header, centered headline, three equal vertical chapters, portrait row, profile buttons, collaboration banner, and Davao location marker follow the selected composition. Each member keeps equal visual weight.
- Colors and visual tokens: deep navy, cyan, violet, magenta, luminous lines, subtle borders, and low-opacity night imagery consistently map to the source direction and maintain readable contrast.
- Image quality and asset fidelity: Angel, Mike, and Van Yowrick use their supplied photographs, optimized into responsive WebP assets without changing their content.
- Copy and content: all three supplied profiles remain separate and complete. Facebook and Instagram names supplied without URLs are displayed as text rather than fabricated links.
- Icons and controls: the interface uses a consistent Phosphor icon family with aligned stroke weight and practical button targets.
- Responsiveness and accessibility: tablet horizontal scroll-snap, mobile stacked chapters, a mobile menu, focus styles, semantic headings, alt text, and reduced-motion rules are present. Responsive and reduced-motion fallbacks are covered by automated source checks; the selected source visual itself provides only a desktop reference.

## Full-View Comparison Evidence

The combined comparison image shows the source on the left and the browser-rendered implementation on the right. Both use the same hierarchy: restrained header, one dominant statement, three equal member chapters, luminous team signal, Davao night backdrop, rounded profile actions, and a shared-work footer banner. The implementation replaces the source's pending Member 2 and Member 3 treatments with Mike's and Van Yowrick's real supplied names, roles, and photographs.

## Focused Region Comparison Evidence

A separate focused crop was not required after the full-view image was opened at original detail. The headline, all three portrait treatments, chapter labels, member names, profile buttons, signal line, collaboration banner, and location marker were readable at the comparison size. The collaboration banner was also inspected in a dedicated browser crop during the iteration.

## Comparison History

### Iteration 1

- Earlier finding: `[P2]` The collaboration banner and location marker fell partly below a `1363 × 936` browser viewport, changing the source's above-the-fold composition.
- Fix: added a height-aware desktop layout in `src/styles/responsive.css` that reduces hero padding, portrait scale, visual-row height, and signal height only when the desktop viewport is shorter than `981px`.
- Post-fix evidence: the revised browser capture places the collaboration banner at `y=769–821` and the location marker above `y=849`, fully inside the `936px` viewport. The second side-by-side comparison shows all primary hero content above the fold.

### Iteration 2

- Change: replaced the pending third chapter with Van Yowrick's supplied profile and photograph while preserving the selected three-column composition.
- Post-change evidence: the final hero capture shows three named photographic profiles with equal chapter widths, consistent portrait sizing, intact signal animation, and no `Photo pending` label.

## Primary Interactions Tested

- Desktop navigation and three `View profile` actions are present and keyboard-addressable.
- Mike's `View profile` action updates the URL to `#profile-mike` and lands the target section at approximately `51px` below the viewport top after smooth scrolling.
- Van Yowrick's `View profile` action updates the URL to `#profile-member-3`, lands the target section approximately `49px` below the viewport top, and displays all 12 supplied skills.
- Angel's supplied external project and Facebook links are rendered; Mike's and Van Yowrick's emails are actionable; their unverified social names remain non-links.
- Team-signal and page motion settle without obscuring controls.

## Console Errors Checked

- No page-origin application errors or warnings were reported during the cloud-browser inspection.
- The browser host extension logged metadata messages from its own `chrome-extension://` URL; these are outside the portfolio application and do not affect the page.
- Desktop layout inspection found no horizontal document overflow.

## Open Questions

- Direct Facebook and Instagram URLs for Mike and Van Yowrick were not supplied, so those entries remain display-only.

## Implementation Checklist

- [x] Preserve the selected three-column chapter structure.
- [x] Give Angel, Mike, and Van Yowrick equal visual importance.
- [x] Keep all three supplied profiles separate and complete.
- [x] Keep all styling in external CSS.
- [x] Verify the production build and automated tests.
- [x] Compare the source and implementation in one visual input.
- [x] Re-capture and re-check after the P2 viewport fix.
- [x] Re-capture and re-check after completing Chapter 03.

## Follow-up Polish

- `[P3]` Add direct Facebook and Instagram links if the members provide verified URLs.

final result: passed
