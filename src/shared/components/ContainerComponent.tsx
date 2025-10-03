import React from "react";
type Props = {
  className?: string;
  children: React.ReactNode;
};
function Container({ className, children }: Props) {
  return (
    <div
      className={`max-w-[500px] min-h-[100vh] bg-sky-100 mx-auto ${className}`}
    >
      <header className="flex justify-between items-center bg-blue-500 p-3">
        <i>X</i>
        <div>logo</div>
      </header>
      {children}
    </div>
  );
}

export default Container;
