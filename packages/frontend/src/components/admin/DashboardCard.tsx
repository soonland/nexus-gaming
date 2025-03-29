import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

interface Action {
  label: string;
  to: string;
  primary?: boolean;
}

interface DashboardCardProps {
  title: string;
  icon: typeof ArrowForwardIcon;
  stats: {
    main: string;
    sub: string;
  };
  color: string;
  actions: Action[];
  notifications?: number;
}

export const DashboardCard = ({
  title,
  icon,
  stats,
  color,
  actions,
  notifications,
}: DashboardCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      p={6}
      position="relative"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={icon} boxSize={6} color={color} />
            <Heading size="md">{title}</Heading>
          </HStack>
          {notifications !== undefined && notifications > 0 && (
            <Badge colorScheme={color} borderRadius="full" px={2}>
              {notifications}
            </Badge>
          )}
        </HStack>

        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {stats.main}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {stats.sub}
          </Text>
        </Box>

        <HStack spacing={2} justify="flex-end">
          {actions.map((action, index) => (
            <Button
              key={index}
              as={RouterLink}
              to={action.to}
              colorScheme={action.primary ? color : undefined}
              variant={action.primary ? 'solid' : 'ghost'}
              size="sm"
              rightIcon={action.primary ? <ArrowForwardIcon /> : undefined}
            >
              {action.label}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};
