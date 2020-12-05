import { durationToString } from "."

const now = new Date()

console.log(
  durationToString(
    now,
    new Date(+now + 10 ** 9)
  )
)