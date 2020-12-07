/**
 * Possible duration units in this parser
 */
export declare type DurationUnit = "ms" | "s" | "min" | "h" | "d" | "w" | "mo" | "y";
export interface IDurationOptions {
    /**
     * @default true
     */
    sign?: boolean;
    /**
     * Number of units plus subunits
     */
    granularity?: number;
    /**
     * Number of max units shown
     */
    maxUnit?: number;
    /**
     * Custom naming for units
     */
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
    private _dates;
    static of(msec: number): Duration;
    constructor(from: Date, to: Date);
    toOrderedDict(): [DurationUnit, number][];
    toString({ sign, granularity, maxUnit, unit, }?: IDurationOptions): string;
    private _parse;
}
/**
 * Date adding functions
 */
export declare function addDate(d: Date): Record<DurationUnit, (n: number) => Date>;
export default Duration;
//# sourceMappingURL=index.d.ts.map