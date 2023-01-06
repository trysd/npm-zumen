import { ReservedWord } from './NReservedWord';
import { Tpl } from './MTemplate';
import { ArgvOptions } from './Core';
import * as fs from 'fs-extra';
import * as YAML from 'yaml';

/** Converted type */
export interface ConvertedJson {
  props: unknown,
  tpl: string,
  name: string,
  path: string[],
  pathStr: string
}

/** Class to parse map JSON */
export class MJson {

  private static JsonURL = null;
  constructor(jsonUrl: string) {
    MJson.JsonURL = jsonUrl;
  }

  /**
   * test json
   * @param json 
   */
  public testJson(json: unknown, arr: ConvertedJson[], path: string[], tplKeys: string[]): void {
    Object.keys(json).forEach(key => {
      if (key.match(/\/$/)) {
        // 階層
        const _path = [...path, key];
        this.testJson(json[key], arr, _path, tplKeys)
      } else {
        const keySplitted = key.split('=');
        if (!tplKeys.includes(keySplitted[0])) {
          if (!key.match(/=/)) {
            throw new Error(
              `Specifying a template "${keySplitted[0]}" that does not exist.`
              + `\npath: ${path.join("") + key}`
              + `\n\nAre you sure it's "${key + '/'}" or "${key}=someName" ?`
              
            )
          }
          throw new Error(
            `Specifying a template "${keySplitted[0]}" that does not exist.`
            + `\npath: ${path.join("") + key}`
            
          )
        }

        Object.keys(json[key]).forEach(f => {
          if (ReservedWord.includes(f)) {
            throw new Error(
              `The reserved word "${f}" cannot be used as an item name.`
              + `\nobject: ${path.join("") + key}` 
            );
          }
        });
      }
    });
  }

  /**
   * JSON parsing main
   */
  public convertJson(tpl: Tpl, options: ArgvOptions): ConvertedJson[] {

    // read and parse
    const json = this.readJson();

    // test json
    const tplKeys = Object.keys(tpl);
    this.testJson(JSON.parse(JSON.stringify(json)), [], [], tplKeys);

    // Convert to an array representing what should be created where
    const convertedJson: ConvertedJson[] = this.jsonToArray(json, [], []);
    if (options.preview) {
      console.dir(convertedJson, {depth: null});
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
  public putAnnotation(
    arrRef: ConvertedJson[],
    objRef: ConvertedJson,
    index: number,
    annoKey: string
  ): void {
    const val = objRef.props[annoKey];
    const annoFileType = val.replace(/^.*@/, '');
    const responseList: { name: string, path: string }[] = [];
    const backCount = (val.match(/\.\.\//g) || []).length;
    const targetPath = objRef.path.slice(0, objRef.path.length - backCount);
    arrRef.forEach((cj, i) => {
      if (i != index
        && targetPath.join("") === cj.path.join("")
        && annoFileType === cj.tpl
      ) {
        responseList.push({
          name: cj.name,
          path: backCount ? '../'.repeat(backCount) : './',
        })
      }
    });
    objRef.props[annoKey] = responseList;
  }

  /**
   * Annotation analysis
   * @param arrRef 
   */
  public readAnnotation(arrRef: ConvertedJson[]): void {
    arrRef.forEach((obj, i) => {
      Object.keys(obj.props).forEach(key => {
        const val = obj.props[key];
        if (typeof val === "string" && val.match(/^(\.\.\/)*@\w+/)) {
          this.putAnnotation(arrRef, obj, i, key)
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
  public jsonToArray(json: unknown, arr: ConvertedJson[], path: string[]): ConvertedJson[] {
    Object.keys(json).forEach(key => {
      if (key.match(/\/$/)) {
        const _path = [...path, key];
        this.jsonToArray(json[key], arr, _path)
      } else {
        const keySplitted = key.split('=');
        json[key].path = path.join("");
        json[key].name = keySplitted[1];
        arr.push({
          props: json[key],

          tpl: keySplitted[0],
          name: keySplitted[1],
          path: path,
          pathStr: path.join("")
        })
      }
    });
    return arr;
  }

  /**
   * json read and parse with remove comment
   * @returns 
   */
  public readJson(): unknown {
  
    let fileName = "";
    ['.json', '.yaml', 'yml'].forEach(tail => {
      if (fs.pathExistsSync("./" + MJson.JsonURL + tail)) {
        fileName = "./" + MJson.JsonURL + tail;
      }
    });
    if (fileName === "") {
      throw new Error(
        `Can't find the zumen map file.`
        + `\n\n  $ npx zumen@latest init\n\nto create a sample first.\n\n`
      );
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
  public removeJsonCommentOut(json: unknown): void {
    Object.keys(json).forEach(key => {
      if (key.match(/^\/\//)) {
        delete json[key]
      } else if (key.match(/\/$/)) {
        this.removeJsonCommentOut(json[key])
      }
    });
  }

}
