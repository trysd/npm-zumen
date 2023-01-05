#!/usr/bin/env node

import { MJson, ConvertedJson } from '../MJson';
import { MTemplate, Tpl } from '../MTemplate';

export interface ArgvOptions {
  force: boolean
}

export default class Main {
  private static tplDir = 'x.map';
  private static mapFile = 'x.map.yaml';
  private json = new MJson(Main.mapFile);
  private template = MTemplate.getInstance();
  private baseTpl: Tpl = {};
  private convertedJson: ConvertedJson[] = [];

  /** main */
  public main(): void {

    const options = this.readArgv();

    // read template
    this.baseTpl = this.template.getAllTemplate(Main.tplDir);

    // Convert to an array representing what should be created where
    this.convertedJson = this.json.convertJson(this.baseTpl);

    // write file
    this.template.writeFile(this.convertedJson, this.baseTpl, options);
  }

  /**
   * read ARGV
   * @returns 
   */
  private readArgv(): ArgvOptions {
    const argv = process.argv;
    const options: ArgvOptions = {
      force: false,
    }
    if (argv.length > 2) {
      options.force = argv.includes("-f") ? true : false;
    }
    return options
  }

}

new Main().main();
