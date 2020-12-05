export declare type Unit = "ms" | "s" | "min" | "h" | "d" | "w" | "mo" | "y";
export declare function durationToRecord(from: Date, to: Date): {
    sign: string;
    d: Record<Unit, number>;
};
export interface IDurationOptions {
    sign?: boolean;
    trim?: number;
    unit?: Partial<Record<Unit, string>>;
}
export declare function durationToString(from: Date, to: Date, { sign, trim, unit }?: IDurationOptions): string;
export declare function msecToString(msec: number, opts?: IDurationOptions): string;
export declare function addDate(d: Date): Record<Unit, (n: number) => Date>;
//# sourceMappingURL=index.d.ts.map