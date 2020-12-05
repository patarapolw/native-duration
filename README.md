# native-duration

JavaScript / TypeScript library to Calculate duration between two dates with zero dependencies (via Date object).

## Usage

```ts
import { durationToString } from 'native-duration'

const now = new Date()

console.log(
  durationToString(
    now,
    new Date(+now + 10 ** 9)
  )
)
// 1w 4d 13h 46min 40s
```

Of course, you can easily use it in any website, without Node.js, thanks to UNPKG.

```html
<div id="mil-secs"></div>

<script type="module">
import { durationToString } from 'https://unpkg.com/native-duration'

const now = new Date()

document.getElementById('mil-secs').innerText = durationToString(
  now,
  new Date(+now + 10 ** 9)
)
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
