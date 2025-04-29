import { Paper, Tab, Tabs, Box, Button } from '@mui/material';
import { useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';

import type { IGameData } from '@/types/api';

import { GameBaseInfo } from './GameBaseInfo';
import { GameMediaView } from './GameMediaView';
import { GameRelationsView } from './GameRelationsView';
import { GameTechnicalView } from './GameTechnicalView';

interface IGameViewProps {
  game: IGameData;
}

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      aria-labelledby={`game-tab-${index}`}
      hidden={value !== index}
      id={`game-tabpanel-${index}`}
      role='tabpanel'
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const GameView = ({ game }: IGameViewProps) => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Paper sx={{ p: 4 }}>
      {/* Lien vers la vue publique */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color='primary'
          component='a'
          href={`/games/${game.id}`}
          rel='noopener noreferrer'
          size='small'
          startIcon={<FiExternalLink size={16} />}
          sx={{
            'borderRadius': 2,
            'textTransform': 'none',
            'gap': 0.5,
            '&:hover': {
              'bgcolor': 'action.hover',
              '& svg': {
                transform: 'translate(1px, -1px)',
              },
            },
            '& svg': {
              transition: 'transform 0.2s ease-in-out',
            },
          }}
          target='_blank'
          variant='outlined'
        >
          Voir sur le site
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          aria-label='game information tabs'
          value={currentTab}
          onChange={handleTabChange}
        >
          <Tab
            aria-controls='game-tabpanel-0'
            id='game-tab-0'
            label='Informations de base'
          />
          <Tab aria-controls='game-tabpanel-1' id='game-tab-1' label='Médias' />
          <Tab
            aria-controls='game-tabpanel-2'
            id='game-tab-2'
            label='Relations'
          />
          <Tab
            aria-controls='game-tabpanel-3'
            id='game-tab-3'
            label='Informations techniques'
          />
        </Tabs>
      </Box>

      <CustomTabPanel index={0} value={currentTab}>
        <GameBaseInfo game={game} />
      </CustomTabPanel>
      <CustomTabPanel index={1} value={currentTab}>
        <GameMediaView game={game} />
      </CustomTabPanel>
      <CustomTabPanel index={2} value={currentTab}>
        <GameRelationsView game={game} />
      </CustomTabPanel>
      <CustomTabPanel index={3} value={currentTab}>
        <GameTechnicalView game={game} />
      </CustomTabPanel>
    </Paper>
  );
};
