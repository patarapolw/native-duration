export type DurationUnit = "ms" | "s" | "min" | "h" | "d" | "w" | "mo" | "y";

export interface IDurationOptions {
  /**
   * @default true
   */
  sign?: boolean;
  trim?: number;
  unit?: Partial<Record<DurationUnit, string>>;
}

export class Duration {
  sign: "+" | "-" | "" = "+";

  ms: number;
  s: number;
  min: number;
  h: number;
  d: number;
  w: number;
  mo: number;
  y: number;

  get order(): [DurationUnit, number][] {
    return [
      ["ms", this.ms],
      ["s", this.s],
      ["min", this.min],
      ["h", this.h],
      ["d", this.d],
      ["w", this.w],
      ["mo", this.mo],
      ["y", this.y],
    ];
  }

  /**
   * @internal
   */
  private dates: [Date, Date] = [new Date(this.from), new Date(this.to)];

  static of(msec: number) {
    const to = new Date();
    const output = new this(new Date(+to - msec), to);
    output.sign = "";

    return output;
  }

  constructor(public from: Date, public to: Date) {
    if (from > to) {
      this.sign = "-";
      this.dates = this.dates.reverse() as [Date, Date];
    }

    this.ms = this.parse((d) => d.getMilliseconds(), {
      get: (d) => d.getSeconds(),
      set: (d, v) => d.setSeconds(v),
      inc: () => 1000,
    });

    this.s = this.parse((d) => d.getSeconds(), {
      get: (d) => d.getMinutes(),
      set: (d, v) => d.setMinutes(v),
      inc: () => 60,
    });

    this.min = this.parse((d) => d.getMinutes(), {
      get: (d) => d.getHours(),
      set: (d, v) => d.setHours(v),
      inc: () => 60,
    });

    this.h = this.parse((d) => d.getHours(), {
      get: (d) => d.getDate(),
      set: (d, v) => d.setDate(v),
      inc: () => 24,
    });

    this.d = this.parse((d) => d.getDate(), {
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

    this.w = Math.floor(this.d / 7);
    this.d = this.d % 7;

    this.mo = this.parse((d) => d.getMonth(), {
      get: (d) => d.getFullYear(),
      set: (d, v) => d.setFullYear(v),
      inc: () => 12,
    });

    this.y = this.parse((d) => d.getFullYear());
  }

  toString({ sign = true, trim, unit = {} }: IDurationOptions = {}) {
    const str = this.order
      .filter(([, v]) => v)
      .reverse()
      .slice(0, trim)
      .map(([k, v]) => `${v.toLocaleString()}${unit[k] || k}`)
      .join(" ");

    if (sign) {
      return this.sign + str;
    }

    return str;
  }

  /**
   * @internal
   */
  private parse(
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
        upper.set(this.dates[1], upper.get(this.dates[1]) - 1);
        this.dates[1] = new Date(this.dates[1]);

        a += upper.inc(this.dates[1]);
      }
    }

    return a;
  }
}

export function addDate(d: Date): Record<DurationUnit, (n: number) => Date> {
  return {
    ms: (n) => {
      d.setMilliseconds(d.getMilliseconds() + n);
      return new Date(d);
    },
    s: (n) => {
      d.setSeconds(d.getSeconds() + n);
      return new Date(d);
    },
    min: (n) => {
      d.setMinutes(d.getMinutes() + n);
      return new Date(d);
    },
    h: (n) => {
      d.setHours(d.getHours() + n);
      return new Date(d);
    },
    d: (n) => {
      d.setDate(d.getDate() + n);
      return new Date(d);
    },
    w: (n) => {
      d.setDate(d.getDate() + n * 7);
      return new Date(d);
    },
    mo: (n) => {
      d.setMonth(d.getMonth() + n);
      return new Date(d);
    },
    y: (n) => {
      d.setFullYear(d.getFullYear() + n);
      return new Date(d);
    },
  };
}

export default Duration;
