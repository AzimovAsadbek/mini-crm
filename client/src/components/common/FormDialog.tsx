import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import type { FormEventHandler, ReactNode } from 'react';

interface FormDialogProps {
  open: boolean;
  title: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClose: () => void;
  children: ReactNode;
}

export function FormDialog({
  open,
  title,
  submitLabel = 'Saqlash',
  isSubmitting = false,
  onSubmit,
  onClose,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogTitle sx={{ pr: 6 }}>
          {title}
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>{children}</DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Bekor qilish
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
