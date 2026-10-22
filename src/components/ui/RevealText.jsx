import React from 'react';

// Splits text into masked words for scroll reveals.
// Wrap words in *asterisks* to set them in the italic accent.
// Drop {img:/path.jpg} between words for an inline photo chip.
// Use "\n" to force a line break.
const TOKEN = /(\*[^*]+\*|\{img:[^}]+\})/g;

export const RevealText = ({ as: Tag = 'span', text, mode = 'words', className = '', delay, ...rest }) => {
  const lines = String(text).split('\n');
  const label = text.replace(/\{img:[^}]+\}\s*/g, '').replace(/\*/g, '');
  let wordIndex = 0;

  return (
    <Tag className={className} data-reveal={mode} data-reveal-delay={delay} aria-label={label} {...rest}>
      {lines.map((line, li) => (
        <span className="rt-line" key={li} aria-hidden="true">
          {line
            .split(TOKEN)
            .filter(Boolean)
            .flatMap((chunk) => {
              if (chunk.startsWith('{img:')) {
                const key = wordIndex++;
                return (
                  <React.Fragment key={key}>
                    <span className="rt-word">
                      <span className="rt-inner rt-chip">
                        <img src={chunk.slice(5, -1).trim()} alt="" loading="lazy" />
                      </span>
                    </span>{' '}
                  </React.Fragment>
                );
              }
              const italic = chunk.startsWith('*') && chunk.endsWith('*');
              const words = (italic ? chunk.slice(1, -1) : chunk).split(/\s+/).filter(Boolean);
              return words.map((word) => {
                const key = wordIndex++;
                const inner = <span className="rt-inner">{word}</span>;
                return (
                  <React.Fragment key={key}>
                    <span className="rt-word">{italic ? <em>{inner}</em> : inner}</span>{' '}
                  </React.Fragment>
                );
              });
            })}
        </span>
      ))}
    </Tag>
  );
};

export default RevealText;
