export declare type DurationUnit = "ms" | "s" | "min" | "h" | "d" | "w" | "mo" | "y";
export interface IDurationOptions {
    /**
     * @default true
     */
    sign?: boolean;
    trim?: number;
    unit?: Partial<Record<DurationUnit, string>>;
}
export declare class Duration {
    from: Date;
    to: Date;
    sign: "+" | "-" | "";
    ms: number;
    s: number;
    min: number;
    h: number;
    d: number;
    w: number;
    mo: number;
    y: number;
    get order(): [DurationUnit, number][];
    /**
     * @internal
     */
    private dates;
    static of(msec: number): Duration;
    constructor(from: Date, to: Date);
    toString({ sign, trim, unit }?: IDurationOptions): string;
    /**
     * @internal
     */
    private parse;
}
export declare function addDate(d: Date): Record<DurationUnit, (n: number) => Date>;
export default Duration;
//# sourceMappingURL=index.d.ts.map