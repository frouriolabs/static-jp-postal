# Static JP postal

日本の郵便番号を静的ホスティングで住所に変換します。
住所を郵便番号に変えることは出来ません。
約 12.4 万ある郵便番号に対応する住所の JSON ファイルを約 12.4 万生成するだけの単純な仕組みです。

## 外部サーバーから fetch する使い方

```js
const data = await fetch(
  `https://frouriolabs.github.io/static-jp-postal/api/v0.1/001/0000.json`
).then(res => res.json())
```

※URI が変わる可能性があるので商用本番利用は非推奨です。

## 自サーバーから fetch する使い方

Node.js のインストールが必要です。
`-o` オプションで出力先のディレクトリを指定して npx コマンドで約 12.4 万の JSON ファイルを生成します。

```bash
$ npx static-jp-postal -o public/api
```

```js
const data = await fetch(`/api/v0.1/001/0000.json`).then(res => res.json())
```
