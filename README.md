# zumen

A development tool that can create a group of files at once based on the design described in json (or yaml)

# usage

  1. Create a drawing file (zumen.json) directly under the project.
  2. Create a template file (**.*.ejs) in ./zumen/*
  3. run command 'npx zumen@latest'

  If the file to be created exists, an error will occur, but the -f option will forcibly overwrite it.
    <br>'<strong>npx zumen@latest -f</strong>'

# in detail

## 1. Drawing file file

Place the drawing file (zumen.json or zumen.yml, zumen.yaml) that describes the files to be created directly under the project.

### Drawing file contents

Describe the file structure in the drawing file. For folders, add / at the end of the item name, and for files, the item name will be "template name"="file name". See the example for details.
(The right hand side of equals is a string that will later be used in templates and to replace {name} in filenames.)

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
- Items under the item name with equals are optional, and you can set your favorite item name and value and deploy it as ejs in the template.(In the above example, "comment" is that)

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

# sample file link

### template sample
https://github.com/trysd/zumen/tree/master/zumen

### zumen.json sample
https://github.com/trysd/zumen/blob/master/zumen.json
