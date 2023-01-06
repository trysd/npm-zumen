import * as fs from 'fs-extra';

export class MUserInit {

  constructor(mapFileName: string, tplDirName: string) {

    /*
     * -----
     * json file
     * -----
     */
    if (
      !fs.pathExistsSync(`./${mapFileName}.json`)
      && !fs.pathExistsSync(`./${mapFileName}.yaml`)
      && !fs.pathExistsSync(`./${mapFileName}.yml`)
    ) {
      fs.outputFileSync(`./${mapFileName}.json`,
`{
  "src/": {
    "components/": {
      "sample/sample=hello": {
        "comment": "this is hello sample",
        "array": [100, 200, 300],
        "userFreeProperty": "abcdefg"
      },
      "Elements/": {
        "Buttons/": {
          "component=DialogOpen": {
            "comment": "Dialog open button."
          },
          "component=DialogClose": {
            "comment": "Dialog close button."
          },
          "story=Buttons": {
            "brings": "@component"
          },
          "index=": {
            "brings": "@component"
          },
          "__tests__/": {
            "test=Buttons": {
              "brings": "../@component"
            }
          }
        }
      }
    }
  }
}
`);
      console.log(`created: ./${mapFileName}.json`);
    }

    /*
     * -----
     * sample/sample file
     * -----
     */
    if (!fs.pathExistsSync(`./${tplDirName}/sample/sample={name}.js.ejs`)) {
      fs.mkdirsSync(`./${tplDirName}/sample/`);
      fs.outputFileSync(`./${tplDirName}/sample/sample={name}.js.ejs`,
`// <%= comment %>
<%#_ ejs comment _%>
<%_ for (var i = 0; i < array.length; i++) { _%>
<%= array[i] %>
<%_ } _%>
`);
      console.log(`created: ./${tplDirName}/sample/sample={name}.js.ejs`);
    }

    /*
     * -----
     * component file
     * -----
     */
    if (!fs.pathExistsSync(`./${tplDirName}/component={name}.tsx.ejs`)) {
      fs.outputFileSync(`./${tplDirName}/component={name}.tsx.ejs`,
`/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

/** <%= comment %> */
const <%= name %> = () => {
  return (
    <>
      <div css={main}>
        <%= name %>
      </div>
    </>
  );
}
const main = css\`
  margin: 0.2em;
\`;
export default <%= name %>
`);
      console.log(`created: ./${tplDirName}/component={name}.tsx.ejs`);
    }

    /*
     * -----
     * index file
     * -----
     */
    if (!fs.pathExistsSync(`./${tplDirName}/index=index.ts.ejs`)) {
      fs.outputFileSync(`./${tplDirName}/index=index.ts.ejs`,
`<%_ for (var i = 0; i < brings.length; i++) { _%>
export * from './<%= brings[i].name %>';
<%_ } _%>
`);
      console.log(`created: ./${tplDirName}/index=index.ts.ejs`);
    }
  
    /*
     * -----
     * story file
     * -----
     */
    if (!fs.pathExistsSync(`./${tplDirName}/story={name}.stories.tsx.ejs`)) {
      fs.outputFileSync(`./${tplDirName}/story={name}.stories.tsx.ejs`,
`import { Meta, Story } from '@storybook/react';
<%_ for (var i = 0; i < brings.length; i++) { _%>
import <%= brings[i].name %> from './<%= brings[i].name %>';
<%_ } _%>

const _Default = () => {
  return (
    <>
      <%_ for (var i = 0; i < brings.length; i++) { _%>
      <<%= brings[i].name %> />
      <%_ } _%>
    </>
  )
}

const meta: Meta = {
  title: '<%= path %>',
  component: _Default,
  parameters: {
    controls: { expanded: false },
  },
};
export default meta;

const Template: Story = () => <_Default />;

export const Default = Template.bind({});
Default.args = {};
`);
      console.log(`created: ./${tplDirName}/story={name}.stories.tsx.ejs`);
    }
  
    /*
     * -----
     * test file
     * -----
     */
    if (!fs.pathExistsSync(`./${tplDirName}/test={name}.test.tsx.ejs`)) {
      fs.outputFileSync(`./${tplDirName}/test={name}.test.tsx.ejs`,
`import { render, screen } from '@testing-library/react';
<%_ for (var i = 0; i < brings.length; i++) { _%>
import <%= brings[i].name %> from '<%= brings[i].path %><%= brings[i].name %>';
<%_ } _%>

test('Buttons is drawn', () => {
  // const { baseElement } = render(<<%= name %> />);
  // expect(screen.getByText('here Buttons')).toBeInTheDocument();
});
`);
      console.log(`created: ./${tplDirName}/test={name}.test.tsx.ejs`);
    }
  
  console.log('\x1b[36m' + 'Now run "npx zumen@latest" again to create the file!' + '\x1b[0m');
  }
}
