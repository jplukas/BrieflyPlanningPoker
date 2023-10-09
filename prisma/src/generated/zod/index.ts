import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// DECIMAL
//------------------------------------------------------

export const DecimalJSLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), });

export const DecimalJSLikeListSchema: z.ZodType<Prisma.DecimalJsLike[]> = z.object({ d: z.array(z.number()), e: z.number(), s: z.number(), toFixed: z.function().args().returns(z.string()), }).array();

export const DECIMAL_STRING_REGEX = /^[0-9.,e+-bxffo_cp]+$|Infinity|NaN/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const SquadScalarFieldEnumSchema = z.enum(['id','name','maxRounds','percentual','enabled','updatedAt','createdAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','enabled','updatedAt','createdAt']);

export const UsersOnSquadsScalarFieldEnumSchema = z.enum(['userId','squadId','enabled','updatedAt','createdAt']);

export const TaskScalarFieldEnumSchema = z.enum(['id','squadId','name','description','maxRounds','currentRound','percentual','points','finished','active','enabled','updatedAt','createdAt']);

export const MessageScalarFieldEnumSchema = z.enum(['id','taskId','userId','round','message','createdAt']);

export const VoteScalarFieldEnumSchema = z.enum(['taskId','userId','round','points','createdAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// SQUAD SCHEMA
/////////////////////////////////////////

export const SquadSchema = z.object({
  // omitted: id: z.string().uuid(),
  name: z.string(),
  maxRounds: z.number().int(),
  percentual: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: "Field 'percentual' must be a Decimal. Location: ['Models', 'Squad']",  }),
  enabled: z.boolean(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdAt: z.coerce.date(),
})

export type Squad = z.infer<typeof SquadSchema>

/////////////////////////////////////////
// SQUAD PARTIAL SCHEMA
/////////////////////////////////////////

export const SquadPartialSchema = SquadSchema.partial()

export type SquadPartial = z.infer<typeof SquadPartialSchema>

// SQUAD OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const SquadOptionalDefaultsSchema = SquadSchema.merge(z.object({
  // omitted: id: z.string().uuid().optional(),
  enabled: z.boolean().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  // omitted: createdAt: z.coerce.date().optional(),
}))

export type SquadOptionalDefaults = z.infer<typeof SquadOptionalDefaultsSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  // omitted: id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  enabled: z.boolean(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER PARTIAL SCHEMA
/////////////////////////////////////////

export const UserPartialSchema = UserSchema.partial()

export type UserPartial = z.infer<typeof UserPartialSchema>

// USER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UserOptionalDefaultsSchema = UserSchema.merge(z.object({
  // omitted: id: z.string().uuid().optional(),
  enabled: z.boolean().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  // omitted: createdAt: z.coerce.date().optional(),
}))

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>

/////////////////////////////////////////
// USERS ON SQUADS SCHEMA
/////////////////////////////////////////

export const UsersOnSquadsSchema = z.object({
  userId: z.string(),
  squadId: z.string(),
  enabled: z.boolean(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdAt: z.coerce.date(),
})

export type UsersOnSquads = z.infer<typeof UsersOnSquadsSchema>

/////////////////////////////////////////
// USERS ON SQUADS PARTIAL SCHEMA
/////////////////////////////////////////

export const UsersOnSquadsPartialSchema = UsersOnSquadsSchema.partial()

export type UsersOnSquadsPartial = z.infer<typeof UsersOnSquadsPartialSchema>

// USERS ON SQUADS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const UsersOnSquadsOptionalDefaultsSchema = UsersOnSquadsSchema.merge(z.object({
  enabled: z.boolean().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  // omitted: createdAt: z.coerce.date().optional(),
}))

export type UsersOnSquadsOptionalDefaults = z.infer<typeof UsersOnSquadsOptionalDefaultsSchema>

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const TaskSchema = z.object({
  // omitted: id: z.string().uuid(),
  squadId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  maxRounds: z.number().int(),
  // omitted: currentRound: z.number().int(),
  percentual: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: "Field 'percentual' must be a Decimal. Location: ['Models', 'Task']",  }),
  // omitted: points: z.number().int().nullable(),
  finished: z.boolean(),
  active: z.boolean(),
  enabled: z.boolean(),
  // omitted: updatedAt: z.coerce.date(),
  // omitted: createdAt: z.coerce.date(),
})

export type Task = z.infer<typeof TaskSchema>

/////////////////////////////////////////
// TASK PARTIAL SCHEMA
/////////////////////////////////////////

export const TaskPartialSchema = TaskSchema.partial()

export type TaskPartial = z.infer<typeof TaskPartialSchema>

// TASK OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const TaskOptionalDefaultsSchema = TaskSchema.merge(z.object({
  // omitted: id: z.string().uuid().optional(),
  maxRounds: z.number().int().optional(),
  // omitted: currentRound: z.number().int().optional(),
  percentual: z.union([z.number(),z.string(),DecimalJSLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: "Field 'percentual' must be a Decimal. Location: ['Models', 'Task']",  }).optional(),
  finished: z.boolean().optional(),
  active: z.boolean().optional(),
  enabled: z.boolean().optional(),
  // omitted: updatedAt: z.coerce.date().optional(),
  // omitted: createdAt: z.coerce.date().optional(),
}))

export type TaskOptionalDefaults = z.infer<typeof TaskOptionalDefaultsSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  // omitted: id: z.string().uuid(),
  taskId: z.string(),
  userId: z.string(),
  // omitted: round: z.number().int(),
  message: z.string(),
  // omitted: createdAt: z.coerce.date(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// MESSAGE PARTIAL SCHEMA
/////////////////////////////////////////

export const MessagePartialSchema = MessageSchema.partial()

export type MessagePartial = z.infer<typeof MessagePartialSchema>

// MESSAGE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const MessageOptionalDefaultsSchema = MessageSchema.merge(z.object({
  // omitted: id: z.string().uuid().optional(),
  // omitted: round: z.number().int().optional(),
  // omitted: createdAt: z.coerce.date().optional(),
}))

export type MessageOptionalDefaults = z.infer<typeof MessageOptionalDefaultsSchema>

/////////////////////////////////////////
// VOTE SCHEMA
/////////////////////////////////////////

export const VoteSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
  // omitted: round: z.number().int(),
  points: z.number().int(),
  // omitted: createdAt: z.coerce.date(),
})

export type Vote = z.infer<typeof VoteSchema>

/////////////////////////////////////////
// VOTE PARTIAL SCHEMA
/////////////////////////////////////////

export const VotePartialSchema = VoteSchema.partial()

export type VotePartial = z.infer<typeof VotePartialSchema>

// VOTE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const VoteOptionalDefaultsSchema = VoteSchema.merge(z.object({
  // omitted: round: z.number().int().optional(),
  // omitted: createdAt: z.coerce.date().optional(),
}))

export type VoteOptionalDefaults = z.infer<typeof VoteOptionalDefaultsSchema>