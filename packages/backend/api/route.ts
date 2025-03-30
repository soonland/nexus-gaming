import { FastifyRequest, FastifyReply } from 'fastify'
import { createServer } from './server'

// Create server instance
const app = createServer()

// HTML template
const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nexus Gaming API</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
    <style>
      .api-link {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #1095c1;
        color: white;
        border-radius: 4px;
        text-decoration: none;
      }
      .api-link:hover {
        background: #0a6d8a;
      }
    </style>
  </head>
  <body>
    <main class="container">
      <h1>Nexus Gaming API</h1>
      <p>API pour la gestion de jeux vidéo, critiques et articles.</p>
      
      <h2>Documentation</h2>
      <a href="/api/documentation" class="api-link">
        Accéder à la documentation Swagger
      </a>

      <h2>Endpoints disponibles</h2>
      <ul>
        <li>/api/auth - Authentification</li>
        <li>/api/games - Gestion des jeux</li>
        <li>/api/articles - Gestion des articles</li>
        <li>/api/reviews - Gestion des critiques</li>
        <li>/api/platforms - Gestion des plateformes</li>
        <li>/api/categories - Gestion des catégories</li>
        <li>/api/companies - Gestion des entreprises</li>
      </ul>

      <h2>Environnement</h2>
      <ul>
        <li>Version : 1.0.0</li>
        <li>Documentation : <a href="/api/documentation">/api/documentation</a></li>
        <li>Health Check : <a href="/api/health">/api/health</a></li>
      </ul>
    </main>
  </body>
</html>`

// Add root route
app.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.type('text/html').send(html)
})

// Serverless handler
export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready()
  app.server.emit('request', req, reply)
}
