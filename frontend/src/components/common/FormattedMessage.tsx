import React from 'react';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isUser }) => {
  if (isUser) {
    return <div className="text-sm font-medium">{content}</div>;
  }

  // Parse markdown lines into structured elements
  const lines = content.split('\n');

  const parseInlineFormatting = (text: string) => {
    // Replace **bold** with strong
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-navy-950 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <span key={index} className="text-xs text-slate-500 dark:text-slate-400 italic">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Section Headers: ### or ## or **Header:**
        if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={idx} className="text-sm sm:text-base font-extrabold text-navy-900 dark:text-white pt-2 border-b border-slate-200/60 dark:border-slate-800 pb-1">
              {parseInlineFormatting(headerText)}
            </h4>
          );
        }

        // Bullet list item: • or - or *
        if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[•\-\*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-aqua-500 mt-2 shrink-0" />
              <span className="flex-1">{parseInlineFormatting(bulletText)}</span>
            </div>
          );
        }

        // Numbered list item: 1. 2. 3.
        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\.\s/)?.[1];
          const text = trimmed.replace(/^\d+\.\s/, '');
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 my-1.5">
              <span className="w-5 h-5 rounded-full bg-aqua-100 dark:bg-aqua-950 text-aqua-700 dark:text-aqua-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-aqua-200 dark:border-aqua-800">
                {num}
              </span>
              <span className="flex-1">{parseInlineFormatting(text)}</span>
            </div>
          );
        }

        // Italic Disclaimer block
        if (trimmed.startsWith('*Disclaimer:') || trimmed.startsWith('*Note:')) {
          return (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 italic mt-2">
              {parseInlineFormatting(trimmed)}
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {parseInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
};
