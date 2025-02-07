import { ReactNode } from "react";
import { CornerTopLeftIcon } from "@radix-ui/react-icons";

interface LoadingWrapperProps {
  children: ReactNode;
  loading: boolean;
}

export const LoadingWrapper = ({ children, loading }: LoadingWrapperProps) => {
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <CornerTopLeftIcon className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
};
