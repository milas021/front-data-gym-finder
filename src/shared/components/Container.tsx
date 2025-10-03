import React from "react";
type Props = {
  className?: string;
  children: React.ReactNode;
};
function Container({ className, children }: Props) {
  return (
    <div className={`max-w-[500px] bg-amber-400 mx-auto ${className}`}>
      {children}
    </div>
  );
}

export default Container;
