import { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

export type FastifyServerInstance = FastifyInstance<
  any,
  any,
  any,
  any,
  TypeBoxTypeProvider
>
