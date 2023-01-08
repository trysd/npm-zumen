"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MTemplate = void 0;
const MFile_1 = require("./MFile");
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const ejs = __importStar(require("ejs"));
class MTemplate {
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
            if (m.pathStr.length) {
                fs.mkdirsSync(m.pathStr);
            }
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
            dirArr = MFile_1.MFile.readDir(dir);
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
exports.MTemplate = MTemplate;
