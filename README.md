# native-duration

[![npm version](https://badge.fury.io/js/native-duration.svg)](https://badge.fury.io/js/native-duration)

JavaScript / TypeScript library to Calculate duration between two dates with zero dependencies (via Date object).

## Usage

```ts
import Duration from "native-duration";

const now = new Date();

console.log(Duration.of(10 ** 9).toString());
// 1w 4d 13h 46min 40s
```

Of course, you can easily use it in any website, without Node.js, thanks to UNPKG.

```html
<div id="mil-secs"></div>

<script type="module">
  import Duration from "https://unpkg.com/native-duration";

  const now = new Date();

  document.getElementById("mil-secs").innerText = Duration.of(
    10 ** 9
  ).toString();
</script>
```

## Installation

```sh
npm i native-duration
```

Or, install directly from GitHub main branch.

```sh
npm i patarapolw/native-duration
```
