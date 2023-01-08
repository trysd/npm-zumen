import { ConvertedJson } from './MJson';
import { ArgvOptions } from './Core';
export interface Tpl {
    [keys: string]: {
        fileName: string;
        body: string;
    };
}
export declare class MTemplate {
    /** singleton */
    private static instance;
    private constructor();
    static getInstance(): MTemplate;
    private base;
    /**
     * writeFile
     * @param jsonArr
     * @param tpl
     */
    writeFile(jsonArr: ConvertedJson[], tpl: Tpl, options: ArgvOptions): void;
    /**
     * getAllTemplate
     * @param dir
     * @returns
     */
    getAllTemplate(dir: string): Tpl;
}
//# sourceMappingURL=MTemplate.d.ts.map