"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MJson_1 = require("./MJson");
const MTemplate_1 = require("./MTemplate");
const MUserInit_1 = require("./MUserInit");
class Core {
    static tplDir = 'zumen';
    static mapFile = 'zumen';
    json = new MJson_1.MJson(Core.mapFile);
    template = MTemplate_1.MTemplate.getInstance();
    baseTpl = {};
    convertedJson = [];
    main() {
        try {
            this.exec();
        }
        catch (e) {
            console.error("\x1b[31m" + (e + "").split(/\n\n\n/)[0]
                .replace(/^Error: /, '')
                .replace(/\$ (npx .+)\n/, "\x1b[36m$ $1\n\x1b[31m")
                + "\x1b[0m");
        }
    }
    exec() {
        const options = this.readArgv();
        // user init
        if (options.init) {
            new MUserInit_1.MUserInit(Core.mapFile, Core.tplDir);
            return;
        }
        // read template
        this.baseTpl = this.template.getAllTemplate(Core.tplDir);
        // Convert to an array representing what should be created where
        this.convertedJson = this.json.convertJson(this.baseTpl, options);
        // write file
        if (!options.preview) {
            this.template.writeFile(this.convertedJson, this.baseTpl, options);
        }
    }
    /**
     * read ARGV
     * @returns
     */
    readArgv() {
        const argv = process.argv;
        const options = {
            overwrite: false,
            preview: false,
            init: false
        };
        if (argv.length > 2) {
            options.overwrite = argv.includes("-o") ? true : false;
            options.preview = argv.includes("-p") ? true : false;
            options.init = argv.includes("init") ? true : false;
        }
        return options;
    }
}
exports.default = Core;
