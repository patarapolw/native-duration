"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDate = exports.Duration = void 0;
class Duration {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.sign = "+";
        this._dates = [new Date(this.from), new Date(this.to)];
        if (from > to) {
            this.sign = "-";
            this._dates = this._dates.reverse();
        }
        this.ms = this._parse((d) => d.getMilliseconds(), {
            get: (d) => d.getSeconds(),
            set: (d, v) => d.setSeconds(v),
            inc: () => 1000,
        });
        this.s = this._parse((d) => d.getSeconds(), {
            get: (d) => d.getMinutes(),
            set: (d, v) => d.setMinutes(v),
            inc: () => 60,
        });
        this.min = this._parse((d) => d.getMinutes(), {
            get: (d) => d.getHours(),
            set: (d, v) => d.setHours(v),
            inc: () => 60,
        });
        this.h = this._parse((d) => d.getHours(), {
            get: (d) => d.getDate(),
            set: (d, v) => d.setDate(v),
            inc: () => 24,
        });
        this.d = this._parse((d) => d.getDate(), {
            get: (d) => d.getMonth(),
            set: (d, v) => d.setMonth(v),
            inc: (d) => {
                const y = d.getFullYear();
                let isLeapYear = true;
                if (y % 4) {
                    isLeapYear = false;
                }
                else if (y % 100) {
                    isLeapYear = true;
                }
                else if (y % 400) {
                    isLeapYear = false;
                }
                return [
                    31,
                    isLeapYear ? 29 : 28,
                    31,
                    30,
                    31,
                    30,
                    31,
                    31,
                    30,
                    31,
                    30,
                    31,
                ][d.getMonth()];
            },
        });
        this.w = Math.floor(this.d / 7);
        this.d = this.d % 7;
        this.mo = this._parse((d) => d.getMonth(), {
            get: (d) => d.getFullYear(),
            set: (d, v) => d.setFullYear(v),
            inc: () => 12,
        });
        this.y = this._parse((d) => d.getFullYear());
    }
    static of(msec) {
        const to = new Date();
        const output = new this(new Date(+to - msec), to);
        output.sign = "";
        return output;
    }
    toOrderedDict() {
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
    toString({ sign = true, granularity, maxUnit, unit = {}, } = {}) {
        const filteredDict = this.toOrderedDict().filter(([, v]) => v);
        const str = filteredDict
            .slice(granularity ? filteredDict.length - granularity : 0)
            .reverse()
            .slice(0, maxUnit)
            .map(([k, v]) => `${v.toLocaleString()}${unit[k] || k}`)
            .join(" ");
        if (sign) {
            return this.sign + str;
        }
        return str;
    }
    _parse(current, upper) {
        let a = current(this._dates[1]) - current(this._dates[0]);
        if (upper) {
            while (a < 0) {
                upper.set(this._dates[1], upper.get(this._dates[1]) - 1);
                this._dates[1] = new Date(this._dates[1]);
                a += upper.inc(this._dates[1]);
            }
        }
        return a;
    }
}
exports.Duration = Duration;
/**
 * Date adding functions
 */
function addDate(d) {
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
exports.addDate = addDate;
exports.default = Duration;
