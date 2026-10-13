# Source acknowledgments and notices

The authored skills use new wording to synthesize general engineering, design,
marketing, and editorial techniques. The source review and catalog identify their
inspirations and changes in scope. No Anthropic document implementation, Graphify
runtime, Archify assets, or Caveman implementation is redistributed here.

The following upstream notices are retained for the permissively licensed sources
that informed the authored guidance. They apply to their respective upstream
materials, not as a blanket license for this repository or unrelated assets.
Direct upstream project installations also retain their source's own LICENSE.

## Rust runtime

Native distributions include `RUST-NOTICES.txt`, generated from the pinned Cargo
dependency closure and the selected Rust toolchain. It retains dependency
identities, license declarations and actual notice texts, including bundled
native source notices and the standard-library inventory. The inventory includes
build and target-specific dependencies; it is not a claim that every listed
source component is linked into every executable. Some crate archives omit their
upstream license files; their exact-source supplements and provenance are kept in
[`licenses/rust-runtime`](licenses/rust-runtime/).

These notices accompany Mirket binaries independently of the optional packages
below. Publish each native distribution's notice file alongside its executables.

## Runtime packages

Optional MCP and editor packages retain their own licenses and dependency notices.
The package registry pins the downloaded artifacts; setup preserves archive notices
and copies the curated notice files into each installed generation. These
licenses apply to their respective components, independently of Mirket's license.

| Component | Upstream license | Retained notices and provenance |
| --- | --- | --- |
| Node.js 24.21.0 | MIT and bundled dependency licenses | [Complete upstream license file](licenses/packages/optional/NODE-LICENSE.txt) |
| Chrome Headless Shell 155.0.8059.12 | BSD-3-Clause and bundled dependency licenses | Platform-specific `LICENSE.headless_shell` retained in each browser archive; [source and packaging notes](licenses/packages/optional/CHROMIUM-NOTICES.md) |
| Playwright MCP 0.0.83 | Apache-2.0 | [Server and dependency notices](licenses/packages/optional/playwright-NOTICES.txt) |
| Inkscape 1.4.4 | GPL-3.0-or-later application; bundled Ghostscript is AGPL-3.0-or-later; other components retain their own licenses | [License scope](licenses/packages/inkscape/README.md), [bundled notices](licenses/packages/inkscape/BUNDLED-NOTICES.txt), [source inventory](licenses/packages/inkscape/SOURCE-INVENTORY.json), [artifact lock](../registry/package-locks/inkscape.json) |

Additional creative and accessibility packages retain their complete reviewed
closure notices under `docs/licenses/packages/`: axe-core (MPL-2.0), HyperFrames
(Apache-2.0 with dependency terms), Motion Canvas (MIT with dependency terms),
Penpot (MPL-2.0 and OCI component
notices), and platform-specific FFmpeg/FFprobe builds. The Linux build additionally enables nonfree components and requires the reviewed glibc closure; those local images must not be redistributed. Exact npm archive and
OCI manifest digests are in their package definitions and locks.

Exact source revisions, archive identities and selected targets are recorded in
[`packages-optional.json`](../registry/packages-optional.json),
[`packages-engines.json`](../registry/packages-engines.json),
[`packages-motion-canvas.json`](../registry/packages-motion-canvas.json),
[`packages-hyperframes.json`](../registry/packages-hyperframes.json),
[`packages-axe-core.json`](../registry/packages-axe-core.json),
[`packages-penpot.json`](../registry/packages-penpot.json) and
[`packages-editors.json`](../registry/packages-editors.json). The
[`package-locks`](../registry/package-locks/) directory records dependency
resolution and notice inventories for the selected profiles. No omitted dependency
is installed implicitly.

Native provenance records distinguish source dependency inventories from the
components linked into each platform binary and retain unresolved notice gaps.
The recorded hashes establish artifact identity; Mirket does not independently
reproduce upstream binaries. See [local MCP packages](packages.md) for the
selected profiles and runtime prerequisites.

### Editor application distribution

Mirket releases contain Rust editor adapters, pinned package definitions and
notices. Installation downloads the unmodified signed Inkscape
application from their official upstream distributors; Mirket does not rehost
the editor binaries. All application contents and original notices are retained.
The adapters exchange ordinary vector, animation and image files with separate
application processes and do not link against their libraries.

The retained inventories record exact artifact identities and application source
pins, available bundled notices and the source/build evidence that was reviewed.
They do not establish complete native component notice coverage, independently
reproduced builds or a maintained corresponding-source service. Inkscape's
inventory includes pinned packaging recipes but not a verified archived source
closure for every bundled library, Ghostscript resource and customized Python
component.

Private local use and conveying binary copies to others have different license
obligations. Before Mirket supplies these binaries through a release, mirror or
shared cache, complete the component review and provide the corresponding source,
build/install scripts, notices and recipient rights required by the applicable
licenses. A link to the main application repository alone is insufficient for a
bundle with additional components. A separate process is not a blanket licensing
exception. The package-specific license scope documents link the relevant
upstream and FSF guidance; the current download path is not a redistribution
compliance certification.

## mattpocock/skills

[4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d](https://github.com/mattpocock/skills/tree/4588b32ecab9ecc9fc8cc6b6c5e7d675b6004b0d)

```text
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## obra/superpowers

[8ca22dba9a94f28898bbce59f2537ff4d87c747d](https://github.com/obra/superpowers/tree/8ca22dba9a94f28898bbce59f2537ff4d87c747d)

```text
MIT License

Copyright (c) 2025 Jesse Vincent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## emilkowalski/skills

[e8a175de22ae1e49370fc144c1f3bb9aeedf988d](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d)

```text
MIT License

Copyright (c) 2026 Emil Kowalski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## coreyhaines31/marketingskills

[dda3841f0b294e01e93b1541486beefbfab0915e](https://github.com/coreyhaines31/marketingskills/tree/dda3841f0b294e01e93b1541486beefbfab0915e)

```text
MIT License

Copyright (c) 2025 Corey Haines

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## affaan-m/ECC

[ef648e01899ba3e8dc6371642deaaf64b4477775](https://github.com/affaan-m/ECC/tree/ef648e01899ba3e8dc6371642deaaf64b4477775)

```text
MIT License

Copyright (c) 2026 Affaan Mustafa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Nutlope/hallmark

[13ac0ec7e148655948100b6396439e481361d690](https://github.com/Nutlope/hallmark/tree/13ac0ec7e148655948100b6396439e481361d690)

```text
MIT License

Copyright (c) 2026 Hallmark contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Leonxlnx/taste-skill

[ce26fc25c0e5e8cab638f883de62d9a86ee5e45b](https://github.com/Leonxlnx/taste-skill/tree/ce26fc25c0e5e8cab638f883de62d9a86ee5e45b)

```text
MIT License

Copyright (c) 2026 Leonxlnx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## nextlevelbuilder/ui-ux-pro-max-skill

[477bcb28c9812b385cb51a4605ddf30d7b2266e2](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/477bcb28c9812b385cb51a4605ddf30d7b2266e2)

```text
MIT License

Copyright (c) 2024 Next Level Builder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
