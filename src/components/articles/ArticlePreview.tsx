'use client'

import React from 'react'
import {
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'
import type { Category, User } from '@prisma/client'
import { DateDisplay } from '@/components/common/DateDisplay'

interface ArticlePreviewProps {
  article: {
    id: string
    title: string
    content: string
    publishedAt: Date | string
    category: Pick<Category, 'name'> | null
    user: Pick<User, 'username'>
  }
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  if (!article.user) {
    console.error('Article is missing user data:', article)
  }
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <Card
      as={Link}
      href={`/articles/${article.id}`}
      bg={bgColor}
      h="100%"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)', textDecoration: 'none' }}
      overflow="hidden"
    >
      <CardBody>
        <Stack spacing={4}>
          {article.category && (
            <Badge colorScheme="blue" alignSelf="flex-start">
              {article.category.name}
            </Badge>
          )}
          <Heading size="md" noOfLines={2}>
            {article.title}
          </Heading>
          <Text fontSize="sm" color="gray.600" noOfLines={3}>
            {article.content}
          </Text>
          <HStack fontSize="sm" color="gray.500">
            <HStack>
              <Icon as={FaUser} />
              <Text>{article.user.username}</Text>
            </HStack>
            <DateDisplay date={article.publishedAt} />
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  )
}
