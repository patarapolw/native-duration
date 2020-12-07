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
    /**
     * Starting Date
     */
    from: Date;
    /**
     * Ending date
     */
    to: Date;
    /**
     * Sign in front of the output toString()
     */
    sign: "+" | "-" | "";
    /**
     * Milliseconds
     */
    ms: number;
    /**
     * Seconds
     */
    s: number;
    /**
     * Minutes
     */
    min: number;
    /**
     * Hours
     */
    h: number;
    /**
     * Days
     */
    d: number;
    /**
     * Weeks
     */
    w: number;
    /**
     * Months
     */
    mo: number;
    /**
     * Years
     */
    y: number;
    private _dates;
    /**
     * Parse milliseconds (i.e. epoch) to Duration, based on before present time
     */
    static of(msec: number): Duration;
    constructor(
    /**
     * Starting Date
     */
    from: Date, 
    /**
     * Ending date
     */
    to: Date);
    /**
     * To JSON-serializable OrderedDict
     */
    toOrderedDict(): [DurationUnit, number][];
    /**
     * To String
     *
     * Works with `${duration}` also
     */
    toString({ sign, granularity, maxUnit, unit, }?: IDurationOptions): string;
    private _parse;
}
/**
 * Date adding functions
 */
export declare function addDate(d: Date): Record<DurationUnit, (n: number) => Date>;
export default Duration;
//# sourceMappingURL=index.d.ts.map