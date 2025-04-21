'use client';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import {
  Container,
  Skeleton,
  Alert,
  Typography,
  Grid,
  Box,
} from '@mui/material';

import { ArticleCard } from '@/components/articles/ArticleCard';
import { useArticles } from '@/hooks/useArticles';

const ArticlesPage = () => {
  const { articles, isLoading, error } = useArticles({ limit: 100 });

  if (error) {
    return (
      <Container maxWidth='lg'>
        <Alert icon={<ReportProblemIcon />} severity='error' variant='outlined'>
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
              <Grid key={i} size={4}>
                <Skeleton
                  height={350}
                  sx={{ borderRadius: 1 }}
                  variant='rectangular'
                />
              </Grid>
            ))
          : articles.map(article => (
              <Grid key={article.id} size={4}>
                <ArticleCard article={article} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default ArticlesPage;
