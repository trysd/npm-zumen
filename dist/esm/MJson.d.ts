import { Tpl } from './MTemplate';
import { ArgvOptions } from './Core';
/** Converted type */
export interface ConvertedJson {
    props: unknown;
    tpl: string;
    name: string;
    path: string[];
    pathStr: string;
}
/** Class to parse map JSON */
export declare class MJson {
    private static JsonURL;
    constructor(jsonUrl: string);
    /**
     * test json
     * @param json
     */
    testJson(json: unknown, arr: ConvertedJson[], path: string[], tplKeys: string[]): void;
    /**
     * JSON parsing main
     */
    convertJson(tpl: Tpl, options: ArgvOptions): ConvertedJson[];
    /**
     * Resolve annotations.
     * the annotation value is converted to an array and replaced.
     * @param arrRef whole array
     * @param objRef Object to convert
     * @param index Index to be converted from the entire array
     * @param annoKey The key name of the annotation
     */
    putAnnotation(arrRef: ConvertedJson[], objRef: ConvertedJson, index: number, annoKey: string): void;
    /**
     * Annotation analysis
     * @param arrRef
     */
    readAnnotation(arrRef: ConvertedJson[]): void;
    /**
     * Convert Object to array with path
     * @param json
     * @param arr
     * @param path
     * @returns
     */
    jsonToArray(json: unknown, arr: ConvertedJson[], path: string[]): ConvertedJson[];
    /**
     * json read and parse with remove comment
     * @returns
     */
    readJson(): unknown;
    /**
     * Remove the // at the beginning of the item name.
     * The / at the end of the item name is a recursive search.
     * @param json json of map
     */
    removeJsonCommentOut(json: unknown): void;
}
//# sourceMappingURL=MJson.d.ts.map