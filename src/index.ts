import { z } from "zod";

type IsAny<T> =
  [any extends T ? "true" : "false"] extends ["true"] ? true : false;
type NonOptional<T> = T extends undefined ? never : T;
type equals<X, Y> =
  [X] extends [Y] ?
    [Y] extends [X] ?
      true
    : false
  : false;

type toZodExtended<T extends z.ZodTypeAny> =
  | T
  | z.ZodDefault<T>
  | z.ZodUnion<[T, ...z.ZodTypeAny[]]>
  | z.ZodEffects<T>;

export type toZod<T> = {
  any: z.ZodTypeAny;
  optional: toZodExtended<z.ZodOptional<toZod<NonOptional<T>>>>;
  nullable: toZodExtended<z.ZodNullable<toZod<NonNullable<T>>>>;
  array: T extends Array<infer U> ? toZodExtended<z.ZodArray<toZod<U>>> : never;
  string: toZodExtended<z.ZodString>;
  bigint: toZodExtended<z.ZodBigInt>;
  number: toZodExtended<z.ZodNumber>;
  boolean: toZodExtended<z.ZodBoolean>;
  date: toZodExtended<z.ZodDate>;
  object: toZodExtended<z.ZodObject<{ [k in keyof T]: toZod<T[k]> }>>;
}[zodKey<T>];

type zodKey<T> =
  IsAny<T> extends true ? "any"
  : undefined extends T ? "optional"
  : null extends T ? "nullable"
  : equals<T, string> extends true ? "string"
  : equals<T, bigint> extends true ? "bigint"
  : equals<T, number> extends true ? "number"
  : equals<T, boolean> extends true ? "boolean"
  : equals<T, Date> extends true ? "date"
  : T extends any[] ? "array"
  : T extends { [k: string]: any } ? "object"
  : "any";
