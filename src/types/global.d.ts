import 'react';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'c-option'?: string;
    'c-previous'?: string;
  }
}
