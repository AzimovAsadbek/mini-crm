import type { SelectOption } from '@/types';
import { MenuItem, TextField, type TextFieldProps } from '@mui/material';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type RHFSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: SelectOption[];
  emptyLabel?: string;
} & Omit<TextFieldProps, 'name' | 'error' | 'helperText' | 'value' | 'onChange' | 'select'>;

export function RHFSelect<T extends FieldValues>({
  name,
  control,
  options,
  emptyLabel,
  ...props
}: RHFSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ''}
          select
          fullWidth
          size="small"
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          {...props}
        >
          {emptyLabel && (
            <MenuItem value="">
              <em>{emptyLabel}</em>
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
