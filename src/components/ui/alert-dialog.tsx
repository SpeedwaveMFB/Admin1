'use client';

import * as React from 'react';
import { Modal, ModalContent } from '@heroui/react';
import { cn } from '@/lib/utils';
import { herouiModalClassNames } from '@/lib/heroui-theme';
import { Button } from '@/components/ui/button';

type AlertDialogContextValue = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue>({});

function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>{children}</AlertDialogContext.Provider>
  );
}

const AlertDialogTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const AlertDialogOverlay = () => null;

const AlertDialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(AlertDialogContext);

    return (
      <Modal
        isOpen={open}
        onOpenChange={onOpenChange}
        isDismissable
        radius="lg"
        classNames={herouiModalClassNames}
        {...props}
      >
        <ModalContent className={cn('max-w-lg', className)}>
          {() => (
            <div ref={ref} className="flex flex-col gap-4 p-1">
              {children}
            </div>
          )}
        </ModalContent>
      </Modal>
    );
  }
);
AlertDialogContent.displayName = 'AlertDialogContent';

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
  )
);
AlertDialogTitle.displayName = 'AlertDialogTitle';

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-default-500', className)} {...props} />
  )
);
AlertDialogDescription.displayName = 'AlertDialogDescription';

function AlertDialogAction({
  className,
  asChild,
  children,
  onClick,
  disabled,
  type,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return children;
  }
  return (
    <Button className={className} onPress={onClick as never} isDisabled={disabled} type={type}>
      {children}
    </Button>
  );
}
AlertDialogAction.displayName = 'AlertDialogAction';

function AlertDialogCancel({
  className,
  children,
  onClick,
  disabled,
  type,
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="outline" className={cn('mt-0', className)} onPress={onClick as never} isDisabled={disabled} type={type}>
      {children}
    </Button>
  );
}
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
