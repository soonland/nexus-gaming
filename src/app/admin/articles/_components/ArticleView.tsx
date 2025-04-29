'use client';

import { Paper, Tab, Tabs, Box, Button } from '@mui/material';
import { useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';

import { ArticleBaseInfo } from './ArticleBaseInfo';
import { ArticleContentView } from './ArticleContentView';
import { ArticleHistoryView } from './ArticleHistoryView';
import { ArticleRelationsView } from './ArticleRelationsView';
import type { IArticleWithRelations } from './form';

interface IArticleViewProps {
  article: IArticleWithRelations;
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
      aria-labelledby={`article-tab-${index}`}
      hidden={value !== index}
      id={`article-tabpanel-${index}`}
      role='tabpanel'
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const ArticleView = ({ article }: IArticleViewProps) => {
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
          href={`/articles/${article.id}`}
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
          aria-label='article information tabs'
          value={currentTab}
          onChange={handleTabChange}
        >
          <Tab
            aria-controls='article-tabpanel-0'
            id='article-tab-0'
            label='Informations de base'
          />
          <Tab
            aria-controls='article-tabpanel-1'
            id='article-tab-1'
            label='Contenu'
          />
          <Tab
            aria-controls='article-tabpanel-2'
            id='article-tab-2'
            label='Relations'
          />
          <Tab
            aria-controls='article-tabpanel-3'
            id='article-tab-3'
            label='Historique'
          />
        </Tabs>
      </Box>

      <CustomTabPanel index={0} value={currentTab}>
        <ArticleBaseInfo article={article} />
      </CustomTabPanel>
      <CustomTabPanel index={1} value={currentTab}>
        <ArticleContentView article={article} />
      </CustomTabPanel>
      <CustomTabPanel index={2} value={currentTab}>
        <ArticleRelationsView article={article} />
      </CustomTabPanel>
      <CustomTabPanel index={3} value={currentTab}>
        <ArticleHistoryView article={article} />
      </CustomTabPanel>
    </Paper>
  );
};
