import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, InputAdornment, type TextFieldProps } from '@mui/material';
import { useState } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { RHFTextField } from './RHFTextField';

type RHFPasswordFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & Omit<TextFieldProps, 'name' | 'type' | 'error' | 'helperText' | 'value' | 'onChange'>;

/** Parol maydoni — ko'rsatish/yashirish tugmasi bilan. */
export function RHFPasswordField<T extends FieldValues>({
  name,
  control,
  ...props
}: RHFPasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

  return (
    <RHFTextField
      {...props}
      name={name}
      control={control}
      type={visible ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? 'Parolni yashirish' : "Parolni ko'rsatish"}
              >
                {visible ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
