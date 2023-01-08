import { MFile } from './MFile';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as ejs from 'ejs';
export class MTemplate {
    /** singleton */
    static instance = null;
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new MTemplate();
        return this.instance;
    }
    base = path.resolve();
    /**
     * writeFile
     * @param jsonArr
     * @param tpl
     */
    writeFile(jsonArr, tpl, options) {
        // if (!options.force) {
        //   jsonArr.forEach(m => {
        //     const fileName = tpl[m.tpl].fileName.replace(/{name}/, m.name).replace(/\.ejs$/, '');
        //     if (fs.pathExistsSync(m.pathStr + fileName)) {
        //       throw new Error(
        //         'File to write already exists.'
        //         + `\ntarget: ${tpl[m.tpl].fileName}`
        //         + `\nexists: ${m.pathStr + fileName}`
        //         + `\nhint: -f option will force overwriting`);
        //     }
        //   });
        // }
        let createdFilesCnt = 0;
        let overwriteCnt = 0;
        let skipCnt = 0;
        for (let i = 0; i < jsonArr.length; i++) {
            const m = jsonArr[i];
            const fileName = tpl[m.tpl].fileName.replace(/{name}/, m.name).replace(/\.ejs$/, '');
            const compiledBody = ejs.render(tpl[m.tpl].body, m.props).replace(/\n\n+/g, '\n\n');
            if (fs.pathExistsSync(m.pathStr + fileName)) {
                if (!options.overwrite) {
                    skipCnt++;
                    continue;
                }
                overwriteCnt++;
            }
            else {
                createdFilesCnt++;
            }
            fs.mkdirsSync(m.pathStr);
            fs.outputFileSync(m.pathStr + fileName, compiledBody);
            console.log(`created: ${m.pathStr + fileName}`);
        }
        console.log((createdFilesCnt ? `${createdFilesCnt} files created. ` : '')
            + (overwriteCnt ? `${overwriteCnt} files overwrite. ` : '')
            + (skipCnt ? `${skipCnt} files skipped because they exist.` : ''));
    }
    /**
     * getAllTemplate
     * @param dir
     * @returns
     */
    getAllTemplate(dir) {
        let dirArr;
        try {
            dirArr = MFile.readDir(dir);
        }
        catch {
            throw new Error(`no such file or directory, scandir 'zumen/'`
                + `\n\n  $ npx zumen@latest init\n\nto create a sample first.`);
        }
        const exists = {};
        dirArr.forEach(f => {
            if (!f.match(/=/)) {
                throw new Error(`"${f}". The template file name must include "=".`
                    + `\nexample: "${f}={name}.ts.ejs"`);
            }
            const fn = f.split("=");
            if (exists[fn[1] + "\t"]) {
                throw new Error(`Duplicate file name of template in ${fn[0]}`);
            }
            exists[fn[1] + "\t"] = true;
        });
        // read files
        const result = {};
        dirArr.forEach(m => {
            const str = fs.readFileSync(dir + '/' + m).toString();
            const fn = m.split("=");
            result[fn[0]] = {
                fileName: fn[1],
                body: str
            };
        });
        return result;
    }
}
