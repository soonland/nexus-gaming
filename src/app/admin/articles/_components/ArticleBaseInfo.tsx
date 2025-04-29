'use client';

import { Stack, Typography } from '@mui/material';

import { FieldBox } from '@/components/admin/common/FieldBox';
import { FormSection } from '@/components/admin/common/FormSection';
import { CategoryChip, ColorDot } from '@/components/common';
import dayjs from '@/lib/dayjs';

import { getStatusStyle } from './articleStyles';
import type { IArticleWithRelations } from './form';

interface IArticleBaseInfoProps {
  article: IArticleWithRelations;
}

export const ArticleBaseInfo = ({ article }: IArticleBaseInfoProps) => {
  return (
    <Stack spacing={3}>
      {/* Auteur et Date de création */}
      <Stack
        direction='row'
        spacing={3}
        sx={{ '& > *': { minWidth: '200px', flex: 1 } }}
      >
        <FormSection title='Auteur'>
          <FieldBox>
            <Typography variant='subtitle1'>{article.user.username}</Typography>
          </FieldBox>
        </FormSection>

        <FormSection title='Date de création'>
          <FieldBox>
            <Typography variant='subtitle1'>
              {dayjs(article.createdAt).format('LL')}
            </Typography>
          </FieldBox>
        </FormSection>
      </Stack>

      {/* Catégorie et Statut */}
      <Stack
        direction='row'
        spacing={3}
        sx={{ '& > *': { minWidth: '200px', flex: 1 } }}
      >
        <FormSection title='Catégorie'>
          <FieldBox>
            <CategoryChip category={article.category} />
          </FieldBox>
        </FormSection>

        <FormSection title='Statut'>
          <FieldBox>
            <ColorDot
              color={getStatusStyle(article.status).color}
              label={getStatusStyle(article.status).label}
            />
          </FieldBox>
        </FormSection>
      </Stack>

      {/* Date de publication (si publiée) */}
      {article.publishedAt && (
        <FormSection title='Date de publication'>
          <FieldBox>
            <Typography variant='subtitle1'>
              {dayjs(article.publishedAt).format('LL')}
            </Typography>
          </FieldBox>
        </FormSection>
      )}
    </Stack>
  );
};
