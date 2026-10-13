---
name: frontend-engineering
description: Implement, debug, and review browser application behavior across React/Next.js, Vue/Nuxt, SvelteKit, and existing frontend stacks. Use for rendering, data flow, forms, session boundaries, performance, and interaction correctness; visual styling alone does not need this workflow.
---

# Frontend engineering

Read the actual dependency versions, router, build target, deployment adapter, and
existing data/state conventions. Select the sections relevant to the change;
a small event-handler fix does not require an architecture audit. Keep the current
stack and component contracts unless the task requires a change.

## Rendering and framework boundaries

Identify what runs at build time, per server request, during hydration, and after
client navigation. A client-designated component can still participate in initial
server rendering. Keep browser APIs out of server execution and credentials out of
client bundles, serialized props, public environment variables, and response payloads.

Keep initial server/client output compatible: account for dates, locale, randomness,
invalid HTML nesting, and browser-only preferences. Fix the mismatch rather than
hiding hydration warnings. Scope mutable user/session state to a request or instance;
module-level server state must not leak across users.

- React/Next.js: distinguish the installed router and server/client component model.
  Keep render pure; use effects for external synchronization, not derived-state loops
  or user-triggered mutations. Clean up subscriptions and respect dependency semantics.
  Check the installed version's caching, revalidation, streaming, and action contracts.
- Vue/Nuxt: preserve reactive ownership when extracting composables or destructuring
  values. Separate computed derivation from watchers with side effects. Check the
  installed version's SSR data/payload, keyed fetch, and cleanup behavior; avoid
  fetching the same initial data again just because hydration mounts the client.
- SvelteKit: distinguish server-only and universal loads, actions, and client effects.
  Keep user data out of shared server stores; account for components reused during
  navigation rather than assuming every route change remounts them.

Use version-matched official docs for variable APIs: [React](https://react.dev/learn/synchronizing-with-effects),
[Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components),
[Vue SSR](https://vuejs.org/guide/scaling-up/ssr.html), [Nuxt](https://nuxt.com/docs/4.x/getting-started/data-fetching),
and [SvelteKit](https://svelte.dev/docs/kit/state-management). Select the target version, not the newest example.

## State, fetching, and mutations

Separate server-owned data, shareable URL state, durable preferences, and local
interaction state. Derive values instead of maintaining competing copies. Use stable
identity for list items and cache entries; include relevant tenant/user/query scope.

Use existing loaders or query mechanisms when they coordinate rendering and caching.
Avoid independent-request waterfalls; preserve real dependencies and bound concurrency.
Define loading, empty, failure, stale, and retry behavior where the feature needs them.
On query changes or navigation, cancel obsolete requests where supported and prevent
late results from overwriting current state. Cancellation does not undo a server write.

For mutations, handle duplicate submission, uncertain network outcomes, and server
rejection. Optimistic state needs rollback/reconciliation; a late failure must not
undo a newer successful edit. Invalidate affected caches after confirmed changes and
clear user-scoped client state when identity changes. Choose retry/idempotency rules
with the API instead of blindly retrying writes.

For out-of-order searches, duplicate submissions, or optimistic-update races,
read [async state ownership](references/async-state.md). Apply its examples through
the existing loader/query/form API and actual framework lifecycle, rather than
installing a parallel state mechanism.

## Forms, sessions, and browser security

Use semantic forms, labels, appropriate input types/autocomplete, and native controls
where they meet the requirement. Preserve entered values on failure; associate errors
with fields, announce meaningful status, and manage focus through validation/dialogs.
Handle keyboard, pointer, composition input, and repeated actions as applicable.

Client validation improves feedback; enforce schema, authorization, and resource
ownership for protected reads and mutations. Hiding a button or guarding a route is not
an authorization boundary. Preserve the established session mechanism: verify cookie
scope/flags, expiry, logout, CSRF protection, and cross-origin behavior when affected.
Do not expose session secrets in URLs or logs. Treat HTML, markdown, redirects, and
embedded content as untrusted at their actual rendering/navigation sinks; escaping
text is not equivalent to sanitizing HTML or authorizing a destination.

## Performance and verification

Measure the affected bottleneck in a representative production build: transferred
JavaScript, request waterfalls, rendering work, long tasks, interaction latency,
layout shifts, and media/font loading. Use code splitting, caching, memoization, or
virtualization when evidence supports them; preserve keyboard and reading behavior.
Separate lab observations from field outcomes and record device/network assumptions.

Test user-observable behavior at the cheapest meaningful layer. Cover changed state
transitions and boundary failures; use real-browser integration for hydration,
navigation/history, focus, layout, and browser APIs. Include slow/out-of-order responses,
session changes, and repeat submission when affected. Mocks cannot prove server-side
authorization or cache isolation. Check keyboard access and responsive behavior for
changed interactions; report browser/platform gaps and actual performance evidence.

Verify the changed flow through its real entry point and consumer-visible states.
A passing component test does not establish server authorization, mutation
deduplication, or a deployed cache policy. Complete applicable integration and
project gates before claiming the requested behavior is fixed; state material
runtime gaps when access prevents the needed check.
