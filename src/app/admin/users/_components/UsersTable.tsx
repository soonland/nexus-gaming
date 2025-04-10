'use client'

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
  HStack,
  Box,
  Text,
} from '@chakra-ui/react'
import { BiDotsVertical, BiEdit, BiTrash, BiLock, BiPowerOff, BiCheckCircle } from 'react-icons/bi'
import { Role } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import dayjs from '@/lib/dayjs'

interface User {
  id: string
  username: string
  email: string
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    articles: number
  }
}

interface UsersTableProps {
  users: User[]
  onToggleStatus: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
}

const roleColors = {
  ADMIN: 'red',
  MODERATOR: 'purple',
  EDITOR: 'blue',
  USER: 'gray',
  SYSADMIN: 'orange',
}

const RoleBadge = ({ role }: { role: Role }) => (
  <Badge colorScheme={roleColors[role]} fontSize="xs">
    {role}
  </Badge>
)

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <Badge colorScheme={isActive ? 'green' : 'red'} fontSize="xs">
    {isActive ? 'Active' : 'Inactive'}
  </Badge>
)

export default function UsersTable({ users, onToggleStatus, onDelete }: UsersTableProps) {
  const router = useRouter()
  const { user: currentUser } = useAuth()

  return (
    <Box overflowX="auto">
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
          {users.map((user) => (
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
                <Text fontSize="sm">{user._count.articles}</Text>
              </Td>
              <Td>
                <Text fontSize="sm">
                  {dayjs(user.createdAt).format('MMM D, YYYY')}
                </Text>
              </Td>
              <Td>
                {user.role === 'SYSADMIN' && currentUser?.role !== 'SYSADMIN' ? (
                  <IconButton
                    icon={<BiLock />}
                    variant="ghost"
                    size="sm"
                    aria-label="Locked"
                    isDisabled
                  />
                ) : (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<BiDotsVertical />}
                      variant="ghost"
                      size="sm"
                      aria-label="Actions"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<BiEdit />}
                        onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={user.isActive ? <BiPowerOff /> : <BiCheckCircle />}
                        onClick={() => onToggleStatus(user.id, !user.isActive)}
                        isDisabled={user.id === currentUser?.id}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </MenuItem>
                      <MenuItem
                        icon={<BiTrash />}
                        onClick={() => onDelete(user.id)}
                        color="red.500"
                        isDisabled={user.id === currentUser?.id}
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
  )
}
