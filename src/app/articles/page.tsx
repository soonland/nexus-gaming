'use client';

import {
  Container,
  Skeleton,
  Alert,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

import { ArticleCard } from '@/components/articles/ArticleCard';
import { useArticles } from '@/hooks/useArticles';

const ArticlesPage = () => {
  const { articles, isLoading, error } = useArticles({ limit: 100 });

  if (error) {
    return (
      <Container maxWidth='lg'>
        <Alert icon={<FiAlertTriangle />} severity='error' variant='outlined'>
          Error loading articles
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Box mb={4}>
        <Typography component='h1' variant='h4'>
          Articles
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {isLoading
          ? [...Array(3)].map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton
                  height={350}
                  sx={{ borderRadius: 1 }}
                  variant='rectangular'
                />
              </Grid>
            ))
          : articles.map(article => (
              <Grid key={article.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ArticleCard article={article} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default ArticlesPage;
