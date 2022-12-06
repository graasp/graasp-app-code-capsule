import isEqual from 'lodash.isequal';

import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  CHATBOT_PROMPT_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../../../config/appSettingsTypes';
import { MUTATION_KEYS, useMutation } from '../../../../config/queryClient';
import {
  REVIEW_MODE_SETTINGS_KEY,
  SETTING_ADD_CHATBOT_PROMPT_CY,
  SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY,
  SETTING_CHATBOT_PROMPT_LINE_NUMBER_CY,
  SETTING_INITIAL_PROMPT_CODE_EDITOR_CY,
  SETTING_MAIN_CODE_EDITOR_CY,
  SETTING_NEW_CHATBOT_PROMPT_KEY,
} from '../../../../config/selectors';
import {
  DEFAULT_CHATBOT_PROMPT_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../../../config/settings';
import {
  ChatbotPromptSettings,
  ChatbotPromptSettingsKeys,
  InstructorCodeSettingsKeys,
} from '../../../../interfaces/settings';
import SubmitButtons from '../../../common/settings/SubmitButtons';
import { useSettings } from '../../../context/SettingsContext';
import CustomDialog from '../../../layout/CustomDialog';
import CodeEditor from '../../../repl/CodeEditor';

const DEFAULT_EDITED_PROMPT = {
  id: '',
  data: DEFAULT_CHATBOT_PROMPT_SETTINGS,
};

const CodeReviewSettings: FC = () => {
  const { t } = useTranslation();
  const { mutate: postSettings } = useMutation<
    unknown,
    unknown,
    { name: string; data: ChatbotPromptSettings }
  >(MUTATION_KEYS.POST_APP_SETTING);
  const { mutate: patchSettings } = useMutation<
    unknown,
    unknown,
    { id: string; data: ChatbotPromptSettings }
  >(MUTATION_KEYS.PATCH_APP_SETTING);
  const { mutate: deleteSetting } = useMutation<
    unknown,
    unknown,
    { id: string }
  >(MUTATION_KEYS.DELETE_APP_SETTING);
  const {
    [INSTRUCTOR_CODE_VERSION_SETTINGS_NAME]:
      instructorCodeVersionSetting = DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
    chatbotPrompts,
    saveSettings,
  } = useSettings();
  const [
    instructorCodeVersionLocalSetting,
    setInstructorCodeVersionLocalSetting,
  ] = useState(instructorCodeVersionSetting);
  const [openModal, setOpenModal] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editedChatbotPrompt, setEditedChatbotPrompt] = useState(
    DEFAULT_EDITED_PROMPT,
  );

  const unsavedInstructorCodeVersionChanges = !isEqual(
    instructorCodeVersionLocalSetting,
    instructorCodeVersionSetting,
  );

  // update instructorCodeVersionLocalSetting value when setting changes
  useEffect(
    () => setInstructorCodeVersionLocalSetting(instructorCodeVersionSetting),
    [instructorCodeVersionSetting],
  );

  const handleNewChatbotPrompt = (): void => {
    setEditedChatbotPrompt(DEFAULT_EDITED_PROMPT);
    setOpenModal(true);
  };

  const closeModal = (): void => {
    setOpenModal(false);
  };

  const handleChangeChatbotPrompt = (
    key: string,
    value: string | number,
  ): void => {
    setEditedChatbotPrompt((prevSetting) => ({
      ...prevSetting,
      data: {
        ...prevSetting.data,
        [key]: value,
      },
    }));
    setUnsavedChanges(true);
  };

  return (
    <Stack spacing={1}>
      <FormLabel>{t('Code to review')}</FormLabel>
      <CodeEditor
        id={SETTING_MAIN_CODE_EDITOR_CY}
        value={
          instructorCodeVersionLocalSetting[InstructorCodeSettingsKeys.Code]
        }
        setValue={(newValue) =>
          setInstructorCodeVersionLocalSetting((prevSetting) => ({
            ...prevSetting,
            [InstructorCodeSettingsKeys.Code]: newValue,
          }))
        }
      />
      <FormLabel>{t('Chatbot Prompts')}</FormLabel>
      <Stack spacing={1}>
        {chatbotPrompts
          .sort((a, b) => (a.data.lineNumber < b.data.lineNumber ? -1 : 1))
          .map((s) => (
            <Card key={s.id} elevation={0} variant="outlined">
              <CardContent sx={{ pb: 0 }}>
                <Stack direction="row" spacing={1}>
                  <FormLabel>{t('Initial Prompt')}:</FormLabel>
                  <Typography>{s.data.initialPrompt}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <FormLabel>{t('Chatbot Prompt')}:</FormLabel>
                  <Typography>{s.data.chatbotPrompt}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <FormLabel>{t('Line Number (first line is 0)')}:</FormLabel>
                  <Typography>{s.data.lineNumber}</Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => deleteSetting({ id: s.id })}
                >
                  {t('Delete')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditedChatbotPrompt({ id: s.id, data: s.data });
                    setOpenModal(true);
                  }}
                >
                  {t('Edit')}
                </Button>
              </CardActions>
            </Card>
          ))}
      </Stack>
      <Button
        data-cy={SETTING_ADD_CHATBOT_PROMPT_CY}
        startIcon={<Add />}
        variant="outlined"
        onClick={handleNewChatbotPrompt}
      >
        {t('Add new Chatbot Prompt')}
      </Button>
      <SubmitButtons
        onCancel={() =>
          setInstructorCodeVersionLocalSetting(instructorCodeVersionSetting)
        }
        onSave={() =>
          saveSettings(
            INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
            instructorCodeVersionLocalSetting,
          )
        }
        settingKey={REVIEW_MODE_SETTINGS_KEY}
        unsavedChanges={unsavedInstructorCodeVersionChanges}
      />
      <CustomDialog
        open={openModal}
        onClose={closeModal}
        title={
          editedChatbotPrompt.id
            ? t('Edit Chatbot Prompt')
            : t('Add new Chatbot Prompt')
        }
        content={
          <Stack>
            <Box>
              <FormLabel>{t('Initial Prompt')}</FormLabel>
              <CodeEditor
                id={SETTING_INITIAL_PROMPT_CODE_EDITOR_CY}
                value={editedChatbotPrompt.data.initialPrompt}
                setValue={(value) =>
                  handleChangeChatbotPrompt(
                    ChatbotPromptSettingsKeys.InitialPrompt,
                    value,
                  )
                }
              />
            </Box>
            <Box>
              <FormLabel>{t('Chatbot Prompt')}</FormLabel>
              <CodeEditor
                id={SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY}
                value={editedChatbotPrompt.data.chatbotPrompt}
                setValue={(value) =>
                  handleChangeChatbotPrompt(
                    ChatbotPromptSettingsKeys.ChatbotPrompt,
                    value,
                  )
                }
              />
            </Box>
            <Box display="flex" flexDirection="column">
              <FormLabel>{t('Line Number (first line is 0)')}</FormLabel>
              <TextField
                data-cy={SETTING_CHATBOT_PROMPT_LINE_NUMBER_CY}
                type="number"
                value={editedChatbotPrompt.data.lineNumber}
                onChange={(e) =>
                  handleChangeChatbotPrompt(
                    ChatbotPromptSettingsKeys.LineNumber,
                    parseInt(e.target.value, 10),
                  )
                }
              />
            </Box>
          </Stack>
        }
        actions={
          <SubmitButtons
            onCancel={closeModal}
            onSave={() => {
              if (editedChatbotPrompt.id) {
                patchSettings(editedChatbotPrompt);
              } else {
                postSettings({
                  data: editedChatbotPrompt.data,
                  name: CHATBOT_PROMPT_SETTINGS_NAME,
                });
              }
              closeModal();
            }}
            settingKey={SETTING_NEW_CHATBOT_PROMPT_KEY}
            unsavedChanges={unsavedChanges}
          />
        }
      />
    </Stack>
  );
};
export default CodeReviewSettings;
