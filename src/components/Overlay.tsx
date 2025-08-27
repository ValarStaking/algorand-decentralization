import { createPortal } from "react-dom";

export const Overlay = ({ children }: { children: React.ReactNode }) =>
  createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {children}
    </div>,
    document.body,
  );
