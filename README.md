# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## テスト

```bash
npm run test        # 単体テスト（Vitest）
npm run test:e2e    # E2E テスト（Playwright / Chromium）
npm run screenshot -- tmp/preview.png   # 目視確認用スクリーンショット（要 npm run dev）
```

E2E テストと `npm run screenshot` は Playwright の Chromium バイナリを使う。初回のみ次を実行する:

```bash
npx playwright install chromium
```

`npm run test:e2e` は `playwright.config.ts` の `webServer` 設定により dev サーバーを自動起動する。
CI では `.github/workflows/ci.yml` の独立ジョブ「E2E (Playwright)」で実行される（`npm run check` には含めない）。
