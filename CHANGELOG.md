# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.3](https://github.com/TranspiledCode/titan-demo/compare/v0.2.2...v0.2.3) (2026-05-31)


### Features

* **assets:** add gallery section design reference image ([acb977e](https://github.com/TranspiledCode/titan-demo/commit/acb977e99845fe51224cc86a3ae0ccb0b04949c3))
* **assets:** add service area section design reference image ([c25c5ec](https://github.com/TranspiledCode/titan-demo/commit/c25c5ec6390b5e30809a101516c678d3a7598ff3))
* **services:** add CTA banner below accordion ([9a93ba0](https://github.com/TranspiledCode/titan-demo/commit/9a93ba0caf6b787525b0fba8dba79673cbabe541)), closes [#21](https://github.com/TranspiledCode/titan-demo/issues/21)
* **services:** add dark background and eyebrow label to services section ([384085f](https://github.com/TranspiledCode/titan-demo/commit/384085fe2b5599475ff187cb5d9b921b42649438)), closes [#21](https://github.com/TranspiledCode/titan-demo/issues/21)
* **services:** add trust badges row ([fca2ea7](https://github.com/TranspiledCode/titan-demo/commit/fca2ea7f84df6ad7e24c312c31d03b8db6a768d8)), closes [#21](https://github.com/TranspiledCode/titan-demo/issues/21)
* **services:** replace card grid with accordion layout ([f4a3197](https://github.com/TranspiledCode/titan-demo/commit/f4a31976e3a5f6b5cd051b6bee84370b1b74e0e1)), closes [#21](https://github.com/TranspiledCode/titan-demo/issues/21)


### Bug Fixes

* **services:** make heading fonts theme-aware for light/dark mode ([bdd6106](https://github.com/TranspiledCode/titan-demo/commit/bdd6106f383fe196560bfff2df282953cfdb4247))

### 0.2.2 (2026-05-31)


### Features

* **footer:** make mobile-first responsive and integrate config ([8f1e2ff](https://github.com/TranspiledCode/titan-demo/commit/8f1e2ff5d51e530ccec607131b579d5e16952575)), closes [#28](https://github.com/TranspiledCode/titan-demo/issues/28)
* **hero:** add Hero component with local background image ([2234fdb](https://github.com/TranspiledCode/titan-demo/commit/2234fdb31d6756485c94cfb8d7492091217549c3)), closes [#10](https://github.com/TranspiledCode/titan-demo/issues/10)
* **hero:** update hero copy, layout, and trusted banner ([9849149](https://github.com/TranspiledCode/titan-demo/commit/9849149f1fe40e239cc04043d767f85514bc4862)), closes [#10](https://github.com/TranspiledCode/titan-demo/issues/10)
* **why:** add complete why section with header and benefits grid ([e45334f](https://github.com/TranspiledCode/titan-demo/commit/e45334fe6624ddb4b9f5e4c187825b6945b84450))


### Bug Fixes

* **admin:** correct pageSchema import path ([3023655](https://github.com/TranspiledCode/titan-demo/commit/302365528e0392e8276dbe2694d1f4e2523c3437))
* ContactFormSection Netlify Forms + theme tokens, PageSEO env var, Dialog aria-modal, Footer/ThemeToggle lint fixes ([0a04d7f](https://github.com/TranspiledCode/titan-demo/commit/0a04d7f4eceef84f136ec03b4e5eef6d25174cbb)), closes [#999](https://github.com/TranspiledCode/titan-demo/issues/999) [#f5f5f5](https://github.com/TranspiledCode/titan-demo/issues/f5f5f5) [#666](https://github.com/TranspiledCode/titan-demo/issues/666)
* Footer a[href] missing on non-link contact items, Google icon mismatch ([9b7de93](https://github.com/TranspiledCode/titan-demo/commit/9b7de93b0f876c4823d03dc423f21a7010161c43))

### [0.2.1](https://github.com/TranspiledCode/spa-template-base/compare/v0.2.0...v0.2.1) (2026-05-24)

## [0.2.0](https://github.com/TranspiledCode/spa-template-base/compare/v0.0.3...v0.2.0) (2026-03-30)


### ⚠ BREAKING CHANGES

* Pages no longer need individual Helmet usage
SEO is now automatically handled by PageSEO component

Features:
- Automatic meta tag generation for all pages
- Social media optimization (Open Graph, Twitter Cards)
- Rich snippets with structured data
- Template-friendly configuration for easy customization
- Performance optimized (< 2KB gzipped)
- Production-ready with comprehensive testing

### Features

* add comprehensive SEO testing tools and documentation ([91ec0cf](https://github.com/TranspiledCode/spa-template-base/commit/91ec0cf87fad5ab10fdc01882f7b6fe353569cbc))
* add e2e tests for error boundary with multi-browser support ([eb78ea1](https://github.com/TranspiledCode/spa-template-base/commit/eb78ea1ee93d45d627fdb36f36534c3a01cef1a2))
* add Emotion ThemeProvider and theme system ([5cced6a](https://github.com/TranspiledCode/spa-template-base/commit/5cced6a1b75a179b1f95ffdd409004c825ea4722))
* add production build optimization and audit tools ([c719717](https://github.com/TranspiledCode/spa-template-base/commit/c7197178904fd23bfdf9f2b73548d512eb788719))
* **admin:** add ContentEditor orchestrator with desktop/mobile layouts ([03a77da](https://github.com/TranspiledCode/spa-template-base/commit/03a77da01a8131c47075fdae6a49978d899e29ca)), closes [#39](https://github.com/TranspiledCode/spa-template-base/issues/39)
* **admin:** add ContentFieldEditor with desktop and mobile modes ([c949a57](https://github.com/TranspiledCode/spa-template-base/commit/c949a576038983d204b985d7f0ec89b4bfb90f7d))
* **admin:** add ContentPageList component with locale dots ([8c68d11](https://github.com/TranspiledCode/spa-template-base/commit/8c68d11b175d5f72b2a988a4b8c3dd6c09f64b0e))
* **admin:** add Translate all button to page editor ([acef203](https://github.com/TranspiledCode/spa-template-base/commit/acef203c1dfaa0804bbedcac719b5c57964fb86d))
* **admin:** add Translate from EN hint to page editor ([ba1fce3](https://github.com/TranspiledCode/spa-template-base/commit/ba1fce394102681c2ccce921b2fda9906c722e81))
* **admin:** complete admin dashboard with theme integration and page editing ([8b960ac](https://github.com/TranspiledCode/spa-template-base/commit/8b960acf82daeb024e68f8034e57a1acac3fab29))
* **admin:** enhance Firebase CMS content management ([a7fbe35](https://github.com/TranspiledCode/spa-template-base/commit/a7fbe35caa3a13f4a7ab2eccdb686acf3468b093)), closes [#39](https://github.com/TranspiledCode/spa-template-base/issues/39)
* **admin:** implement edit home page form in content tab ([94b09af](https://github.com/TranspiledCode/spa-template-base/commit/94b09af0247f6d20864b679a7ae0dd46b39bb9c4)), closes [#39](https://github.com/TranspiledCode/spa-template-base/issues/39)
* **admin:** wire ContentEditor into AdminDashboard content tab ([2e6e01a](https://github.com/TranspiledCode/spa-template-base/commit/2e6e01aa0098eef53e09a2fe756a409393a180bc))
* **api:** add resilient api client with retries and interceptors ([5922625](https://github.com/TranspiledCode/spa-template-base/commit/5922625c5d5bf3fdcaf090b353d53f937e5f9a6a)), closes [#14](https://github.com/TranspiledCode/spa-template-base/issues/14)
* **assets:** convert PNG assets to WebP format for performance optimization ([bcd4b03](https://github.com/TranspiledCode/spa-template-base/commit/bcd4b03ad94bd1ea9a02ad58199a621825ef6057)), closes [#32](https://github.com/TranspiledCode/spa-template-base/issues/32)
* **cms:** add hasLocaleContent to content service ([492a7fc](https://github.com/TranspiledCode/spa-template-base/commit/492a7fce2e13ec76dbed53962347991bdb13d698))
* **cms:** add updatePage to ContentService ([ff331ea](https://github.com/TranspiledCode/spa-template-base/commit/ff331ea27962e0a5fe4fcc266505d5e145631b64))
* **cms:** expose updatePage from usePage hook ([3df5156](https://github.com/TranspiledCode/spa-template-base/commit/3df5156df9c73eca8a8779a05ae1586690cac922))
* complete Firebase CMS integration with content management ([8fce6c8](https://github.com/TranspiledCode/spa-template-base/commit/8fce6c88e7524c1a24271ae5d8d6f2ba1fea4d5a))
* **content:** add pageSchema field definitions ([8df7370](https://github.com/TranspiledCode/spa-template-base/commit/8df73700f73bcf1724d006f3d80bb8fe48f6671d))
* **demo:** implement comprehensive component demo system ([c783162](https://github.com/TranspiledCode/spa-template-base/commit/c78316262e91e0d6de199dfd3032df33165e625c)), closes [#22](https://github.com/TranspiledCode/spa-template-base/issues/22)
* **hooks:** add useMediaQuery hook for breakpoint detection ([6f0388b](https://github.com/TranspiledCode/spa-template-base/commit/6f0388b46b421d24af563c36537f1a880b334a0a))
* implement comprehensive internationalization (i18n) framework ([4cfa8f6](https://github.com/TranspiledCode/spa-template-base/commit/4cfa8f674fbd045e3d3c17ff4798002be300a479)), closes [#34](https://github.com/TranspiledCode/spa-template-base/issues/34)
* implement comprehensive SEO system with meta tags, Open Graph, and structured data ([0dcc894](https://github.com/TranspiledCode/spa-template-base/commit/0dcc894b4526f102372a9b8c1ced1661e17b537d))
* implement comprehensive theme system and modern homepage ([a50ceb5](https://github.com/TranspiledCode/spa-template-base/commit/a50ceb5f1da4d7fdd9bcd344dffd6324cec7d59f))
* implement Framer Motion animations and UI components ([e090132](https://github.com/TranspiledCode/spa-template-base/commit/e090132dda0b815b0eb9e666f799ae9d714f67c7))
* **toast:** implement toast notifications with react-hot-toast ([07a78f3](https://github.com/TranspiledCode/spa-template-base/commit/07a78f36fc2ba9b008f2a1b75007c922176a9e8e)), closes [#27](https://github.com/TranspiledCode/spa-template-base/issues/27)
* **translate:** add browser translate service ([34a9291](https://github.com/TranspiledCode/spa-template-base/commit/34a9291bb48ee8c00ce0cf7b8e253f5acb041820))
* **translate:** add Netlify translate function proxy ([e66e336](https://github.com/TranspiledCode/spa-template-base/commit/e66e3366c69e49419aca5320bf7d5f14bbeadf2f))
* **translate:** add yarn translate script to seed content files ([39028de](https://github.com/TranspiledCode/spa-template-base/commit/39028deff280bc463090b7eed7ca67009b41d5b5))
* **ui:** implement Radix UI component library ([e1f77ef](https://github.com/TranspiledCode/spa-template-base/commit/e1f77efbf941984bbca3ac4a159f1889974b960e)), closes [#14B8A6](https://github.com/TranspiledCode/spa-template-base/issues/14B8A6) [#20](https://github.com/TranspiledCode/spa-template-base/issues/20)


### Bug Fixes

* **admin:** about edit toast, disable save on loading, add label associations ([748d2b8](https://github.com/TranspiledCode/spa-template-base/commit/748d2b881297687e611043a7dc3284f299a06107))
* **admin:** always show translate button on non-EN locale tabs ([aae8cd9](https://github.com/TranspiledCode/spa-template-base/commit/aae8cd9cc6b79fd4dd7c651ceb5a5574343cff95))
* **admin:** remove unused isMobile and WifiOff from dashboard shell ([11a346b](https://github.com/TranspiledCode/spa-template-base/commit/11a346b9bf37d0566373e37c2fabfb924cb313d1))
* **admin:** skip redundant loadContent on mobile locale switch in ContentEditor ([da5fd44](https://github.com/TranspiledCode/spa-template-base/commit/da5fd44a7805ec76db01093073b13ef9425c3949))
* **admin:** use locale string as dot key in ContentPageList ([3479d99](https://github.com/TranspiledCode/spa-template-base/commit/3479d9982ad839e2e0f748ac0952985711af5e41))
* **admin:** use theme tokens for Analytics tab dot and metric colors ([0514385](https://github.com/TranspiledCode/spa-template-base/commit/051438500d79a97187f76ac02a8e75e876ffd799))
* **cms:** add enabled guard and error test to usePage updatePage ([51995d2](https://github.com/TranspiledCode/spa-template-base/commit/51995d279e0a15281d66a9e775013d72b2d3dff5))
* **cms:** updatePage throws on Firebase failure, clears cache on success ([fbd0856](https://github.com/TranspiledCode/spa-template-base/commit/fbd085671ecd0e0926912bf598bc8e1a9c21b3f2))
* **content:** add JSDoc, barrel export, and about page test to schema ([06c5566](https://github.com/TranspiledCode/spa-template-base/commit/06c55664a72dd5b093e44d6489d472ea6a137446))
* **content:** merge partial field updates in local mode updatePage ([857ee87](https://github.com/TranspiledCode/spa-template-base/commit/857ee877e04e480813de3e20496a038a148fd405))
* **e2e:** update demo page title test to use exact string match ([d2ddca3](https://github.com/TranspiledCode/spa-template-base/commit/d2ddca37b1943d14d74d47063cbb37493fcf994a))
* ensure playwright browsers installed regardless of cache ([23ec244](https://github.com/TranspiledCode/spa-template-base/commit/23ec244e046f5de0edb3240416a7cad815128333))
* **hooks:** improve useMediaQuery test coverage and add JSDoc ([248fd89](https://github.com/TranspiledCode/spa-template-base/commit/248fd89f4cb6b06ce012f3b40b2939cdc7d1b0ca))
* **hooks:** useToast wraps existing react-hot-toast utility ([a599347](https://github.com/TranspiledCode/spa-template-base/commit/a59934796c6c820edc05fa5646d6faf4e9284786))
* install all Playwright browsers in CI for multi-browser e2e tests ([6d3b64a](https://github.com/TranspiledCode/spa-template-base/commit/6d3b64a57f27db8d150e22f56c0f0bce6c8c178a))
* rename globalStyles.jsx to global.jsx to resolve case sensitivity issues ([9a6ee66](https://github.com/TranspiledCode/spa-template-base/commit/9a6ee66b132f39a3b71c4c56faff5d8bf9ead059))
* resolve App test failures by adding HelmetProvider to test wrapper ([958f24e](https://github.com/TranspiledCode/spa-template-base/commit/958f24efdffb67fe9c61a4d9ea58b723d021746f))
* **setup:** simplify template setup flow to avoid chicken-and-egg problem ([c80b9cc](https://github.com/TranspiledCode/spa-template-base/commit/c80b9cc2bba55d1c264b37f211888c8470457cbc)), closes [#8](https://github.com/TranspiledCode/spa-template-base/issues/8)
* **toast:** correct test expectation for default toast position ([f5dec5f](https://github.com/TranspiledCode/spa-template-base/commit/f5dec5f624aac3b16f68c68dd678488c45d239bd))
* **translate:** call MyMemory directly in dev mode so yarn dev works without netlify dev ([9d1c6e1](https://github.com/TranspiledCode/spa-template-base/commit/9d1c6e1a9843b4e79d24490a95754004eaf60cc7))
* **translate:** harden text validation, editingLocale reset, and EN source fetch ([dceda65](https://github.com/TranspiledCode/spa-template-base/commit/dceda653c00ec3174149d2ba53a7fa60e7fe846f))
* update DemoWidget and tests to match new theme system ([375450f](https://github.com/TranspiledCode/spa-template-base/commit/375450fdca16f7cf1adb9a4bb1fa01d7ff79e1ee))
* update GitHub repository link from hoverinc to TranspiledCode ([0db9bc3](https://github.com/TranspiledCode/spa-template-base/commit/0db9bc3818d282af6d3c6995e49083b4388990f6))
* update unit tests to work with new theme system ([9a1f3ae](https://github.com/TranspiledCode/spa-template-base/commit/9a1f3aed36942f138c9f5fa5a91b621303aa70f2))

## [0.1.0](https://github.com/TranspiledCode/spa-template-base/compare/v0.0.3...v0.1.0) (2026-03-08)


### ⚠ BREAKING CHANGES

* Pages no longer need individual Helmet usage
SEO is now automatically handled by PageSEO component

Features:
- Automatic meta tag generation for all pages
- Social media optimization (Open Graph, Twitter Cards)
- Rich snippets with structured data
- Template-friendly configuration for easy customization
- Performance optimized (< 2KB gzipped)
- Production-ready with comprehensive testing

### Features

* add comprehensive SEO testing tools and documentation ([a7987c2](https://github.com/TranspiledCode/spa-template-base/commit/a7987c253204e20c5231c93db2345230ad8d5246))
* add e2e tests for error boundary with multi-browser support ([eb78ea1](https://github.com/TranspiledCode/spa-template-base/commit/eb78ea1ee93d45d627fdb36f36534c3a01cef1a2))
* add Emotion ThemeProvider and theme system ([5cced6a](https://github.com/TranspiledCode/spa-template-base/commit/5cced6a1b75a179b1f95ffdd409004c825ea4722))
* add production build optimization and audit tools ([7db2cb8](https://github.com/TranspiledCode/spa-template-base/commit/7db2cb8df146607fd9aa0e5392eb4592036b8ac9))
* **api:** add resilient api client with retries and interceptors ([5922625](https://github.com/TranspiledCode/spa-template-base/commit/5922625c5d5bf3fdcaf090b353d53f937e5f9a6a)), closes [#14](https://github.com/TranspiledCode/spa-template-base/issues/14)
* **demo:** implement comprehensive component demo system ([c783162](https://github.com/TranspiledCode/spa-template-base/commit/c78316262e91e0d6de199dfd3032df33165e625c)), closes [#22](https://github.com/TranspiledCode/spa-template-base/issues/22)
* implement comprehensive SEO system with meta tags, Open Graph, and structured data ([6836a2d](https://github.com/TranspiledCode/spa-template-base/commit/6836a2daaf4b53202bea07070f3cec3921d2a81b))
* implement comprehensive theme system and modern homepage ([a50ceb5](https://github.com/TranspiledCode/spa-template-base/commit/a50ceb5f1da4d7fdd9bcd344dffd6324cec7d59f))
* implement Framer Motion animations and UI components ([e090132](https://github.com/TranspiledCode/spa-template-base/commit/e090132dda0b815b0eb9e666f799ae9d714f67c7))
* **toast:** implement toast notifications with react-hot-toast ([14fe172](https://github.com/TranspiledCode/spa-template-base/commit/14fe172289c32d0fbdf87bf5f46d888de42dbcc1)), closes [#27](https://github.com/TranspiledCode/spa-template-base/issues/27)
* **ui:** implement Radix UI component library ([e1f77ef](https://github.com/TranspiledCode/spa-template-base/commit/e1f77efbf941984bbca3ac4a159f1889974b960e)), closes [#14B8A6](https://github.com/TranspiledCode/spa-template-base/issues/14B8A6) [#20](https://github.com/TranspiledCode/spa-template-base/issues/20)


### Bug Fixes

* **e2e:** update demo page title test to use exact string match ([b8c3c1a](https://github.com/TranspiledCode/spa-template-base/commit/b8c3c1a1b1e7c9c4912b856d538028747cd47d68))
* ensure playwright browsers installed regardless of cache ([23ec244](https://github.com/TranspiledCode/spa-template-base/commit/23ec244e046f5de0edb3240416a7cad815128333))
* install all Playwright browsers in CI for multi-browser e2e tests ([6d3b64a](https://github.com/TranspiledCode/spa-template-base/commit/6d3b64a57f27db8d150e22f56c0f0bce6c8c178a))
* rename globalStyles.jsx to global.jsx to resolve case sensitivity issues ([9a6ee66](https://github.com/TranspiledCode/spa-template-base/commit/9a6ee66b132f39a3b71c4c56faff5d8bf9ead059))
* resolve App test failures by adding HelmetProvider to test wrapper ([f3a2399](https://github.com/TranspiledCode/spa-template-base/commit/f3a2399dd6bedcba9f834238ce26ae4f43c7399f))
* **setup:** simplify template setup flow to avoid chicken-and-egg problem ([c80b9cc](https://github.com/TranspiledCode/spa-template-base/commit/c80b9cc2bba55d1c264b37f211888c8470457cbc)), closes [#8](https://github.com/TranspiledCode/spa-template-base/issues/8)
* **toast:** correct test expectation for default toast position ([0f4abe1](https://github.com/TranspiledCode/spa-template-base/commit/0f4abe135d5b5012e47a4cb65e15e7f5c500baac))
* update DemoWidget and tests to match new theme system ([375450f](https://github.com/TranspiledCode/spa-template-base/commit/375450fdca16f7cf1adb9a4bb1fa01d7ff79e1ee))
* update GitHub repository link from hoverinc to TranspiledCode ([0db9bc3](https://github.com/TranspiledCode/spa-template-base/commit/0db9bc3818d282af6d3c6995e49083b4388990f6))
* update unit tests to work with new theme system ([9a1f3ae](https://github.com/TranspiledCode/spa-template-base/commit/9a1f3aed36942f138c9f5fa5a91b621303aa70f2))

### [0.0.5](https://github.com/TranspiledCode/spa-template-base/compare/v0.0.3...v0.0.5) (2026-02-26)


### Features

* add e2e tests for error boundary with multi-browser support ([71a736d](https://github.com/TranspiledCode/spa-template-base/commit/71a736dda4d82f25738756a40d75323e5ae9d08d))
* add Emotion ThemeProvider and theme system ([d5b0d59](https://github.com/TranspiledCode/spa-template-base/commit/d5b0d59e3094dccf09ef35d7336044da29c42688))
* **api:** add resilient api client with retries and interceptors ([6e0f1a3](https://github.com/TranspiledCode/spa-template-base/commit/6e0f1a303155cdf25c613dc501301a6f39ed8150)), closes [#14](https://github.com/TranspiledCode/spa-template-base/issues/14)
* **demo:** implement comprehensive component demo system ([c979d84](https://github.com/TranspiledCode/spa-template-base/commit/c979d845539f329418a4a3db8946f821741078e2)), closes [#22](https://github.com/TranspiledCode/spa-template-base/issues/22)
* implement comprehensive theme system and modern homepage ([fd5e343](https://github.com/TranspiledCode/spa-template-base/commit/fd5e34311e70dd3a52565a8c1b0ea7444086d2db))
* implement Framer Motion animations and UI components ([51e39e0](https://github.com/TranspiledCode/spa-template-base/commit/51e39e01db2b0b707efb8e9e219c237cbe18c302))
* **ui:** implement Radix UI component library ([d750e26](https://github.com/TranspiledCode/spa-template-base/commit/d750e2609e1a00060230661ffe70db1a5cb28ebb)), closes [#14B8A6](https://github.com/TranspiledCode/spa-template-base/issues/14B8A6) [#20](https://github.com/TranspiledCode/spa-template-base/issues/20)


### Bug Fixes

* ensure playwright browsers installed regardless of cache ([d8f2e25](https://github.com/TranspiledCode/spa-template-base/commit/d8f2e25d71ad8ed315b31eb36c0d98fff8f8981f))
* install all Playwright browsers in CI for multi-browser e2e tests ([bbbb2d4](https://github.com/TranspiledCode/spa-template-base/commit/bbbb2d417ec6118c1adc32fb9f7da9eda2ed3286))
* rename globalStyles.jsx to global.jsx to resolve case sensitivity issues ([6888044](https://github.com/TranspiledCode/spa-template-base/commit/68880449d06d0d60d62344a7f7a37b61d6e9ed70))
* **setup:** simplify template setup flow to avoid chicken-and-egg problem ([c80b9cc](https://github.com/TranspiledCode/spa-template-base/commit/c80b9cc2bba55d1c264b37f211888c8470457cbc)), closes [#8](https://github.com/TranspiledCode/spa-template-base/issues/8)
* update DemoWidget and tests to match new theme system ([98880f0](https://github.com/TranspiledCode/spa-template-base/commit/98880f07943e622faad07e0d12b706bab82a33a6))
* update GitHub repository link from hoverinc to TranspiledCode ([0d3362b](https://github.com/TranspiledCode/spa-template-base/commit/0d3362b3b1cc68dc87b629b32bb123d8f744ac41))
* update unit tests to work with new theme system ([bef573e](https://github.com/TranspiledCode/spa-template-base/commit/bef573e7b91799451bd64e6c14815804a0b0a775))

### [0.0.4](https://github.com/TranspiledCode/spa-template-base/compare/v0.0.3...v0.0.4) (2026-02-24)


### Bug Fixes

* **setup:** simplify template setup flow to avoid chicken-and-egg problem ([12a36be](https://github.com/TranspiledCode/spa-template-base/commit/12a36be5490ab8f50406cea200d48d16984600af)), closes [#8](https://github.com/TranspiledCode/spa-template-base/issues/8)

### [0.0.3](https://github.com/TranspiledCode/spa-template-base/compare/v0.0.2...v0.0.3) (2026-02-24)

### [0.0.2](https://github.com/TranspiledCode/spa-template-base/compare/v0.0.1...v0.0.2) (2026-02-24)

### 0.0.1 (2026-02-24)


### Features

* **demo:** add DemoWidget with input, button, and modal ([bdedba8](https://github.com/TranspiledCode/spa-template-base/commit/bdedba8fda1ed45b43c32b46f4d8be435d237612)), closes [#0](https://github.com/TranspiledCode/spa-template-base/issues/0)
