// @catto/ui - FormCatto Stories
import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import FormCatto from './FormCatto';

const meta = {
  title: 'Components/FormCatto',
  component: FormCatto,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Form component built on react-hook-form with Zod validation. Requires react-hook-form, zod, and @hookform/resolvers as peer dependencies.',
      },
    },
  },
} satisfies Meta<typeof FormCatto>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple login schema
const loginSchema = z.object({
  email: z.string().email({ error: 'Please enter a valid email' }),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters' }),
  email: z.string().email({ error: 'Please enter a valid email' }),
  message: z
    .string()
    .min(10, { error: 'Message must be at least 10 characters' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const LoginForm: Story = {
  args: {
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
      },
    ],
    validationSchema: loginSchema,
    submitText: 'Sign In',
    onSubmit: (data: LoginFormData) => {
      console.log('Login submitted:', data);
      alert(`Logged in as ${data.email}`);
    },
  },
};

export const ContactForm: Story = {
  args: {
    fields: [
      { name: 'name', label: 'Name', placeholder: 'Your name' },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'your@email.com',
      },
      { name: 'message', label: 'Message', placeholder: 'Your message...' },
    ],
    validationSchema: contactSchema,
    submitText: 'Send Message',
    onSubmit: (data: ContactFormData) => {
      console.log('Contact form submitted:', data);
      alert(`Message sent from ${data.name}`);
    },
  },
};

export const WithCancelButton: Story = {
  args: {
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
      },
    ],
    validationSchema: loginSchema,
    submitText: 'Sign In',
    showCancelButton: true,
    cancelText: 'Go Back',
    onSubmit: (data: LoginFormData) => console.log('Submitted:', data),
    onCancel: () => console.log('Cancelled'),
  },
};

export const Submitting: Story = {
  args: {
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
      },
    ],
    validationSchema: z.object({ email: z.string().email() }),
    submitText: 'Submit',
    isSubmitting: true,
    onSubmit: () => {},
  },
};

export const WithError: Story = {
  args: {
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
      },
    ],
    validationSchema: z.object({ email: z.string().email() }),
    submitText: 'Submit',
    errorMessage: 'Something went wrong. Please try again.',
    onSubmit: () => {},
    onCloseError: () => console.log('Error dismissed'),
  },
};

export const WithCustomLabels: Story = {
  args: {
    fields: [
      {
        name: 'email',
        label: 'Correo Electrónico',
        type: 'email',
        placeholder: 'tu@email.com',
      },
      {
        name: 'password',
        label: 'Contraseña',
        type: 'password',
        placeholder: 'Tu contraseña',
      },
    ],
    validationSchema: loginSchema,
    labels: {
      submit: 'Iniciar Sesión',
      submitting: 'Enviando...',
      cancel: 'Cancelar',
      error: 'Error',
    },
    onSubmit: (data: LoginFormData) => console.log('Submitted:', data),
  },
};

export const Registration: Story = {
  args: {
    fields: [
      { name: 'firstName', label: 'First Name', placeholder: 'John' },
      { name: 'lastName', label: 'Last Name', placeholder: 'Doe' },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john@example.com',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Create a password',
      },
    ],
    validationSchema: z.object({
      firstName: z.string().min(2, { error: 'First name required' }),
      lastName: z.string().min(2, { error: 'Last name required' }),
      email: z.string().email({ error: 'Valid email required' }),
      password: z.string().min(8, { error: 'Password must be 8+ characters' }),
    }),
    submitText: 'Create Account',
    onSubmit: (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      console.log('Registration:', data);
      alert(`Welcome, ${data.firstName}!`);
    },
  },
};
