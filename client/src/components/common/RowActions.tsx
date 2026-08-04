import { tokens } from '@/theme/tokens';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';

interface RowActionsProps {
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RowActions({ onView, onEdit, onDelete }: RowActionsProps) {
  return (
    <Stack direction="row" spacing={0.25} justifyContent="flex-end">
      <Tooltip title="Ko'rish">
        <IconButton size="small" onClick={onView} sx={{ color: tokens.action.view }}>
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {onEdit && (
        <Tooltip title="Tahrirlash">
          <IconButton size="small" onClick={onEdit} sx={{ color: tokens.action.edit }}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip title="O'chirish">
          <IconButton size="small" onClick={onDelete} sx={{ color: tokens.action.delete }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
