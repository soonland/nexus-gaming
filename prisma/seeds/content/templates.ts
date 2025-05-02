import { GameGenre } from '@prisma/client';

export interface IReviewTemplate {
  titles: string[];
  introTemplates: string[];
  gameplayTemplates: string[];
  graphicsTemplates: string[];
  conclusionTemplates: string[];
}

export interface IPreviewTemplate {
  titles: string[];
  introTemplates: string[];
  contentTemplates: string[];
}

// Templates de génération de jeux
export const gameTemplates = {
  action: {
    titles: [
      'La Légende de {hero}',
      'Les Chroniques de {world}',
      '{hero}: Le Dernier Espoir',
      "L'Épopée de {hero}",
    ],
    descriptions: [
      'Dans un monde où {premise}, {hero} doit {mission}. Une aventure épique vous attend dans {world}.',
      "Plongez dans l'univers de {world} où {premise}. Incarnez {hero} dans sa quête pour {mission}.",
      "L'histoire se déroule dans {world}, un royaume où {premise}. {hero} devra {mission} pour sauver son peuple.",
    ],
    genres: [GameGenre.ACTION, GameGenre.ADVENTURE],
    premises: [
      'le chaos règne',
      'une ancienne prophétie refait surface',
      'la magie a disparu',
      "les ténèbres s'étendent",
    ],
    missions: [
      "restaurer l'équilibre",
      'vaincre les forces du mal',
      'découvrir la vérité',
      'sauver son royaume',
    ],
  },
  rpg: {
    titles: [
      "{world}: L'Héritage Perdu",
      'La Quête de {hero}',
      '{world} Origins',
      'Les Héros de {world}',
    ],
    descriptions: [
      "Un RPG épique dans l'univers de {world} où {premise}. Rejoignez {hero} dans sa quête pour {mission}.",
      'Explorez les vastes terres de {world}, où {premise}. En tant que {hero}, vous devrez {mission}.',
      'Dans les terres mystérieuses de {world}, {premise}. Guidez {hero} dans son voyage pour {mission}.',
    ],
    genres: [GameGenre.RPG, GameGenre.ADVENTURE],
    premises: [
      'une guerre millénaire fait rage',
      "d'anciennes reliques renferment un pouvoir immense",
      'les dieux ont abandonné les mortels',
      'une malédiction ancestrale se réveille',
    ],
    missions: [
      'rassembler les artefacts légendaires',
      'unir les peuples divisés',
      'percer les mystères du passé',
      'devenir le héros de la prophétie',
    ],
  },
};

// Templates d'articles
export const articleTemplates: {
  review: IReviewTemplate;
  preview: IPreviewTemplate;
} = {
  review: {
    titles: [
      'Test de {game} : Notre verdict détaillé',
      "{game} - L'analyse complète",
      'On a testé {game} : Que vaut-il vraiment ?',
      "{game} : Le nouveau chef-d'œuvre de {developer} ?",
    ],
    introTemplates: [
      'Après plus de {hours} heures passées sur {game}, le dernier titre de {developer}, nous sommes enfin prêts à vous livrer notre verdict détaillé.',
      "Très attendu, {game} est enfin disponible. Développé par {developer}, ce jeu promettait monts et merveilles. Mais qu'en est-il vraiment ?",
      'Le nouveau titre de {developer} est arrivé avec de grandes ambitions. Après une analyse approfondie de {game}, voici notre avis complet.',
    ],
    gameplayTemplates: [
      'Le gameplay de {game} se révèle {gameplay_quality}. {gameplay_detail}',
      'Au niveau des mécaniques de jeu, {game} propose une expérience {gameplay_quality}. {gameplay_detail}',
      'Le système de jeu mis en place par {developer} est {gameplay_quality}. {gameplay_detail}',
    ],
    graphicsTemplates: [
      'Visuellement, {game} est {graphics_quality}. {graphics_detail}',
      'Sur le plan graphique, la production de {developer} se montre {graphics_quality}. {graphics_detail}',
      "L'aspect visuel de {game} est {graphics_quality}. {graphics_detail}",
    ],
    conclusionTemplates: [
      '{game} est {final_verdict}. {conclusion_detail}',
      'Au final, cette production de {developer} se révèle {final_verdict}. {conclusion_detail}',
      "Pour conclure, {game} s'impose comme {final_verdict}. {conclusion_detail}",
    ],
  },
  preview: {
    titles: [
      'Preview de {game} : Nos premières impressions',
      '{game} : On y a joué en avant-première !',
      'Aperçu de {game} : Ce qui nous attend',
      '{game} : Notre preview exclusive',
    ],
    introTemplates: [
      "Nous avons eu l'occasion de découvrir {game} en avant-première. Voici ce que nous en avons pensé.",
      '{developer} nous a conviés à une session de présentation de {game}. Découvrez nos impressions.',
      "En développement chez {developer}, {game} s'annonce prometteur. Voici pourquoi.",
    ],
    contentTemplates: [
      'Cette première approche de {game} nous a {preview_impression}. {preview_detail}',
      "D'après ce que nous avons pu voir, {game} {preview_impression}. {preview_detail}",
      'Notre session de preview nous a {preview_impression}. {preview_detail}',
    ],
  },
};
