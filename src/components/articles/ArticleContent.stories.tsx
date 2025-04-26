import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { ArticleContent } from './ArticleContent';

const meta = {
  title: 'Articles/ArticleContent',
  component: ArticleContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Box sx={{ maxWidth: 800, width: '100%' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof ArticleContent>;

export default meta;
type Story = StoryObj<typeof ArticleContent>;

const shortContent = `Cet article explore les dernières tendances du jeu vidéo en 2025.

Les graphismes et les performances continuent de s'améliorer grâce aux nouvelles technologies.`;

const longContent = `L'Histoire des RPG japonais

Les RPG japonais (JRPG) ont une histoire riche qui remonte aux années 80. Dragon Quest, sorti en 1986, est considéré comme l'un des pionniers du genre. Il a établi de nombreuses conventions qui sont encore utilisées aujourd'hui.

Final Fantasy, lancé en 1987, a introduit des innovations importantes :
- Un système de combat au tour par tour raffiné
- Des personnages avec des classes distinctes
- Une histoire épique avec des rebondissements dramatiques

L'Âge d'Or des années 90

Les années 90 ont vu l'explosion du genre avec des titres emblématiques :
• Final Fantasy VI (1994)
• Chrono Trigger (1995)
• Suikoden (1995)
• Pokémon Rouge et Bleu (1996)
• Final Fantasy VII (1997)

Ces jeux ont repoussé les limites de la narration et des mécaniques de jeu, établissant les JRPG comme un genre majeur.

L'Évolution Moderne

Aujourd'hui, les JRPG continuent d'évoluer tout en respectant leurs racines. Des titres comme Persona 5 et Nier: Automata montrent que le genre peut encore innover tout en conservant ce qui le rend spécial.

Les développeurs modernes trouvent un équilibre entre :
- Tradition et innovation
- Accessibilité et profondeur
- Histoire et gameplay

L'avenir du genre semble prometteur, avec de nombreux projets excitants en développement.`;

const preformattedContent = `NOTES DE PATCH v2.0.0

NOUVEAUTÉS
----------
• Mode histoire complet
• 3 nouvelles zones
• Système de craft

ÉQUILIBRAGE
-----------
• Dégâts de l'épée : 10 -> 12
• Vitesse de course : +5%
• Temps de recharge : 30s -> 25s

CORRECTIONS
----------
• Correction du bug de sauvegarde
• Amélioration des performances
• Correction de typos`;

export const Default: Story = {
  args: {
    content: shortContent,
  },
};

export const Contained: Story = {
  args: {
    content: shortContent,
    variant: 'contained',
  },
};

export const LongContent: Story = {
  args: {
    content: longContent,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affiche un article complet avec plusieurs sections et une mise en forme complexe.',
      },
    },
  },
};

export const WithMaxHeight: Story = {
  args: {
    content: longContent,
    maxHeight: 300,
    showOverflow: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Limite la hauteur du contenu et ajoute une barre de défilement si nécessaire.',
      },
    },
  },
};

export const PreformattedText: Story = {
  args: {
    content: preformattedContent,
    variant: 'contained',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Préserve la mise en forme du texte, idéal pour les changelogs ou les contenus techniques.',
      },
    },
  },
};
