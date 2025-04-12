'use client';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Box,
  Text,
} from '@chakra-ui/react';
import type { Role } from '@prisma/client';
import { useRouter } from 'next/navigation';
import {
  BiDotsVertical,
  BiEdit,
  BiTrash,
  BiLock,
  BiPowerOff,
  BiCheckCircle,
} from 'react-icons/bi';

import { useAuth } from '@/hooks/useAuth';
import dayjs from '@/lib/dayjs';

interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    articles: number;
  };
}

interface UsersTableProps {
  users: User[];
  onToggleStatus: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

const roleColors = {
  ADMIN: 'red',
  MODERATOR: 'purple',
  EDITOR: 'blue',
  USER: 'gray',
  SYSADMIN: 'orange',
};

const RoleBadge = ({ role }: { role: Role }) => (
  <Badge colorScheme={roleColors[role]} fontSize='xs'>
    {role}
  </Badge>
);

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <Badge colorScheme={isActive ? 'green' : 'red'} fontSize='xs'>
    {isActive ? 'Active' : 'Inactive'}
  </Badge>
);

export default function UsersTable({
  users,
  onToggleStatus,
  onDelete,
}: UsersTableProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  return (
    <Box overflowX='auto'>
      <Table>
        <Thead>
          <Tr>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Articles</Th>
            <Th>Created</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user.id}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>
                <RoleBadge role={user.role} />
              </Td>
              <Td>
                <StatusBadge isActive={user.isActive} />
              </Td>
              <Td>
                <Text fontSize='sm'>{user._count.articles}</Text>
              </Td>
              <Td>
                <Text fontSize='sm'>
                  {dayjs(user.createdAt).format('MMM D, YYYY')}
                </Text>
              </Td>
              <Td>
                {user.role === 'SYSADMIN' &&
                currentUser?.role !== 'SYSADMIN' ? (
                  <IconButton
                    isDisabled
                    aria-label='Locked'
                    icon={<BiLock />}
                    size='sm'
                    variant='ghost'
                  />
                ) : (
                  <Menu>
                    <MenuButton
                      aria-label='Actions'
                      as={IconButton}
                      icon={<BiDotsVertical />}
                      size='sm'
                      variant='ghost'
                    />
                    <MenuList>
                      <MenuItem
                        icon={<BiEdit />}
                        onClick={() =>
                          router.push(`/admin/users/${user.id}/edit`)
                        }
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={
                          user.isActive ? <BiPowerOff /> : <BiCheckCircle />
                        }
                        isDisabled={user.id === currentUser?.id}
                        onClick={() => onToggleStatus(user.id, !user.isActive)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </MenuItem>
                      <MenuItem
                        color='red.500'
                        icon={<BiTrash />}
                        isDisabled={user.id === currentUser?.id}
                        onClick={() => onDelete(user.id)}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
