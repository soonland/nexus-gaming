import { Box } from '@chakra-ui/react'
import { CompanyList } from '../../components/companies/CompanyList'

export const CompanyListPage = () => {
  return (
    <Box p={4}>
      <CompanyList />
    </Box>
  )
}

export default CompanyListPage
