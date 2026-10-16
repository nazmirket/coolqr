# Interface QA: follow the user's intent through the system

Use the real app and current build. Identify a critical journey with an actor,
starting state, action and independent expected result. Record the tested browser,
viewport, data and revision. Keep fixtures synthetic unless real data use is authorized.

## Exercise states that can contradict a screenshot

For search, send query A, then B, deliver B first and A last. B must remain visible.
For save, double-submit and retry after a simulated uncertain response; observe
server state through a separate read. A disabled button is not deduplication.
For session changes, switch identity while a request is pending; previous-user data
must not populate the new view. For navigation, deep-link, reload and use Back.
Do not replace real persistence or authorization with a successful mocked response
when those are the claimed boundary.

For a dialog, open with keyboard, inspect its name and initial focus, cycle focus,
close with Escape where supported, and check sensible focus restoration. If the
invoking item was deleted, select the next logical destination. Test outside
content is not operable during a modal. The [W3C dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
explains behavior and exceptions; it is not a declaration that a particular
implementation works with every assistive technology.

Include meaningful empty, loading, rejected, disconnected and retry states. Check
real long content, keyboard visibility, text enlargement and reduced motion.
A narrow desktop browser is useful layout evidence, not physical touch/safe-area
or screen-reader acceptance. Match native apps to their platform test tools.

## Check the public page as delivered

For a changed public page or launch review, open the built route by its real URL,
including direct entry and relevant error/fallback routes. Check the affected
document title, description, canonical and share metadata against the project's
content and search requirements; inspect the rendered share preview when it is
part of the deliverable. Verify real links and actions, critical image/font/media
loading, reserved media space and readable fallback content at target widths.
Exercise the locales and browser/device support named by the project. Measure
loading or layout-shift claims on a representative build rather than accepting
fixed third-party size or time thresholds as universal launch gates.

The [pinned Front-End Checklist](https://github.com/thedaviddias/Front-End-Checklist/tree/e8d14d049010e2ce25afcd5e8609dfcbbe63e47e)
can help locate a relevant HTML, CSS, JavaScript, media, accessibility, SEO or
performance category. Select checks from the changed page and its actual
requirements; do not treat every item or priority label as applicable. Use the
project's authoritative standards and current platform documentation for details.

## Produce evidence that points to a fix

For visual comparison, use a baseline tied to the agreed requirement or an
inspected previous artifact. Keep browser/OS rendering, viewport, pixel ratio,
fonts, data, theme and state comparable when they affect the result. Wait for
meaningful readiness such as loaded fonts and settled data; arbitrary delays can
hide a race. Mask only known nondeterministic regions with an explained reason,
never the content under test. Inspect the actual difference before updating a
snapshot or widening tolerance. A baseline refreshed from a broken layout merely
records the regression.

Pixel differences can locate a change; they do not decide whether it improves
hierarchy or satisfies the brief. Check long content and an affected responsive
state, and use `interface-design` for a craft judgment. Test motion separately
through playback and interruption because stable screenshot tools often disable
it. Automated accessibility tools identify a subset of detectable issues; pair
their findings with the keyboard and relevant assistive-technology journey.

Use the project's tests and actual browser tools. Capture assertions, errors and
motion samples for relevant local scenarios. Use a focused project test or
controlled service to inject races and observe backend persistence. Never fabricate
an available tool or weaken an assertion to fit the collector.

A useful finding states: exact build/context, reproduction, expected vs observed
behavior, affected users/consequence, and evidence path. Separate requirement
failure, accessibility barrier, visual craft issue, preference and unverified path.
Fix the source cause; replay the original failure plus an adjacent normal journey.
Review same-state before/after captures when evaluating a visual revision. Keep
functional correctness, visual acceptance and accessibility coverage separate.
