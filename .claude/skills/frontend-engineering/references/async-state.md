# Async state ownership and observable recovery

Read for stale results, duplicate mutations, or optimistic state that can race.
Begin with the installed framework and existing query/form mechanism. The examples
explain invariants; do not add a parallel request or state library to reproduce them.

## Worked search race

A user types `ca`, then `cat`. Request B for `cat` finishes before request A for
`ca`. Aborting A may save work, but the provider or an already resolved task may
ignore cancellation. Only the current request is allowed to publish results or
errors. Its ownership includes the query, tenant/identity, and component lifetime.

The following framework-neutral JavaScript sketch makes that decision explicit.
Use equivalent behavior from the project's loader/query API when available:

```javascript
function createLatestSearch(fetchResults, publish) {
  let generation = 0;
  let controller = null;
  let disposed = false;

  return {
    async search(query) {
      if (disposed) return;
      const current = ++generation;
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;
      publish({ status: "pending", query });
      try {
        const results = await fetchResults(query, {
          signal: requestController.signal,
        });
        if (disposed || current !== generation) return;
        publish({ status: "success", query, results });
      } catch (error) {
        if (disposed || current !== generation || requestController.signal.aborted) return;
        publish({ status: "error", query, error });
      } finally {
        if (current === generation) controller = null;
      }
    },
    dispose() {
      disposed = true;
      ++generation;
      controller?.abort();
      controller = null;
    },
  };
}
```

Connect disposal to the actual lifecycle, and invalidate ownership when identity
or scope changes; recreating a helper on every render can defeat it. Define empty
query, retained results, pending announcements, and debounce behavior from the
existing product contract. Debouncing limits requests but does not resolve their
ordering. Guard stale errors and loading cleanup as well as successful data.

Use manually controlled promises to finish B before A, then fail an obsolete
request while a newer one is pending. Assert the visible query/results/error and
pending state stay with the newer owner. Resolve a request after disposal and
check that nothing publishes. Test cancellation that is ignored by the provider;
a mock that always honors abort can conceal the original race.

## Worked duplicate submission

A user double-clicks submit, or presses Enter while a click handler also sends
the form. Verify that the native submit path has one owner and acquires the
pending guard before any awaited work. Preserve field values and permit a
deliberate later submission after a definitive outcome. Disabling a button alone
does not prevent another tab, another client, or a network retry.

The server/API owns any required idempotency and resource authorization. A
timeout after send is an unknown outcome; clearing the guard and automatically
resending with a new key may repeat the write. Use the contract's reconciliation
path and keep feedback truthful while status is unknown. A cancellation signal
cannot guarantee a server-side rollback. For the provider boundary, use available
`engineering-judgment` service-integration guidance.

Verify repeat actions while the first send is held pending, definitive validation
failure with preserved input, and an accepted write whose response is lost. Check
the resulting server state where the task depends on deduplication. One recorded
UI call proves a client guard, not the server's full guarantee.

## Worked optimistic-update race

Edit A changes a record from version 5 to 6. Edit B then changes it to version 7.
A late rejection for A must not restore the version-5 snapshot over B. Tie rollback
or reconciliation to the operation/resource version that still owns the state,
and follow the API's actual conflict policy. A response arriving last does not
automatically contain the newest domain state.

Exercise success/failure in both orders with controlled responses. Check confirmed
state, displayed state, pending indicators, errors, and cache invalidation from
the caller's perspective. Include identity changes or navigation when they change
ownership. Use a real browser where hydration, focus, composition input, or
navigation matters; report the evidence each layer establishes.
