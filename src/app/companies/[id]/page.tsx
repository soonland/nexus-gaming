'use client';
import {
  Container,
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ICompany {
  id: string;
  name: string;
  gamesAsDev: { id: string; title: string }[];
  gamesAsPub: { id: string; title: string }[];
}

const CompanyPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [company, setCompany] = useState<ICompany | null>(null);
  const [error, setError] = useState<string | null>(null); // Correction des doublons
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/companies/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setCompany(data);
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to fetch company data');
          setLoading(false);
        });
    }
  }, [id, setError]); // Ajout de setError au tableau de dépendances

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>;
  }

  if (!company) {
    return <Typography>No company data found</Typography>;
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant='h4'>{company.name}</Typography>
        <Stack spacing={4} sx={{ mt: 4 }}>
          <Box>
            <Typography sx={{ mb: 2 }} variant='h5'>
              Games Developed
            </Typography>
            {company.gamesAsDev.length > 0 ? (
              company.gamesAsDev.map(game => (
                <Card key={game.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant='body1'>{game.title}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No games developed</Typography>
            )}
          </Box>
          <Box>
            <Typography sx={{ mb: 2 }} variant='h5'>
              Games Published
            </Typography>
            {company.gamesAsPub.length > 0 ? (
              company.gamesAsPub.map(game => (
                <Card key={game.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant='body1'>{game.title}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography>No games published</Typography>
            )}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default CompanyPage;
