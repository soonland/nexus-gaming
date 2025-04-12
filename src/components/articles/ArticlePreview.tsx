'use client';

import {
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import type { Category, User } from '@prisma/client';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

import { DateDisplay } from '@/components/common/DateDisplay';

interface IArticlePreviewProps {
  article: {
    id: string;
    title: string;
    content: string;
    publishedAt: Date | string;
    category: Pick<Category, 'name'> | null;
    user: Pick<User, 'username'>;
  };
}

export const ArticlePreview = ({ article }: IArticlePreviewProps) => {
  if (!article.user) {
    console.error('Article is missing user data:', article);
  }
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Card
      _hover={{ transform: 'translateY(-4px)', textDecoration: 'none' }}
      as={Link}
      bg={bgColor}
      h='100%'
      href={`/articles/${article.id}`}
      overflow='hidden'
      transition='transform 0.2s'
    >
      <CardBody>
        <Stack spacing={4}>
          {article.category && (
            <Badge alignSelf='flex-start' colorScheme='blue'>
              {article.category.name}
            </Badge>
          )}
          <Heading noOfLines={2} size='md'>
            {article.title}
          </Heading>
          <Text color='gray.600' fontSize='sm' noOfLines={3}>
            {article.content}
          </Text>
          <HStack color='gray.500' fontSize='sm'>
            <HStack>
              <Icon as={FaUser} />
              <Text>{article.user.username}</Text>
            </HStack>
            <DateDisplay date={article.publishedAt} />
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};
