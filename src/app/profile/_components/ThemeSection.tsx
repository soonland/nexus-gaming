import {
  Box,
  Card,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  styled,
} from '@mui/material';

import { useNotifier } from '@/components/common/Notifier';
import type { ThemeOption } from '@/providers/ThemeProvider';
import { themeNames, useAppTheme } from '@/providers/ThemeProvider';

// Mini preview of each theme
const ThemePreview = styled(Card)(({ theme }) => ({
  'padding': theme.spacing(1),
  'cursor': 'pointer',
  'transition': 'transform 0.2s, border-color 0.2s',
  'border': `2px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
  },
}));

interface IPreviewProps {
  color: string;
}

// Mini navbar for preview
const PreviewNavbar = styled(Box)<IPreviewProps>(({ color }) => ({
  height: 20,
  backgroundColor: color,
  marginBottom: 8,
  borderRadius: 4,
}));

// Mini content blocks for preview
const PreviewContent = styled(Box)<IPreviewProps>(({ color }) => ({
  'height': 8,
  'backgroundColor': color,
  'marginBottom': 4,
  'borderRadius': 2,
  '&:last-child': {
    marginBottom: 0,
    width: '60%',
  },
}));

interface IThemeCardProps {
  theme: ThemeOption;
  selected: boolean;
  onSelect: () => void;
  primaryColor: string;
  paperBg: string;
}

const ThemeCard = ({
  theme,
  selected,
  onSelect,
  primaryColor,
  paperBg,
}: IThemeCardProps) => {
  return (
    <ThemePreview className={selected ? 'selected' : ''} onClick={onSelect}>
      <Box sx={{ mb: 1 }}>
        {/* Mini theme preview */}
        <PreviewNavbar color={primaryColor} />
        <Box sx={{ p: 0.5, bgcolor: paperBg, borderRadius: 1 }}>
          <PreviewContent color={alpha(primaryColor, 0.7)} />
          <PreviewContent color={alpha(primaryColor, 0.5)} />
          <PreviewContent color={alpha(primaryColor, 0.3)} />
        </Box>
      </Box>
      <Typography
        align='center'
        sx={{
          fontWeight: selected ? 500 : 400,
          color: selected ? 'primary.main' : 'text.primary',
        }}
        variant='body2'
      >
        {themeNames[theme]}
      </Typography>
    </ThemePreview>
  );
};

export const ThemeSection = () => {
  const { currentTheme, setTheme } = useAppTheme();
  const { showSuccess } = useNotifier();

  const handleThemeChange = (theme: ThemeOption) => {
    setTheme(theme);
    showSuccess(`Thème ${themeNames[theme]} activé`);
  };

  // Theme color mappings for previews
  const themeColors = {
    light: {
      primary: '#1976d2',
      paper: '#ffffff',
      default: '#f5f5f5',
    },
    dark: {
      primary: '#90caf9',
      paper: '#1e1e1e',
      default: '#121212',
    },
    gaming: {
      primary: '#00ff00',
      paper: '#2d2d2d',
      default: '#1a1a1a',
    },
    retro: {
      primary: '#ffcc00',
      paper: '#3d3d3d',
      default: '#2d2d2d',
    },
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant='h6'>Thème de l&apos;interface</Typography>

        <Grid container spacing={2}>
          {(Object.keys(themeNames) as ThemeOption[]).map(themeOption => (
            <Grid key={themeOption} size={6}>
              <ThemeCard
                paperBg={themeColors[themeOption].default}
                primaryColor={themeColors[themeOption].primary}
                selected={currentTheme === themeOption}
                theme={themeOption}
                onSelect={() => handleThemeChange(themeOption)}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
};
