
import React from 'react';
import { SuggestedName, NamingConvention } from '../types';
import { NAMING_CONVENTION_LABELS, CONVENTION_ORDER } from '../constants';
import CopyButton from './CopyButton';

interface SuggestionCardProps {
  suggestion: SuggestedName;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4 md:p-6 mb-4 w-full">
      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
        Base Idea: <span className="italic text-slate-700 dark:text-slate-300">"{suggestion.baseName}"</span>
      </h3>
      <div className="space-y-3">
        {CONVENTION_ORDER.map((convention) => (
          <div key={convention} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-700 rounded-md">
            <div className="flex-grow">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
                {NAMING_CONVENTION_LABELS[convention]}:
              </span>
              <code className="text-sm text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 px-1.5 py-0.5 rounded">
                {suggestion[convention]}
              </code>
            </div>
            <CopyButton textToCopy={suggestion[convention]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionCard;
