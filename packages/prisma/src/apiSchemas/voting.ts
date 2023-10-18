import { z } from "zod";
import { VoteSchema, MessageSchema } from "../generated/zod";


/** Esquema para realizacao de um voto em uma task - request */
export const voteSchemaReq = VoteSchema.pick({ points: true }).strict();

/** Esquema para realizacao de um voto em uma task - response */
export const voteSchemaRes = VoteSchema.strict();

/** Esquema para realizacao de um comentario em uma task - request */
export const messageSchemaReq = MessageSchema.pick({ message: true }).strict();

/** Esquema para realizacao de um voto em uma task - response */
export const messageSchemaRes = MessageSchema.strict();


// Tipos
export type VoteSchemaReq = typeof voteSchemaReq;
export type VoteSchemaRes = typeof voteSchemaRes;
export type MessageSchemaReq = typeof messageSchemaReq;
export type MessageSchemaRes = typeof messageSchemaRes;