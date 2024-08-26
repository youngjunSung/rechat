import { createTheme } from '@mui/material';

export const customTheme = createTheme({
  typography: {
    fontFamily: 'pretendard',
    fontSize: 12,
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        // 스타일 오버라이드
        paper: {
          width: 350,
          borderRadius: '10px',
          '& .MuiDialogActions-root': {
            padding: '16px 24px',
          },
        },
      },
    },
  },
});
