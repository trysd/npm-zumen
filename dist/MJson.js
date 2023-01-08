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
exports.MJson = void 0;
const NReservedWord_1 = require("./NReservedWord");
const fs = __importStar(require("fs-extra"));
const YAML = __importStar(require("yaml"));
/** Class to parse map JSON */
class MJson {
    static JsonURL = null;
    constructor(jsonUrl) {
        MJson.JsonURL = jsonUrl;
    }
    /**
     * test json
     * @param json
     */
    testJson(json, arr, path, tplKeys) {
        Object.keys(json).forEach(key => {
            if (key.match(/\/$/)) {
                const _path = [...path, key];
                this.testJson(json[key], arr, _path, tplKeys);
            }
            else {
                const keySplitted = key.split('=');
                if (!tplKeys.includes(keySplitted[0])) {
                    if (!key.match(/=/)) {
                        throw new Error(`Specifying a template "${keySplitted[0]}" that does not exist.`
                            + `\npath: ${path.join("") + key}`
                            + `\n\nAre you sure it's "${key + '/'}" or "${key}=someName" ?`);
                    }
                    throw new Error(`Specifying a template "${keySplitted[0]}" that does not exist.`
                        + `\npath: ${path.join("") + key}`);
                }
                Object.keys(json[key]).forEach(f => {
                    if (NReservedWord_1.ReservedWord.includes(f)) {
                        throw new Error(`The reserved word "${f}" cannot be used as an item name.`
                            + `\nobject: ${path.join("") + key}`);
                    }
                });
            }
        });
    }
    /**
     * JSON parsing main
     */
    convertJson(tpl, options) {
        // read and parse
        const json = this.readJson();
        // test json
        const tplKeys = Object.keys(tpl);
        this.testJson(JSON.parse(JSON.stringify(json)), [], [], tplKeys);
        // Convert to an array representing what should be created where
        const convertedJson = this.jsonToArray(json, [], []);
        if (options.preview) {
            console.dir(convertedJson, { depth: null });
        }
        // Resolve annotation
        this.readAnnotation(convertedJson);
        return convertedJson;
    }
    /**
     * Resolve annotations.
     * the annotation value is converted to an array and replaced.
     * @param arrRef whole array
     * @param objRef Object to convert
     * @param index Index to be converted from the entire array
     * @param annoKey The key name of the annotation
     */
    putAnnotation(arrRef, objRef, index, annoKey) {
        const val = objRef.props[annoKey];
        const annoFileType = val.replace(/^.*@/, '');
        const responseList = [];
        const backCount = (val.match(/\.\.\//g) || []).length;
        const targetPath = objRef.path.slice(0, objRef.path.length - backCount);
        arrRef.forEach((cj, i) => {
            if (i != index
                && targetPath.join("") === cj.path.join("")
                && annoFileType === cj.tpl) {
                responseList.push({
                    name: cj.name,
                    path: backCount ? '../'.repeat(backCount) : './',
                });
            }
        });
        objRef.props[annoKey] = responseList;
    }
    /**
     * Annotation analysis
     * @param arrRef
     */
    readAnnotation(arrRef) {
        arrRef.forEach((obj, i) => {
            Object.keys(obj.props).forEach(key => {
                const val = obj.props[key];
                if (typeof val === "string" && val.match(/^(\.\.\/)*@\w+/)) {
                    this.putAnnotation(arrRef, obj, i, key);
                }
            });
        });
    }
    /**
     * Convert Object to array with path
     * @param json
     * @param arr
     * @param path
     * @returns
     */
    jsonToArray(json, arr, path) {
        Object.keys(json).forEach(key => {
            if (key.match(/\/$/)) {
                const _path = [...path, key];
                this.jsonToArray(json[key], arr, _path);
            }
            else {
                const keySplitted = key.split('=');
                json[key].path = path.join("");
                json[key].name = keySplitted[1];
                arr.push({
                    props: json[key],
                    tpl: keySplitted[0],
                    name: keySplitted[1],
                    path: path,
                    pathStr: path.join("")
                });
            }
        });
        return arr;
    }
    /**
     * json read and parse with remove comment
     * @returns
     */
    readJson() {
        let fileName = "";
        ['.json', '.yaml', 'yml'].forEach(tail => {
            if (fs.pathExistsSync("./" + MJson.JsonURL + tail)) {
                fileName = "./" + MJson.JsonURL + tail;
            }
        });
        if (fileName === "") {
            throw new Error(`Can't find the zumen map file.`
                + `\n\n  $ npx zumen@latest init\n\nto create a sample first.\n\n`);
        }
        const str = fs.readFileSync(fileName, 'utf8').toString();
        const obj = !fileName.match(/\.json$/)
            ? YAML.parse(str)
            : JSON.parse(str);
        this.removeJsonCommentOut(obj);
        return obj;
    }
    /**
     * Remove the // at the beginning of the item name.
     * The / at the end of the item name is a recursive search.
     * @param json json of map
     */
    removeJsonCommentOut(json) {
        Object.keys(json).forEach(key => {
            if (key.match(/^\/\//)) {
                delete json[key];
            }
            else if (key.match(/\/$/)) {
                this.removeJsonCommentOut(json[key]);
            }
        });
    }
}
exports.MJson = MJson;
