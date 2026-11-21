# CoolQR 3 failure probes — 2026-10-17

- Empty data and unpaired UTF-16 surrogate: RangeError from encodeQR.
- Invalid error correction, version range and payload overflow: RangeError from encodeQR.
- Browser renderer invalid canvas size, low/reversed contrast, invalid logo scale/padding, and explicit low ECC with a logo: rejected.
- Broken logo URL: rejected with load error; no silently unbranded PNG returned.
- Dense version 29, H code with a default logo badge: rejected before covering function patterns; reduced 3px padding works and decodes with zbarimg.
- Removed legacy public asset `/icon.png`: HTTP 404 in the new container, while new favicon and OG image return 200.
- Rapid edit race: demo uses monotonically increasing render sequence, so an older asynchronous image render cannot replace a newer preview (code inspection). No browser stress automation was retained; this path has not been independently timed under a delayed image response.
