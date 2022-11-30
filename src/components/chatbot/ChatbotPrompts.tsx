import { FC } from 'react';

import { ChatbotPromptSettingsKeys } from '../../interfaces/settings';
import { useSettings } from '../context/SettingsContext';

type Props = {
  line: number;
};

const ChatbotPrompts: FC<Props> = ({ line }) => {
  // if a message already exists with the prompt id we should not display this prompt
  const { chatbotPrompts } = useSettings();
  const currentLinePrompt = chatbotPrompts.find(
    (c) => c.data[ChatbotPromptSettingsKeys.LineNumber] === line,
  );
  if (currentLinePrompt) {
    return <div>{`Prompt ${line}`}</div>;
  }
  return null;
};
export default ChatbotPrompts;
