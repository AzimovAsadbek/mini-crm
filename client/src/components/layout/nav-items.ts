import type { SvgIconComponent } from '@mui/icons-material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

export interface NavItem {
  label: string;
  path: string;
  icon: SvgIconComponent;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardOutlinedIcon },
  { label: 'Customers', path: '/customers', icon: PeopleAltOutlinedIcon },
  { label: 'Projects', path: '/projects', icon: WorkOutlineIcon },
  { label: 'Tasks', path: '/tasks', icon: AssignmentOutlinedIcon },
  { label: 'Users', path: '/users', icon: GroupOutlinedIcon, adminOnly: true },
  { label: 'Profile', path: '/profile', icon: PersonOutlineIcon },
  { label: 'Settings', path: '/settings', icon: SettingsOutlinedIcon },
];
