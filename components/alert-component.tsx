import { Alert } from '@mui/material';

export interface AlertState {
  type: 'error' | 'warning' | 'info' | 'success' | null;
  message: string;
}

export const AlertComponent: React.FC<AlertState> = ({ type, message }) => {
  return type !== null ? <Alert severity={type}>{message}</Alert> : null;
};
