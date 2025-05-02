import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
import type { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';

import { CategoryChip } from '@/components/common/CategoryChip';
import { DateDisplay } from '@/components/common/DateDisplay';
import { useAuth } from '@/hooks/useAuth';
import { canDeleteArticles } from '@/lib/permissions';

import { ArticleStatusChip } from './ArticleStatusChip';
import type { IArticleWithRelations } from './form/types';
import { GamesList } from './GamesList';

interface IProps {
  article: IArticleWithRelations;
  onDelete?: () => void;
}

export const ArticleBaseInfo = ({ article, onDelete }: IProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const canDelete = canDeleteArticles(
    user?.role as Role,
    { status: article.status, userId: article.user.id },
    user?.id
  );

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography component='h2' variant='h5'>
              {article.title}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom color='textSecondary'>
              Auteur: {article.user.username}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom color='textSecondary'>
              Créé le: <DateDisplay date={new Date(article.createdAt)} />
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom component='div'>
              Statut: <ArticleStatusChip status={article.status} />
            </Typography>
          </Grid>

          <Grid size={12}>
            <Typography gutterBottom component='div'>
              Catégorie:{' '}
              {article.category && (
                <CategoryChip
                  bgColor={article.category.color || undefined}
                  name={article.category.name}
                />
              )}
            </Typography>
          </Grid>

          {article.games && article.games.length > 0 && (
            <Grid size={12}>
              <Typography gutterBottom component='div'>
                Jeux associés:
              </Typography>
              <GamesList games={article.games} />
            </Grid>
          )}
        </Grid>
      </CardContent>

      <CardActions>
        <Button
          color='primary'
          size='small'
          onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
        >
          Modifier
        </Button>
        {canDelete && onDelete && (
          <Button color='error' size='small' onClick={onDelete}>
            Supprimer
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
