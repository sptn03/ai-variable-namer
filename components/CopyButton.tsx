
import React, { useState, useCallback } from 'react';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.625v2.625m-7.5-2.625v2.625m0-2.625H12m0 0V9.75m0 0A2.25 2.25 0 009.75 7.5H7.5M12 9.75A2.25 2.25 0 0114.25 7.5H15m0-3V5.25m0 0A2.25 2.25 0 0012.75 3H12m0 0A2.25 2.25 0 009.75 5.25V7.5" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
</svg>
);


const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) {
      // Fallback for older browsers or insecure contexts
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Failed to copy text.');
      }
      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
      }, (err) => {
        console.error('Async: Could not copy text: ', err);
        alert('Failed to copy text.');
      });
    }

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-all duration-150 ease-in-out
                  ${copied 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'}`}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
    </button>
  );
};

export default CopyButton;
