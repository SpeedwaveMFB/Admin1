'use client';

import { HeroUIProvider as Provider } from '@heroui/react';

export function HeroUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider
      locale="en-US"
      className="min-h-screen"
    >
      {children}
    </Provider>
  );
}
