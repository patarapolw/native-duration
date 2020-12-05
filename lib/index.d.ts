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
//# sourceMappingURL=index.d.ts.map