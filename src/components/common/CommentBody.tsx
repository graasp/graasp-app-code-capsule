import React, { FC, PropsWithChildren, ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import vsLight from 'prism-react-renderer/themes/vsLight';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import { styled } from '@mui/material';

const StyledReactMarkdown = styled(ReactMarkdown)(({ theme }) => ({
  '& .prism-code': {
    fontFamily: 'var(--monospace-fonts)',
    // margin: theme.spacing(1),
    backgroundColor: 'transparent !important',
    fontSize: '0.8rem',
    padding: theme.spacing(1),
  },
  '& :last-child': {
    marginBottom: 0,
  },
  '& div.token-line': {
    fontFamily: 'var(--monospace-fonts)',
  },
  // set margins for all elements
  '& p, ul ': {
    marginBlockStart: theme.spacing(0),
    marginBlockEnd: theme.spacing(1),
    fontFamily: theme.typography.fontFamily,
    fontSize: '1rem',
  },
  '& p': {
    lineHeight: '1.5',
  },
  '& ul': {
    // define offset for list
    paddingInlineStart: theme.spacing(2),
  },
  '& code': {
    padding: '0.2em 0.4em',
    borderRadius: theme.spacing(1),
    backgroundColor: 'var(--code-bg)',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontSize: '90%',
    fontFamily: 'var(--monospace-fonts)',
  },
  '& pre': {
    margin: theme.spacing(1, 2),
    backgroundColor: 'var(--code-bg)',
    // border: 'solid 1px silver',
    borderRadius: theme.spacing(1),
  },
  '& blockquote': {
    borderLeft: 'solid darkgray 4px',
    color: 'darkgray',
    marginLeft: '0',
    paddingLeft: theme.spacing(2),
  },
  '& table, th, td, tr': {
    border: 'solid black 1px ',
  },
  '& table': {
    borderCollapse: 'collapse',
  },
  // alternate background colors in table rows
  '& tr:nth-of-type(even)': {
    backgroundColor: 'lightgray',
  },
}));

type Props = {
  children: string;
};

const renderCode = ({
  inline,
  className: classNameInit,
  children: codeContent,
  ...props
}: CodeProps): ReactElement => {
  const match = /language-(\w+)/.exec(classNameInit || '');
  return !inline && match ? (
    <Highlight
      {...defaultProps}
      theme={vsLight}
      code={String(codeContent).replace(/\n$/, '')}
      language={match[1] as Language}
      {...props}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={className} style={style}>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div
              {...getLineProps({
                line,
                key: i,
              })}
            >
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span
                  {...getTokenProps({
                    token,
                    key,
                  })}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </Highlight>
  ) : (
    <code className={classNameInit} {...props}>
      {codeContent}
    </code>
  );
};

const CommentBody: FC<PropsWithChildren<Props>> = ({ children }) => (
  <StyledReactMarkdown
    linkTarget="_blank"
    remarkPlugins={[remarkGfm, remarkBreaks]}
    components={{
      code: renderCode,
    }}
  >
    {children}
  </StyledReactMarkdown>
);

export default CommentBody;
