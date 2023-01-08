import * as fs from 'fs-extra';
export class MFile {
    /**
     * Get recursive directory structure
     * @param dirPath
     * @param res
     * @param route
     * @returns
     */
    static readDir(dirPath, res = [], route = []) {
        const routesStr = (route.length ? route.join('/') + '/' : '');
        const dirent = fs.readdirSync(dirPath + '/' + routesStr, { withFileTypes: true });
        dirent.forEach(d => {
            if (d.isDirectory()) {
                this.readDir(dirPath, res, [...route, d.name]);
            }
            else {
                res.push(routesStr + d.name);
            }
        });
        return res;
    }
}
