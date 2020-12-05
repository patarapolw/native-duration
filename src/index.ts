export type Unit = "ms" | "s" | "min" | "h" | "d" | "w" | "mo" | "y";

export function durationToRecord(
  from: Date,
  to: Date
): {
  sign: string;
  d: Record<Unit, number>;
} {
  const dates = new (class {
    sign = "+";
    dates = [new Date(from), new Date(to)];

    constructor() {
      if (from > to) {
        this.sign = "-";
        this.dates = this.dates.reverse();
      }
    }

    parse(
      current: (d: Date) => number,
      upper?: {
        get: (d: Date) => number;
        set: (d: Date, v: number) => void;
        inc: (d: Date) => number;
      }
    ) {
      let a = current(this.dates[1]) - current(this.dates[0]);

      if (upper) {
        while (a < 0) {
          a += upper.inc(this.dates[0]);

          upper.set(this.dates[1], upper.get(this.dates[1]) - 1);
          this.dates[1] = new Date(this.dates[1]);
        }
      }

      return a;
    }
  })();

  const ms = dates.parse((d) => d.getMilliseconds(), {
    get: (d) => d.getSeconds(),
    set: (d, v) => d.setSeconds(v),
    inc: () => 1000,
  });

  const s = dates.parse((d) => d.getSeconds(), {
    get: (d) => d.getMinutes(),
    set: (d, v) => d.setMinutes(v),
    inc: () => 60,
  });

  const min = dates.parse((d) => d.getMinutes(), {
    get: (d) => d.getHours(),
    set: (d, v) => d.setHours(v),
    inc: () => 60,
  });

  const h = dates.parse((d) => d.getHours(), {
    get: (d) => d.getDate(),
    set: (d, v) => d.setDate(v),
    inc: () => 24,
  });

  let d = dates.parse((d) => d.getDate(), {
    get: (d) => d.getMonth(),
    set: (d, v) => d.setMonth(v),
    inc: (d) => {
      const y = d.getFullYear();
      let isLeapYear = true;
      if (y % 4) {
        isLeapYear = false;
      } else if (y % 100) {
        isLeapYear = true;
      } else if (y % 400) {
        isLeapYear = false;
      }

      return [
        31, // Jan
        isLeapYear ? 29 : 28, // Feb
        31, // Mar
        30, // Apr
        31, // May
        30, // Jun
        31, // Jul
        31, // Aug
        30, // Sep
        31, // Oct
        30, // Nov
        31, // Dec
      ][d.getMonth()];
    },
  });

  const w = Math.floor(d / 7);
  d = d % 7;

  const mo = dates.parse((d) => d.getMonth(), {
    get: (d) => d.getFullYear(),
    set: (d, v) => d.setFullYear(v),
    inc: () => 12,
  });

  const y = dates.parse((d) => d.getFullYear());

  return {
    sign: dates.sign,
    d: {
      ms,
      s,
      min,
      h,
      d,
      w,
      mo,
      y,
    },
  };
}

export interface IDurationOptions {
  sign?: boolean;
  trim?: number;
  unit?: Partial<Record<Unit, string>>;
}

export function durationToString(
  from: Date,
  to: Date,
  { sign, trim, unit = {} }: IDurationOptions = {}
) {
  const m = durationToRecord(from, to);
  const str = Object.entries(m.d)
    .filter(([, v]) => v)
    .reverse()
    .slice(0, trim)
    .map(([k, v]) => `${v.toLocaleString()}${unit[k as Unit] || k}`)
    .join(" ");

  if (sign) {
    return m.sign + str;
  }

  return str;
}
