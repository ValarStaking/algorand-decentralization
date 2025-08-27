import { X } from "lucide-react"; // Optional: install with `npm i lucide-react`
import { useEffect } from "react";

import { Overlay } from "./Overlay";

const Disclaimer = ({
  isDisclaimerOpen,
  setIsDisclaimerOpen,
  title = "Disclaimer",
  confirmLabel = "Understood",
  showCloseIcon = false,
}: {
  isDisclaimerOpen: boolean;
  setIsDisclaimerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  confirmLabel?: string;
  showCloseIcon?: boolean;
}) => {
  const contentList: string[] = [
    "This product is provided as-is with no guarantees or warranties.",
    "All information is for educational and informational purposes only.",
    "Nothing on this site constitutes financial, legal, or investment advice.",
    "Always do your own research before making decisions.",
    "All analysis presented on this website is based on best-effort methodologies and the data available.",
    "Unless explicitly identified through public data or known affiliations, accounts are assumed to be owned and operated by distinct, anonymous entities.",
    "Users are encouraged to independently verify findings and consider the assumptions and limitations when interpreting the results.",
    // "This website contains affiliate links. We may earn a commission if you make a purchase through them.",
  ];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDisclaimerOpen(false);
    };
    if (isDisclaimerOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isDisclaimerOpen, setIsDisclaimerOpen]);

  if (!isDisclaimerOpen) return null;

  return (
    <Overlay>
      <div className="relative mx-4 flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-2xl">
        {showCloseIcon && (
          <button
            onClick={() => setIsDisclaimerOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        )}

        <h2 id="disclaimer-title" className="mb-4 text-xl font-semibold text-neutral-900">
          {title}
        </h2>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto pr-2">
          <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-700">
            {contentList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Fixed button at bottom */}
        <div className="mt-6 flex shrink-0 justify-center">
          <button
            onClick={() => setIsDisclaimerOpen(false)}
            className="rounded-lg bg-neutral-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default Disclaimer;
