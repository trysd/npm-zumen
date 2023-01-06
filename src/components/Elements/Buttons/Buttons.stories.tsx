import { Meta, Story } from '@storybook/react';
import DialogOpen from './DialogOpen';
import DialogClose from './DialogClose';

const _Default = () => {
  return (
    <>
      <DialogOpen />
      <DialogClose />
    </>
  )
}

const meta: Meta = {
  title: 'src/components/Elements/Buttons/',
  component: _Default,
  parameters: {
    controls: { expanded: false },
  },
};
export default meta;

const Template: Story = () => <_Default />;

export const Default = Template.bind({});
Default.args = {};
