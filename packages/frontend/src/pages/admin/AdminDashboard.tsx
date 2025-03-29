import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import {
  StarIcon,
  EditIcon,
  SettingsIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { DashboardCard } from '../../components/admin/DashboardCard';
import { useGames } from '../../hooks/useGames';
import { usePlatforms } from '../../hooks/usePlatforms';
import { getArticles } from '../../services/api/articles';
import { getCategories } from '../../services/api/categories';

interface DashboardStats {
  games: {
    total: number;
    latest?: string;
  };
  platforms: {
    total: number;
    latest?: string;
  };
  articles: {
    total: number;
    draft: number;
    latest?: string;
  };
  categories: {
    total: number;
    latest?: string;
  };
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    games: { total: 0 },
    platforms: { total: 0 },
    articles: { total: 0, draft: 0 },
    categories: { total: 0 },
  });
  const toast = useToast();
  const { games } = useGames();
  const { platforms } = usePlatforms();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesResponse, categories] = await Promise.all([
          getArticles(),
          getCategories()
        ]);
        
        const articles = articlesResponse.data;

        const newStats = {
          games: {
            total: games?.length ?? 0,
            latest: games?.[0]?.title,
          },
          platforms: {
            total: platforms?.length ?? 0,
            latest: platforms?.[0]?.name,
          },
          articles: {
            total: articles?.length ?? 0,
            draft: articles?.filter((a: { publishedAt: string }) => !a.publishedAt)?.length ?? 0,
            latest: articles?.[0]?.title,
          },
          categories: {
            total: categories.length,
            latest: categories[0]?.name ?? undefined,
          },
        };

        setStats(newStats);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les statistiques',
          status: 'error',
          duration: 5000,
        });
      }
    };

    fetchStats();
  }, [games, platforms, toast]);

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg">Tableau de bord</Heading>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <DashboardCard
          title="Jeux"
          icon={StarIcon}
          color="blue"
          stats={{
            main: stats.games.total.toString(),
            sub: stats.games.latest ? `Dernier ajout : ${stats.games.latest}` : 'Aucun jeu',
          }}
          actions={[
            { label: 'Voir tous', to: '/admin/games' },
            { label: 'Ajouter', to: '/admin/games/new', primary: true },
          ]}
        />

        <DashboardCard
          title="Plateformes"
          icon={SettingsIcon}
          color="purple"
          stats={{
            main: stats.platforms.total.toString(),
            sub: stats.platforms.latest ? `Dernière : ${stats.platforms.latest}` : 'Aucune plateforme',
          }}
          actions={[
            { label: 'Gérer', to: '/admin/platforms' },
            { label: 'Ajouter', to: '/admin/platforms/new', primary: true },
          ]}
        />

        <DashboardCard
          title="Articles"
          icon={EditIcon}
          color="green"
          stats={{
            main: stats.articles.total.toString(),
            sub: stats.articles.latest ? `Dernier : ${stats.articles.latest}` : 'Aucun article',
          }}
          actions={[
            { label: 'Voir tous', to: '/admin/articles' },
            { label: 'Rédiger', to: '/admin/articles/new', primary: true },
          ]}
          notifications={stats.articles.draft}
        />

        <DashboardCard
          title="Catégories"
          icon={ViewIcon}
          color="orange"
          stats={{
            main: stats.categories.total.toString(),
            sub: stats.categories.latest ? `Dernière : ${stats.categories.latest}` : 'Aucune catégorie',
          }}
          actions={[
            { label: 'Gérer', to: '/admin/categories' },
          ]}
        />
      </SimpleGrid>
    </Container>
  );
};
