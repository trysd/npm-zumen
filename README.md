# zumen
A development tool that can create a group of files at once based on the design described in json (or yaml)

# usage

Install the design set with the init command.
```js
  npx zumen@latest init
```
Next, customize the design set and run basic commands.
```js
  npx zumen@latest
```
Add the -o option to overwrite the output file.
Be careful, as the finished file that you manually customized will be reverted.
```js
  npx zumen@latest -o
```

# Detailed usage

  1. Create a drawing file (zumen.json) directly under the project.
  2. Create a template file (**.*.ejs) in ./zumen/*
  3. run command 'npx zumen@latest'

## 1. Drawing file

Place the drawing file (zumen.json or zumen.yml, zumen.yaml) that describes the files to be created directly under the project.

### Drawing file contents

Describe the file structure in the drawing file. For folders, add / at the end of the item name, and for files, the item name will be "template name"="file name". See the example for details.
(The right hand side of "=" is a string that will later be used in templates and to replace {name} in filenames.)

#### zumen.json(or zumen.yaml, zumen.yml)

```json
{
  "src/": {
    "components/": {
      "template01=dialogComponent": {
        "comment": "the comment"
      }
    }
  }
}
```
- Item names and values in the file are basically arbitrary and can be expanded as ejs in the template. (However, the name and path are added implicitly, so even if you specify them, they will be overwritten by the system.)
- For other detailed explanations, please refer to "Special function".
- how to use ejs https://ejs.co/#docs

## 2. How to create template file

Create the template described in the drawing file. The template name is arbitrary, but must match the field name with equals.
In the example above, you need to create a template called "template01".

### template01 sample
filename: ./zumen/template01={name}.tsx.ejs
```js
// <%= comment %>
const <%= name %> = () => {
  return (
    <div>
      I'm <%= name %>
    </div>
  );
}
```
- Make sure the file extension is ".ejs"
- {name} replaces the right side of equals specified in the drawing file.
- The template is finally compiled with ejs.

## final deliverable

src/components/dialogComponent.tsx
```js
// the comment
const dialogComponent = () => {
  return (
    <div>
      I'm dialogComponent
    </div>
  );
}
```

## Special function

### value annotation

If you specify "@{template name}" as the value of the item to expand, it will return a list of target file names in the specified hierarchy and will be replaced with a complete array in the template.

#### example
##### zumen.json
```json
{
  "src/": {
    "components/": {
      "component=DialogOpen": {
        "comment": "Dialog open button."
      },
      "component=DialogClose": {
        "comment": "Dialog close button."
      },
      "index=": {
        "brings": "@component"
      }
    }
  }
}
```
- Can also be set like "../@component" with hierarchy specified.

##### ./zumen/index=index.ts.ejs
```js
<%_ for (var i = 0; i < brings.length; i++) { _%>
export * from './<%= brings[i].name %>';
<%_ } _%>
```

####　File completed with the above set
##### ./src/components/index.ts
```js
export * from './DialogOpen';
export * from './DialogClose';
```

### Items that are automatically and implicitly granted
You can use the file name "name" and the file path string "path" in the template.

### preview of final structure
"-p" option preview the final system-interpreted structure.
