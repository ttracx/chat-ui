import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup } from './Button';
import { action } from '@storybook/addon-actions';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The Button component is used to trigger an action or event.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'ghost', 'danger'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width of its container',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    iconPosition: {
      control: 'radio',
      options: ['leading', 'trailing'],
      description: 'Position of the icon relative to the text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Button Stories
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    onClick: action('clicked'),
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    onClick: action('clicked'),
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Tertiary Button',
    variant: 'tertiary',
    onClick: action('clicked'),
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    onClick: action('clicked'),
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
    onClick: action('clicked'),
  },
};

// Size Variations
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'small',
    variant: 'primary',
    onClick: action('clicked'),
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'medium',
    variant: 'primary',
    onClick: action('clicked'),
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'large',
    variant: 'primary',
    onClick: action('clicked'),
  },
};

// State Variations
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
    variant: 'primary',
    onClick: action('clicked'),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    variant: 'primary',
    onClick: action('clicked'),
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
    variant: 'primary',
    onClick: action('clicked'),
  },
};

// With Icons
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const WithLeadingIcon: Story = {
  args: {
    children: 'Button with Icon',
    icon: <StarIcon />,
    iconPosition: 'leading',
    variant: 'primary',
    onClick: action('clicked'),
  },
};

export const WithTrailingIcon: Story = {
  args: {
    children: 'Button with Icon',
    icon: <StarIcon />,
    iconPosition: 'trailing',
    variant: 'primary',
    onClick: action('clicked'),
  },
};

export const IconOnly: Story = {
  args: {
    icon: <StarIcon />,
    variant: 'primary',
    'aria-label': 'Star',
    onClick: action('clicked'),
  },
};

// Button Group Story
export const Group: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="ghost" onClick={action('cancel')}>
        Cancel
      </Button>
      <Button variant="tertiary" onClick={action('save-draft')}>
        Save Draft
      </Button>
      <Button variant="primary" onClick={action('publish')}>
        Publish
      </Button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ButtonGroup component arranges multiple buttons in a horizontal or vertical layout.',
      },
    },
  },
};

// Vertical Button Group
export const VerticalGroup: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" spacing="medium">
      <Button variant="primary" fullWidth onClick={action('option-1')}>
        Option 1
      </Button>
      <Button variant="secondary" fullWidth onClick={action('option-2')}>
        Option 2
      </Button>
      <Button variant="tertiary" fullWidth onClick={action('option-3')}>
        Option 3
      </Button>
    </ButtonGroup>
  ),
};

// Interactive Playground
export const Playground: Story = {
  args: {
    children: 'Playground Button',
    variant: 'primary',
    size: 'medium',
    fullWidth: false,
    loading: false,
    disabled: false,
    onClick: action('clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls to experiment with different button properties.',
      },
    },
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button variant="primary" size="small">Small Primary</Button>
        <Button variant="primary" size="medium">Medium Primary</Button>
        <Button variant="primary" size="large">Large Primary</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button variant="secondary" size="small">Small Secondary</Button>
        <Button variant="secondary" size="medium">Medium Secondary</Button>
        <Button variant="secondary" size="large">Large Secondary</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button variant="tertiary" size="small">Small Tertiary</Button>
        <Button variant="tertiary" size="medium">Medium Tertiary</Button>
        <Button variant="tertiary" size="large">Large Tertiary</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button variant="ghost" size="small">Small Ghost</Button>
        <Button variant="ghost" size="medium">Medium Ghost</Button>
        <Button variant="ghost" size="large">Large Ghost</Button>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Button variant="danger" size="small">Small Danger</Button>
        <Button variant="danger" size="medium">Medium Danger</Button>
        <Button variant="danger" size="large">Large Danger</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A showcase of all button variants and sizes.',
      },
    },
  },
};