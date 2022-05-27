import React, { FC } from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';
import { styled } from '@mui/material';
import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import { useSettings } from '../../context/SettingsContext';
import { SETTINGS } from '../../../interfaces/settings';

const CodeContainer = styled('div')({
  margin: 'auto',
  padding: '16px',
  maxWidth: '600px',
  width: '80vw',
  border: 'solid teal 1px',
  borderRadius: '4px',
  wordWrap: 'break-word',
});

const Code = styled('div')({
  margin: 0,
});

const Line = styled('pre')({
  display: 'table-row',
  margin: 0,
});

const LineNo = styled('span')({
  display: 'table-cell',
  textAlign: 'right',
  paddingRight: '1em',
  // allows users to select only the text and not the line numbers
  userSelect: 'none',
  opacity: 0.5,
});

const PlayerView: FC = () => {
  const { settings } = useSettings();
  const code = settings[SETTINGS.CODE];
  const programmingLanguage = settings[
    SETTINGS.PROGRAMMING_LANGUAGE
  ] as Language;

  return (
    <div data-cy={PLAYER_VIEW_CYPRESS}>
      This is the player view
      <CodeContainer>
        <Highlight
          Prism={defaultProps.Prism}
          theme={theme}
          code={code}
          language={programmingLanguage}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Code className={className} style={style}>
              {tokens.map((line, i) => (
                // eslint-disable-next-line react/jsx-key,react/jsx-props-no-spreading
                <Line {...getLineProps({ line, key: i })}>
                  <LineNo>{i + 1}</LineNo>
                  {line.map((token, key) => (
                    // eslint-disable-next-line react/jsx-key,react/jsx-props-no-spreading
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </Line>
              ))}
            </Code>
          )}
        </Highlight>
      </CodeContainer>
      <table>
        <tbody />
      </table>
    </div>
  );
};

export default PlayerView;
