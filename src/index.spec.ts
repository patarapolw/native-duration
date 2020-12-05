import { Unit, durationToRecord, durationToString } from ".";

const addDate: Record<Unit, (d: Date, n: number) => Date> = {
  ms: (d, n) => {
    d.setMilliseconds(d.getMilliseconds() + n);
    return new Date(d);
  },
  s: (d, n) => {
    d.setSeconds(d.getSeconds() + n);
    return new Date(d);
  },
  min: (d, n) => {
    d.setMinutes(d.getMinutes() + n);
    return new Date(d);
  },
  h: (d, n) => {
    d.setHours(d.getHours() + n);
    return new Date(d);
  },
  d: (d, n) => {
    d.setDate(d.getDate() + n);
    return new Date(d);
  },
  w: (d, n) => {
    d.setDate(d.getDate() + n * 7);
    return new Date(d);
  },
  mo: (d, n) => {
    d.setMonth(d.getMonth() + n);
    return new Date(d);
  },
  y: (d, n) => {
    d.setFullYear(d.getFullYear() + n);
    return new Date(d);
  },
};

const maxAcceptable: Partial<Record<Unit, number>> = {
  ms: 1000,
  s: 60,
  min: 60,
  h: 24,
  d: 31,
  w: 4,
  mo: 12,
};

const now = new Date();

Array(10000)
  .fill(null)
  .map(() => {
    Array.from(Array(8), (_, i) => Math.random() * 10 ** (i + 5)).map((n) => {
      const to = new Date(+now + n);
      console.log(
        durationToString(now, to, {
          sign: false,
          trim: 2,
        })
      );

      const map = durationToRecord(now, to);

      Object.entries(map.d).map(([k, v]) => {
        const max = maxAcceptable[k as Unit];
        if (max && v > max) {
          console.error({ k, v, map });
          throw new Error("Some value exceeded the limit");
        }
      });

      const calculated = Object.entries(map.d).reduce(
        (prev, [k, v]) => addDate[k as Unit](prev, v),
        new Date(now)
      );

      const ratio = (+calculated - +now) / n;

      if (ratio < 0.95 || ratio > 1.05) {
        console.error({ now, to, calculated, map });
        throw new Error("Duration might be miscalculated (CI 95%)");
      }
    });
  });
