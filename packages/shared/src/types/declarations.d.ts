// This file contains declarations for modules that might be causing problems

// If @auth/core types are still problematic
declare module '@auth/core/types' {
  export interface RequestInternal {}
  export interface InternalOptions {}
  export interface ResponseInternal {}
}

// If you need to declare nodemailer as a module
declare module 'nodemailer';

// For @simplewebauthn/types if needed
// declare module '@simplewebauthn/types';
