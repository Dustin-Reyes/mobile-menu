# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.6](https://github.com/TranspiledCode/transpiled-web-template/compare/v0.2.5...v0.2.6) (2026-06-10)


### Features

* **cms:** add Services section CMS editing, i18n, and custom items editor ([6e93a5d](https://github.com/TranspiledCode/transpiled-web-template/commit/6e93a5d447e301d4f4654712a8d59a74a83d0fcb))
* **media:** add delete-media function ([6c48f4f](https://github.com/TranspiledCode/transpiled-web-template/commit/6c48f4ffd588ff932c397a0155065bcf8b5abdde))
* **media:** add galleryItems schema field and render real images in Gallery ([257b4e7](https://github.com/TranspiledCode/transpiled-web-template/commit/257b4e76af7d633a384dc0b4d45c73be9b066a4e))
* **media:** add GalleryItemsEditor with MediaPicker integration ([05e6226](https://github.com/TranspiledCode/transpiled-web-template/commit/05e6226c3f87d5cefc44e1ae74035c7ddc837c07))
* **media:** add get-upload-url function ([353563f](https://github.com/TranspiledCode/transpiled-web-template/commit/353563fb480108c33360aaee8376e5b181afbf27)), closes [#37](https://github.com/TranspiledCode/transpiled-web-template/issues/37)
* **media:** add media service ([8228f53](https://github.com/TranspiledCode/transpiled-web-template/commit/8228f535a412fc02e549f2863f2c8d7846d7428a))
* **media:** add MediaPicker component ([02e45d6](https://github.com/TranspiledCode/transpiled-web-template/commit/02e45d6c45aea0040cc517b6d5ddd2d0b1d27611))
* **media:** add process-image-background function ([09a11c4](https://github.com/TranspiledCode/transpiled-web-template/commit/09a11c4ac5b3df571285f3689adf3dd4506915cf))
* **media:** add shared function libs — presets, auth, r2, firebase-admin ([191eddc](https://github.com/TranspiledCode/transpiled-web-template/commit/191eddc5fe815b2c0880dd2715b325fd4d60ffe7))
* **media:** add useMediaLibrary and useUpload hooks ([065b4ad](https://github.com/TranspiledCode/transpiled-web-template/commit/065b4ad07af88ab537d449c7daf68630bfec0719))
* **media:** multi-size processing, gallery image assignment, and placeholder system ([c51843c](https://github.com/TranspiledCode/transpiled-web-template/commit/c51843c6168357eec45b426370dd1a75ff3befc4)), closes [#37](https://github.com/TranspiledCode/transpiled-web-template/issues/37)
* **media:** rebuild MediaTab with upload zone and media library grid ([a880afd](https://github.com/TranspiledCode/transpiled-web-template/commit/a880afd4dbd847c30337d317fe70dd8ab63ef9dc))
* **observability:** complete Sentry coverage audit ([87cd78c](https://github.com/TranspiledCode/transpiled-web-template/commit/87cd78c576650d16a595b51a1e7743be74896b80))
* **observability:** Sentry audit and console cleanup ([9d152e8](https://github.com/TranspiledCode/transpiled-web-template/commit/9d152e8fad8d6028271c99028319fe3a6e6cfd3f)), closes [#43](https://github.com/TranspiledCode/transpiled-web-template/issues/43)
* **rbac:** enforce role hierarchy for all user management actions ([e8edb04](https://github.com/TranspiledCode/transpiled-web-template/commit/e8edb04bcad1a058b3481aacaf2367178b6e3b83))
* **theme:** update color palette to Transpiled Electric Indigo brand ([4cc564d](https://github.com/TranspiledCode/transpiled-web-template/commit/4cc564d9bcf36352b0a240fe8af672131befb971)), closes [#F5A623](https://github.com/TranspiledCode/transpiled-web-template/issues/F5A623) [#6366F1](https://github.com/TranspiledCode/transpiled-web-template/issues/6366F1) [#F7B733](https://github.com/TranspiledCode/transpiled-web-template/issues/F7B733) [#818CF8](https://github.com/TranspiledCode/transpiled-web-template/issues/818CF8) [#E8A000](https://github.com/TranspiledCode/transpiled-web-template/issues/E8A000) [#4F46E5](https://github.com/TranspiledCode/transpiled-web-template/issues/4F46E5) [#F5A623](https://github.com/TranspiledCode/transpiled-web-template/issues/F5A623) [#6366F1](https://github.com/TranspiledCode/transpiled-web-template/issues/6366F1) [#111111](https://github.com/TranspiledCode/transpiled-web-template/issues/111111) [#6366F1](https://github.com/TranspiledCode/transpiled-web-template/issues/6366F1) [#40](https://github.com/TranspiledCode/transpiled-web-template/issues/40)


### Bug Fixes

* **admin:** update dashboard Content card label and tab id from pages to content ([f141e85](https://github.com/TranspiledCode/transpiled-web-template/commit/f141e85406a102bdf34ae40db1d06fdd2ddac6a9))
* **admin:** update Sidebar stale pages tab id references to content ([f680afc](https://github.com/TranspiledCode/transpiled-web-template/commit/f680afc61925893d516de2b1a13a6bcca07e82cb))
* **cms:** fix content transform bug, add seed --force, misc improvements ([c7e93a0](https://github.com/TranspiledCode/transpiled-web-template/commit/c7e93a0b4550b020dfc02ea81e88029e65342a82))
* **hero:** use secondaryBackground for subtler grid overlay ([a48f7a0](https://github.com/TranspiledCode/transpiled-web-template/commit/a48f7a07fa9b22826f556838444b93f3d4d84e14)), closes [#47](https://github.com/TranspiledCode/transpiled-web-template/issues/47)
* **media:** add error guards to firebase-admin and r2 libs ([a330206](https://github.com/TranspiledCode/transpiled-web-template/commit/a330206844187043d98df2d5543ad6ee3fed7399))
* **media:** add upload success toast and clipboard error handling in MediaTab ([9561cfe](https://github.com/TranspiledCode/transpiled-web-template/commit/9561cfe2aa36538d335143855486f7dbc9471a0e))
* **media:** address final review findings — raw file cleanup, validation, lazy mount, E2E selectors ([1474ec0](https://github.com/TranspiledCode/transpiled-web-template/commit/1474ec0d2898f50b801fb292e1f2ad4c2dd59113))
* **security:** address 4 of 5 audit vulnerabilities ([c21649c](https://github.com/TranspiledCode/transpiled-web-template/commit/c21649cf091cf893dc308ae161296b73ccec3ab0)), closes [#38](https://github.com/TranspiledCode/transpiled-web-template/issues/38)

### [0.2.5](https://github.com/TranspiledCode/transpiled-web-template/compare/v0.2.4...v0.2.5) (2026-06-08)


### Features

* **cms:** add Services section CMS editing, i18n, and custom items editor ([d8d9a04](https://github.com/TranspiledCode/transpiled-web-template/commit/d8d9a04d027e0c9548017fa4bede320091a1f29d))
* **observability:** complete Sentry coverage audit ([24bd7eb](https://github.com/TranspiledCode/transpiled-web-template/commit/24bd7eb775ab5b16b4ebdf1e2485e3b07bd553bd))
* **observability:** Sentry audit and console cleanup ([f27c2d4](https://github.com/TranspiledCode/transpiled-web-template/commit/f27c2d4bc43da69775f4bdbe5c822f6f84096f90)), closes [#43](https://github.com/TranspiledCode/transpiled-web-template/issues/43)
* **rbac:** enforce role hierarchy for all user management actions ([d9b7d94](https://github.com/TranspiledCode/transpiled-web-template/commit/d9b7d943d1fa8330e15a6ab5f5d232cc84aacb6b))
* **theme:** update color palette to Transpiled Electric Indigo brand ([194f721](https://github.com/TranspiledCode/transpiled-web-template/commit/194f7215db6bb8adad0f934e97c849f5a004f08c)), closes [#F5A623](https://github.com/TranspiledCode/transpiled-web-template/issues/F5A623) [#6366F1](https://github.com/TranspiledCode/transpiled-web-template/issues/6366F1) [#F7B733](https://github.com/TranspiledCode/transpiled-web-template/issues/F7B733) [#818CF8](https://github.com/TranspiledCode/transpiled-web-template/issues/818CF8) [#E8A000](https://github.com/TranspiledCode/transpiled-web-template/issues/E8A000) [#4F46E5](https://github.com/TranspiledCode/transpiled-web-template/issues/4F46E5) [#F5A623](https://github.com/TranspiledCode/transpiled-web-template/issues/F5A623) [#6366F1](https://github.com/TranspiledCode/transpiled-web-template/issues/6366F1) [#111111](https://github.com/TranspiledCode/transpiled-web-template/issues/111111) [#6366F1](https://github.com/TranspiledCode/transpiled-web-template/issues/6366F1) [#40](https://github.com/TranspiledCode/transpiled-web-template/issues/40)


### Bug Fixes

* **admin:** update dashboard Content card label and tab id from pages to content ([de23cf3](https://github.com/TranspiledCode/transpiled-web-template/commit/de23cf3ad52bdd8b9a3d5d1ac6099997ffcbb482))
* **admin:** update Sidebar stale pages tab id references to content ([435cd3d](https://github.com/TranspiledCode/transpiled-web-template/commit/435cd3d4d48dc40f68986c9864720ae46d1d7bf9))
* **cms:** fix content transform bug, add seed --force, misc improvements ([ff040df](https://github.com/TranspiledCode/transpiled-web-template/commit/ff040df1967379174c4b3487c052fe366771854b))
* **hero:** use secondaryBackground for subtler grid overlay ([851c723](https://github.com/TranspiledCode/transpiled-web-template/commit/851c7235c7dd08d45b4c0e15a3a98809ecc1cb41)), closes [#47](https://github.com/TranspiledCode/transpiled-web-template/issues/47)
* **security:** address 4 of 5 audit vulnerabilities ([5e69212](https://github.com/TranspiledCode/transpiled-web-template/commit/5e69212b82b07913099b0145d29f18269c4f7f10)), closes [#38](https://github.com/TranspiledCode/transpiled-web-template/issues/38)

### 0.2.4 (2026-06-07)


### Features

* add Transpiled logo assets and integrate into header, simplify home page ([826d38a](https://github.com/TranspiledCode/transpiled-web-template/commit/826d38a95d7821a2bf9eaadde4c11ca4b6da7da2))
* **admin:** add display name editing and password reset to profile tab ([36d9d29](https://github.com/TranspiledCode/transpiled-web-template/commit/36d9d292ee2c93e01737f6894b9a4fad090b8c94))
* **admin:** add mobile page picker dropdown to PagesTab ([8b3ad45](https://github.com/TranspiledCode/transpiled-web-template/commit/8b3ad452138ba3a0b02e92c6ffee2aa56a9f584d))
* **admin:** add translation progress feedback to AdminPageEditor ([180bb89](https://github.com/TranspiledCode/transpiled-web-template/commit/180bb89d075a500b866612949cb12e8edbb03f79)), closes [#26](https://github.com/TranspiledCode/transpiled-web-template/issues/26)
* **admin:** add users card to dashboard ([3cfee07](https://github.com/TranspiledCode/transpiled-web-template/commit/3cfee079b923b5e26339956ef1f6cd0f8e0ed4d1))
* **admin:** make display name field required ([ce7234e](https://github.com/TranspiledCode/transpiled-web-template/commit/ce7234e8ce03d8661d8e5326dbc0f419012c31cf))
* **admin:** match user detail mobile design — sections, toggle, send link, larger avatar ([541e547](https://github.com/TranspiledCode/transpiled-web-template/commit/541e5474829107b25620c8fb95eca8fbf77a23b9))
* **admin:** pages redesign — per-page editor, sidebar nav, translate buttons ([abb3ab0](https://github.com/TranspiledCode/transpiled-web-template/commit/abb3ab0f67a31ecd3234b3afe2088173c47bf7c6))
* **admin:** port modular admin dashboard + Firebase auth from Titan ([f93462f](https://github.com/TranspiledCode/transpiled-web-template/commit/f93462ff016edd15e1aae6e1975b70773b754575)), closes [#8](https://github.com/TranspiledCode/transpiled-web-template/issues/8)
* **admin:** redesign create user modal with polished admin aesthetic ([18c0245](https://github.com/TranspiledCode/transpiled-web-template/commit/18c0245bfc8ff04d9471144efab20699320a6995))
* **admin:** redesign user detail — status dot, collapsible info, rich action rows ([2a37b9d](https://github.com/TranspiledCode/transpiled-web-template/commit/2a37b9d31f26c92e96cdc8f8f3cb9194666c5c1a))
* **admin:** redesign user menus, add profile tab, remove navigation tab ([ad87d2d](https://github.com/TranspiledCode/transpiled-web-template/commit/ad87d2d35a21992d300ef0ccfda3c758804de974)), closes [#16](https://github.com/TranspiledCode/transpiled-web-template/issues/16)
* **admin:** refactor dashboard tab with CMS home screen layout ([2f252a4](https://github.com/TranspiledCode/transpiled-web-template/commit/2f252a49c21cd53ec5bc1ff606cbbb03f78cb619)), closes [#18](https://github.com/TranspiledCode/transpiled-web-template/issues/18)
* **admin:** restore reset confirm dialog, redesign as mobile bottom sheet ([beddf08](https://github.com/TranspiledCode/transpiled-web-template/commit/beddf0870151b0e02c3ddf0a3592f7b9771cb79b))
* **admin:** swap bottom sections with inline edit form on Edit click ([2e745b2](https://github.com/TranspiledCode/transpiled-web-template/commit/2e745b20b066db89906a76dd806e2a4c3bfdc042))
* **admin:** update users mobile layout to match design ([6525d17](https://github.com/TranspiledCode/transpiled-web-template/commit/6525d17cc2f24a863679f392e20a54b36eed193a))
* **cms:** add Hero section, seed script, connect CMS content ([b5b224b](https://github.com/TranspiledCode/transpiled-web-template/commit/b5b224bac3d86cd30288a81c1a296fdd697bc319)), closes [#10](https://github.com/TranspiledCode/transpiled-web-template/issues/10)
* **cms:** move FAQ items to database with en/es i18n support ([99aaa22](https://github.com/TranspiledCode/transpiled-web-template/commit/99aaa22cb1f675f75466b5bf1f5276df8ba9eae7)), closes [#19](https://github.com/TranspiledCode/transpiled-web-template/issues/19)
* **contact:** add FormRow for Name+Email, PrivacyRow footer with Send icon ([2e35e74](https://github.com/TranspiledCode/transpiled-web-template/commit/2e35e7406c873d43d447a3d7f43df9fc5771a2df))
* **contact:** restyle info panel — amber icons, theme-aware card, remove social links ([7e876d7](https://github.com/TranspiledCode/transpiled-web-template/commit/7e876d7bae9ee94876d59ec0e10e018f41c66748))
* **content:** add footer tagline field to CMS schema ([3101af1](https://github.com/TranspiledCode/transpiled-web-template/commit/3101af111e24dc8ce06e5cbfafad717461e0dcc4))
* **i18n:** add contact namespace for panel and privacy note strings ([4592796](https://github.com/TranspiledCode/transpiled-web-template/commit/4592796258e8383da66e227569ecc66a05e8773d))
* **layout:** implement single-page layout with section components ([bfd4374](https://github.com/TranspiledCode/transpiled-web-template/commit/bfd43742bb72a96fe1730785f4fc94a67e7872da))
* **mobile-menu:** redesign to match new UI spec ([9af5e1e](https://github.com/TranspiledCode/transpiled-web-template/commit/9af5e1ed9f6f344588f17fa71f715beb79d9b541)), closes [#13](https://github.com/TranspiledCode/transpiled-web-template/issues/13)
* **scripts:** add cleanup helper functions with tests ([ad74ac3](https://github.com/TranspiledCode/transpiled-web-template/commit/ad74ac349da957d1812f138dc6842f9168c87c0f)), closes [#5](https://github.com/TranspiledCode/transpiled-web-template/issues/5)
* **scripts:** add interactive cleanup CLI ([a18b032](https://github.com/TranspiledCode/transpiled-web-template/commit/a18b032503608490c10b6fd78d7743fa2ea327d5))
* **scripts:** add interactive setup CLI ([b139e5a](https://github.com/TranspiledCode/transpiled-web-template/commit/b139e5a8e3e63b41ffd9fd6f3abfcee2e57fb1af))
* **scripts:** add writer helper functions with tests ([7b32da9](https://github.com/TranspiledCode/transpiled-web-template/commit/7b32da9c45be260c7043ab841bb55b87e4126e06))
* **ui:** add SearchInput component; use in users tab ([e304f58](https://github.com/TranspiledCode/transpiled-web-template/commit/e304f5882973470066d46c7e6c711eb5bbdaaf41))


### Bug Fixes

* add missing language.* i18n keys, remove titan SEO strings from i18nConfig ([1a2552e](https://github.com/TranspiledCode/transpiled-web-template/commit/1a2552e42cfa2c8dc6dbcc35b03ff3fe39c9ba29))
* **admin:** add top spacing to mobile page picker in PagesTab ([1451670](https://github.com/TranspiledCode/transpiled-web-template/commit/14516705a77e5d0dd1420635f017fe78b86bfcc7))
* **admin:** correct relative import path for pageSchema in AdminContentEditor ([7da9963](https://github.com/TranspiledCode/transpiled-web-template/commit/7da9963f1b8ed71108b4dda1def077c594b428a6)), closes [#4](https://github.com/TranspiledCode/transpiled-web-template/issues/4)
* **admin:** fetch and display real user count on dashboard ([bd47d41](https://github.com/TranspiledCode/transpiled-web-template/commit/bd47d4164643eb80c8037ba6d967deaf7795a0a8))
* **admin:** improve PageEditor footer bar on mobile - full-width buttons, hide status text ([c48e96f](https://github.com/TranspiledCode/transpiled-web-template/commit/c48e96f46e69d02b5460bf9ea383fff3e6090276))
* **admin:** prevent horizontal scroll on mobile with overflow-x hidden ([d4107b3](https://github.com/TranspiledCode/transpiled-web-template/commit/d4107b37cb33fafc30f4fea6af7e297e0aaf7e8d))
* **admin:** prevent iOS input zoom by enforcing 16px font-size on mobile ([cbf1c7b](https://github.com/TranspiledCode/transpiled-web-template/commit/cbf1c7baa81e810b48df76230c66b997cd46bd81))
* **admin:** reload Firebase user after display name update so changes stick ([dca1b81](https://github.com/TranspiledCode/transpiled-web-template/commit/dca1b812888afc8a13eeb0fb698a8d3c79266aab))
* **admin:** remove bottom-bar offset from PageEditor footer on mobile ([b7035d9](https://github.com/TranspiledCode/transpiled-web-template/commit/b7035d9865f56a24ab0d7641d9451bdabec5a866))
* **admin:** show user.displayName in profile tab header ([bca5407](https://github.com/TranspiledCode/transpiled-web-template/commit/bca5407c2bb2d6ec7d34688410103894e18fe94d))
* **auth:** preserve Firebase User prototype in reloadUser by avoiding object spread ([7d19ad7](https://github.com/TranspiledCode/transpiled-web-template/commit/7d19ad7bed4229ee05a303ab6154f94c89479cea))
* **contact:** aria-hidden on icons, theme tokens for FormPanel, i18n contact labels ([e793f1f](https://github.com/TranspiledCode/transpiled-web-template/commit/e793f1f6bd8d843801a60a11ea093222f00a3ea7))
* **contact:** hoist contactForm i18n keys to root, define spin keyframe, aria-hidden on CheckCircle2 ([ea0dca8](https://github.com/TranspiledCode/transpiled-web-template/commit/ea0dca82d7b65eee776368111d4659eaa2234c9c))
* **contact:** mobile-first PrivacyRow, prevent link scroll, ButtonContent wrapper ([061900e](https://github.com/TranspiledCode/transpiled-web-template/commit/061900e0f98839736d96cb3841c01f785f0c7b5c))
* **contact:** wrap submitting state in ButtonContent for consistency ([0b07101](https://github.com/TranspiledCode/transpiled-web-template/commit/0b07101e6f9feef114a02e38cf5d0c6f80937d18))
* **content:** translate FAQ items array in translateContent, use translateText util ([ef5124e](https://github.com/TranspiledCode/transpiled-web-template/commit/ef5124eddd6937cec639407a8cc1aea50b635e93))
* guard cleanup double-run, fix shallow merge drops pwa/darkMode, escape backslashes in esc(), guard pkg.scripts ([364a2cb](https://github.com/TranspiledCode/transpiled-web-template/commit/364a2cb4a906246ad1f9d3cd027e12f330fded9a))
* **hero:** show skeleton while CMS content loads, avoid i18n flash ([4eaf3fe](https://github.com/TranspiledCode/transpiled-web-template/commit/4eaf3fe9660c9cc821fd1780450bcd8f74709dc2))
* improve template home page, fix i18n locale files, fix footer titan refs and empty hours crash, add git remote update to setup ([7f90699](https://github.com/TranspiledCode/transpiled-web-template/commit/7f9069906af21092d2ebe4846aab7b498ae8d0f1))
* **nav:** increase TwoLineItem padding for better touch targets in mobile menu ([3315ee8](https://github.com/TranspiledCode/transpiled-web-template/commit/3315ee8bbd3e782528e2f86039ca195255ffe057))
* **nav:** remove sign-out subtitle and unused TwoLineSubtitle from mobile menu ([7988156](https://github.com/TranspiledCode/transpiled-web-template/commit/79881561379c3648118a31559e700b4f69be24a3))
* **nav:** remove subtitle from admin dashboard link in mobile menu ([ee36dfc](https://github.com/TranspiledCode/transpiled-web-template/commit/ee36dfc0af58927e38b454541c9ddc265e0694ef))
* **nav:** scroll-to-top on route change, anchor nav from other pages, admin UI cleanup ([91e1a72](https://github.com/TranspiledCode/transpiled-web-template/commit/91e1a72636d55fca106e95f258cf54e001c1e6dd)), closes [#20](https://github.com/TranspiledCode/transpiled-web-template/issues/20)
* **nav:** use uniform white text for sign-out and admin links in mobile menu ([30fb9fa](https://github.com/TranspiledCode/transpiled-web-template/commit/30fb9fa08c7c05f038693ca5b7cae6ca5264a7eb))
* remove titan references from dev.sh ([2be047f](https://github.com/TranspiledCode/transpiled-web-template/commit/2be047f4aecdea83dcdd41751bcf409f4ea7ebad))
* simplify header to name + language switcher + theme toggle, remove broken logo and CTA ([5a5a069](https://github.com/TranspiledCode/transpiled-web-template/commit/5a5a0699c9fdcd8da3a8eeb2e52653165c7d930e))
* **tests:** update stale titan references in tests to match template placeholders ([9163d52](https://github.com/TranspiledCode/transpiled-web-template/commit/9163d52b96e81fa070be9855bd89837f52943756))
* **ui:** prevent iOS zoom on search focus; remove native clear button conflict ([a17904b](https://github.com/TranspiledCode/transpiled-web-template/commit/a17904b615ae955ae08640bdd00fe3e8b57f317f))
* **ux:** prevent iOS input zoom by enforcing 16px min font-size on mobile ([67f29c1](https://github.com/TranspiledCode/transpiled-web-template/commit/67f29c1e26cc566266703f2b65455507363b8fdb))
* wire useTranslation into Home.jsx, add home.* i18n keys in en and es ([f692283](https://github.com/TranspiledCode/transpiled-web-template/commit/f692283fa0054fa72ab5284c628aff39dfc24f0b))

# Changelog

All notable changes to this project will be documented here.
