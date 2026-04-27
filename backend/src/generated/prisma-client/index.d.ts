
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model Series
 * 
 */
export type Series = $Result.DefaultSelection<Prisma.$SeriesPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model PostLike
 * 
 */
export type PostLike = $Result.DefaultSelection<Prisma.$PostLikePayload>
/**
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model Setting
 * 
 */
export type Setting = $Result.DefaultSelection<Prisma.$SettingPayload>
/**
 * Model MaintenanceCode
 * 
 */
export type MaintenanceCode = $Result.DefaultSelection<Prisma.$MaintenanceCodePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Categories
 * const categories = await prisma.category.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Categories
   * const categories = await prisma.category.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.series`: Exposes CRUD operations for the **Series** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Series
    * const series = await prisma.series.findMany()
    * ```
    */
  get series(): Prisma.SeriesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.postLike`: Exposes CRUD operations for the **PostLike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PostLikes
    * const postLikes = await prisma.postLike.findMany()
    * ```
    */
  get postLike(): Prisma.PostLikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.setting.findMany()
    * ```
    */
  get setting(): Prisma.SettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maintenanceCode`: Exposes CRUD operations for the **MaintenanceCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceCodes
    * const maintenanceCodes = await prisma.maintenanceCode.findMany()
    * ```
    */
  get maintenanceCode(): Prisma.MaintenanceCodeDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Category: 'Category',
    Series: 'Series',
    Comment: 'Comment',
    Post: 'Post',
    PostLike: 'PostLike',
    Tag: 'Tag',
    User: 'User',
    Notification: 'Notification',
    Setting: 'Setting',
    MaintenanceCode: 'MaintenanceCode'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "category" | "series" | "comment" | "post" | "postLike" | "tag" | "user" | "notification" | "setting" | "maintenanceCode"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      Series: {
        payload: Prisma.$SeriesPayload<ExtArgs>
        fields: Prisma.SeriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SeriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SeriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          findFirst: {
            args: Prisma.SeriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SeriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          findMany: {
            args: Prisma.SeriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>[]
          }
          create: {
            args: Prisma.SeriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          createMany: {
            args: Prisma.SeriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SeriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>[]
          }
          delete: {
            args: Prisma.SeriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          update: {
            args: Prisma.SeriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          deleteMany: {
            args: Prisma.SeriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SeriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SeriesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>[]
          }
          upsert: {
            args: Prisma.SeriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SeriesPayload>
          }
          aggregate: {
            args: Prisma.SeriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSeries>
          }
          groupBy: {
            args: Prisma.SeriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<SeriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.SeriesCountArgs<ExtArgs>
            result: $Utils.Optional<SeriesCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      PostLike: {
        payload: Prisma.$PostLikePayload<ExtArgs>
        fields: Prisma.PostLikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostLikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostLikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          findFirst: {
            args: Prisma.PostLikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostLikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          findMany: {
            args: Prisma.PostLikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>[]
          }
          create: {
            args: Prisma.PostLikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          createMany: {
            args: Prisma.PostLikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostLikeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>[]
          }
          delete: {
            args: Prisma.PostLikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          update: {
            args: Prisma.PostLikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          deleteMany: {
            args: Prisma.PostLikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostLikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostLikeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>[]
          }
          upsert: {
            args: Prisma.PostLikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostLikePayload>
          }
          aggregate: {
            args: Prisma.PostLikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePostLike>
          }
          groupBy: {
            args: Prisma.PostLikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostLikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostLikeCountArgs<ExtArgs>
            result: $Utils.Optional<PostLikeCountAggregateOutputType> | number
          }
        }
      }
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      Setting: {
        payload: Prisma.$SettingPayload<ExtArgs>
        fields: Prisma.SettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findFirst: {
            args: Prisma.SettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findMany: {
            args: Prisma.SettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          create: {
            args: Prisma.SettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          createMany: {
            args: Prisma.SettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          delete: {
            args: Prisma.SettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          update: {
            args: Prisma.SettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          deleteMany: {
            args: Prisma.SettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          upsert: {
            args: Prisma.SettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          aggregate: {
            args: Prisma.SettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSetting>
          }
          groupBy: {
            args: Prisma.SettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingCountArgs<ExtArgs>
            result: $Utils.Optional<SettingCountAggregateOutputType> | number
          }
        }
      }
      MaintenanceCode: {
        payload: Prisma.$MaintenanceCodePayload<ExtArgs>
        fields: Prisma.MaintenanceCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>
          }
          findFirst: {
            args: Prisma.MaintenanceCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>
          }
          findMany: {
            args: Prisma.MaintenanceCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>[]
          }
          create: {
            args: Prisma.MaintenanceCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>
          }
          createMany: {
            args: Prisma.MaintenanceCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>[]
          }
          delete: {
            args: Prisma.MaintenanceCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>
          }
          update: {
            args: Prisma.MaintenanceCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaintenanceCodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>[]
          }
          upsert: {
            args: Prisma.MaintenanceCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceCodePayload>
          }
          aggregate: {
            args: Prisma.MaintenanceCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceCode>
          }
          groupBy: {
            args: Prisma.MaintenanceCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceCodeCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceCodeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    category?: CategoryOmit
    series?: SeriesOmit
    comment?: CommentOmit
    post?: PostOmit
    postLike?: PostLikeOmit
    tag?: TagOmit
    user?: UserOmit
    notification?: NotificationOmit
    setting?: SettingOmit
    maintenanceCode?: MaintenanceCodeOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    Post: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | CategoryCountOutputTypeCountPostArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountPostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }


  /**
   * Count Type SeriesCountOutputType
   */

  export type SeriesCountOutputType = {
    Post: number
  }

  export type SeriesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | SeriesCountOutputTypeCountPostArgs
  }

  // Custom InputTypes
  /**
   * SeriesCountOutputType without action
   */
  export type SeriesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SeriesCountOutputType
     */
    select?: SeriesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SeriesCountOutputType without action
   */
  export type SeriesCountOutputTypeCountPostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }


  /**
   * Count Type CommentCountOutputType
   */

  export type CommentCountOutputType = {
    Replies: number
  }

  export type CommentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Replies?: boolean | CommentCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * CommentCountOutputType without action
   */
  export type CommentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CommentCountOutputType
     */
    select?: CommentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CommentCountOutputType without action
   */
  export type CommentCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Count Type PostCountOutputType
   */

  export type PostCountOutputType = {
    Comment: number
    PostLike: number
    Tag: number
  }

  export type PostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Comment?: boolean | PostCountOutputTypeCountCommentArgs
    PostLike?: boolean | PostCountOutputTypeCountPostLikeArgs
    Tag?: boolean | PostCountOutputTypeCountTagArgs
  }

  // Custom InputTypes
  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostCountOutputType
     */
    select?: PostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountCommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountPostLikeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostLikeWhereInput
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountTagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
  }


  /**
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    Post: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | TagCountOutputTypeCountPostArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountPostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    Comment: number
    Notification: number
    Posts: number
    BlockedPosts: number
    SentNotification: number
    PostLike: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Comment?: boolean | UserCountOutputTypeCountCommentArgs
    Notification?: boolean | UserCountOutputTypeCountNotificationArgs
    Posts?: boolean | UserCountOutputTypeCountPostsArgs
    BlockedPosts?: boolean | UserCountOutputTypeCountBlockedPostsArgs
    SentNotification?: boolean | UserCountOutputTypeCountSentNotificationArgs
    PostLike?: boolean | UserCountOutputTypeCountPostLikeArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBlockedPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostLikeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostLikeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryAvgAggregateOutputType = {
    id: number | null
  }

  export type CategorySumAggregateOutputType = {
    id: number | null
  }

  export type CategoryMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    created_at: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    created_at: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    created_at: number
    _all: number
  }


  export type CategoryAvgAggregateInputType = {
    id?: true
  }

  export type CategorySumAggregateInputType = {
    id?: true
  }

  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    created_at?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    created_at?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    created_at?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _avg?: CategoryAvgAggregateInputType
    _sum?: CategorySumAggregateInputType
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: number
    name: string
    slug: string
    created_at: Date
    _count: CategoryCountAggregateOutputType | null
    _avg: CategoryAvgAggregateOutputType | null
    _sum: CategorySumAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    created_at?: boolean
    Post?: boolean | Category$PostArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    created_at?: boolean
  }

  export type CategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "created_at", ExtArgs["result"]["category"]>
  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | Category$PostArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      Post: Prisma.$PostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      created_at: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {CategoryUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, CategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Post<T extends Category$PostArgs<ExtArgs> = {}>(args?: Subset<T, Category$PostArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'Int'>
    readonly name: FieldRef<"Category", 'String'>
    readonly slug: FieldRef<"Category", 'String'>
    readonly created_at: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category updateManyAndReturn
   */
  export type CategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Category.Post
   */
  export type Category$PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model Series
   */

  export type AggregateSeries = {
    _count: SeriesCountAggregateOutputType | null
    _avg: SeriesAvgAggregateOutputType | null
    _sum: SeriesSumAggregateOutputType | null
    _min: SeriesMinAggregateOutputType | null
    _max: SeriesMaxAggregateOutputType | null
  }

  export type SeriesAvgAggregateOutputType = {
    id: number | null
  }

  export type SeriesSumAggregateOutputType = {
    id: number | null
  }

  export type SeriesMinAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    created_at: Date | null
  }

  export type SeriesMaxAggregateOutputType = {
    id: number | null
    name: string | null
    slug: string | null
    description: string | null
    created_at: Date | null
  }

  export type SeriesCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    description: number
    created_at: number
    _all: number
  }


  export type SeriesAvgAggregateInputType = {
    id?: true
  }

  export type SeriesSumAggregateInputType = {
    id?: true
  }

  export type SeriesMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    created_at?: true
  }

  export type SeriesMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    created_at?: true
  }

  export type SeriesCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    description?: true
    created_at?: true
    _all?: true
  }

  export type SeriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Series to aggregate.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Series
    **/
    _count?: true | SeriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SeriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SeriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SeriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SeriesMaxAggregateInputType
  }

  export type GetSeriesAggregateType<T extends SeriesAggregateArgs> = {
        [P in keyof T & keyof AggregateSeries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSeries[P]>
      : GetScalarType<T[P], AggregateSeries[P]>
  }




  export type SeriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SeriesWhereInput
    orderBy?: SeriesOrderByWithAggregationInput | SeriesOrderByWithAggregationInput[]
    by: SeriesScalarFieldEnum[] | SeriesScalarFieldEnum
    having?: SeriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SeriesCountAggregateInputType | true
    _avg?: SeriesAvgAggregateInputType
    _sum?: SeriesSumAggregateInputType
    _min?: SeriesMinAggregateInputType
    _max?: SeriesMaxAggregateInputType
  }

  export type SeriesGroupByOutputType = {
    id: number
    name: string
    slug: string
    description: string | null
    created_at: Date
    _count: SeriesCountAggregateOutputType | null
    _avg: SeriesAvgAggregateOutputType | null
    _sum: SeriesSumAggregateOutputType | null
    _min: SeriesMinAggregateOutputType | null
    _max: SeriesMaxAggregateOutputType | null
  }

  type GetSeriesGroupByPayload<T extends SeriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SeriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SeriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SeriesGroupByOutputType[P]>
            : GetScalarType<T[P], SeriesGroupByOutputType[P]>
        }
      >
    >


  export type SeriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    created_at?: boolean
    Post?: boolean | Series$PostArgs<ExtArgs>
    _count?: boolean | SeriesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["series"]>

  export type SeriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["series"]>

  export type SeriesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["series"]>

  export type SeriesSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    description?: boolean
    created_at?: boolean
  }

  export type SeriesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "description" | "created_at", ExtArgs["result"]["series"]>
  export type SeriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | Series$PostArgs<ExtArgs>
    _count?: boolean | SeriesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SeriesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SeriesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SeriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Series"
    objects: {
      Post: Prisma.$PostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      slug: string
      description: string | null
      created_at: Date
    }, ExtArgs["result"]["series"]>
    composites: {}
  }

  type SeriesGetPayload<S extends boolean | null | undefined | SeriesDefaultArgs> = $Result.GetResult<Prisma.$SeriesPayload, S>

  type SeriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SeriesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SeriesCountAggregateInputType | true
    }

  export interface SeriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Series'], meta: { name: 'Series' } }
    /**
     * Find zero or one Series that matches the filter.
     * @param {SeriesFindUniqueArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SeriesFindUniqueArgs>(args: SelectSubset<T, SeriesFindUniqueArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Series that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SeriesFindUniqueOrThrowArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SeriesFindUniqueOrThrowArgs>(args: SelectSubset<T, SeriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Series that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesFindFirstArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SeriesFindFirstArgs>(args?: SelectSubset<T, SeriesFindFirstArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Series that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesFindFirstOrThrowArgs} args - Arguments to find a Series
     * @example
     * // Get one Series
     * const series = await prisma.series.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SeriesFindFirstOrThrowArgs>(args?: SelectSubset<T, SeriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Series that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Series
     * const series = await prisma.series.findMany()
     * 
     * // Get first 10 Series
     * const series = await prisma.series.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const seriesWithIdOnly = await prisma.series.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SeriesFindManyArgs>(args?: SelectSubset<T, SeriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Series.
     * @param {SeriesCreateArgs} args - Arguments to create a Series.
     * @example
     * // Create one Series
     * const Series = await prisma.series.create({
     *   data: {
     *     // ... data to create a Series
     *   }
     * })
     * 
     */
    create<T extends SeriesCreateArgs>(args: SelectSubset<T, SeriesCreateArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Series.
     * @param {SeriesCreateManyArgs} args - Arguments to create many Series.
     * @example
     * // Create many Series
     * const series = await prisma.series.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SeriesCreateManyArgs>(args?: SelectSubset<T, SeriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Series and returns the data saved in the database.
     * @param {SeriesCreateManyAndReturnArgs} args - Arguments to create many Series.
     * @example
     * // Create many Series
     * const series = await prisma.series.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Series and only return the `id`
     * const seriesWithIdOnly = await prisma.series.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SeriesCreateManyAndReturnArgs>(args?: SelectSubset<T, SeriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Series.
     * @param {SeriesDeleteArgs} args - Arguments to delete one Series.
     * @example
     * // Delete one Series
     * const Series = await prisma.series.delete({
     *   where: {
     *     // ... filter to delete one Series
     *   }
     * })
     * 
     */
    delete<T extends SeriesDeleteArgs>(args: SelectSubset<T, SeriesDeleteArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Series.
     * @param {SeriesUpdateArgs} args - Arguments to update one Series.
     * @example
     * // Update one Series
     * const series = await prisma.series.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SeriesUpdateArgs>(args: SelectSubset<T, SeriesUpdateArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Series.
     * @param {SeriesDeleteManyArgs} args - Arguments to filter Series to delete.
     * @example
     * // Delete a few Series
     * const { count } = await prisma.series.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SeriesDeleteManyArgs>(args?: SelectSubset<T, SeriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Series
     * const series = await prisma.series.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SeriesUpdateManyArgs>(args: SelectSubset<T, SeriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Series and returns the data updated in the database.
     * @param {SeriesUpdateManyAndReturnArgs} args - Arguments to update many Series.
     * @example
     * // Update many Series
     * const series = await prisma.series.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Series and only return the `id`
     * const seriesWithIdOnly = await prisma.series.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SeriesUpdateManyAndReturnArgs>(args: SelectSubset<T, SeriesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Series.
     * @param {SeriesUpsertArgs} args - Arguments to update or create a Series.
     * @example
     * // Update or create a Series
     * const series = await prisma.series.upsert({
     *   create: {
     *     // ... data to create a Series
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Series we want to update
     *   }
     * })
     */
    upsert<T extends SeriesUpsertArgs>(args: SelectSubset<T, SeriesUpsertArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesCountArgs} args - Arguments to filter Series to count.
     * @example
     * // Count the number of Series
     * const count = await prisma.series.count({
     *   where: {
     *     // ... the filter for the Series we want to count
     *   }
     * })
    **/
    count<T extends SeriesCountArgs>(
      args?: Subset<T, SeriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SeriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SeriesAggregateArgs>(args: Subset<T, SeriesAggregateArgs>): Prisma.PrismaPromise<GetSeriesAggregateType<T>>

    /**
     * Group by Series.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SeriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SeriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SeriesGroupByArgs['orderBy'] }
        : { orderBy?: SeriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SeriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSeriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Series model
   */
  readonly fields: SeriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Series.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SeriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Post<T extends Series$PostArgs<ExtArgs> = {}>(args?: Subset<T, Series$PostArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Series model
   */
  interface SeriesFieldRefs {
    readonly id: FieldRef<"Series", 'Int'>
    readonly name: FieldRef<"Series", 'String'>
    readonly slug: FieldRef<"Series", 'String'>
    readonly description: FieldRef<"Series", 'String'>
    readonly created_at: FieldRef<"Series", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Series findUnique
   */
  export type SeriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series findUniqueOrThrow
   */
  export type SeriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series findFirst
   */
  export type SeriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Series.
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Series.
     */
    distinct?: SeriesScalarFieldEnum | SeriesScalarFieldEnum[]
  }

  /**
   * Series findFirstOrThrow
   */
  export type SeriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Series.
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Series.
     */
    distinct?: SeriesScalarFieldEnum | SeriesScalarFieldEnum[]
  }

  /**
   * Series findMany
   */
  export type SeriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * Filter, which Series to fetch.
     */
    where?: SeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Series to fetch.
     */
    orderBy?: SeriesOrderByWithRelationInput | SeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Series.
     */
    cursor?: SeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Series from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Series.
     */
    skip?: number
    distinct?: SeriesScalarFieldEnum | SeriesScalarFieldEnum[]
  }

  /**
   * Series create
   */
  export type SeriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * The data needed to create a Series.
     */
    data: XOR<SeriesCreateInput, SeriesUncheckedCreateInput>
  }

  /**
   * Series createMany
   */
  export type SeriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Series.
     */
    data: SeriesCreateManyInput | SeriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Series createManyAndReturn
   */
  export type SeriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * The data used to create many Series.
     */
    data: SeriesCreateManyInput | SeriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Series update
   */
  export type SeriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * The data needed to update a Series.
     */
    data: XOR<SeriesUpdateInput, SeriesUncheckedUpdateInput>
    /**
     * Choose, which Series to update.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series updateMany
   */
  export type SeriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Series.
     */
    data: XOR<SeriesUpdateManyMutationInput, SeriesUncheckedUpdateManyInput>
    /**
     * Filter which Series to update
     */
    where?: SeriesWhereInput
    /**
     * Limit how many Series to update.
     */
    limit?: number
  }

  /**
   * Series updateManyAndReturn
   */
  export type SeriesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * The data used to update Series.
     */
    data: XOR<SeriesUpdateManyMutationInput, SeriesUncheckedUpdateManyInput>
    /**
     * Filter which Series to update
     */
    where?: SeriesWhereInput
    /**
     * Limit how many Series to update.
     */
    limit?: number
  }

  /**
   * Series upsert
   */
  export type SeriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * The filter to search for the Series to update in case it exists.
     */
    where: SeriesWhereUniqueInput
    /**
     * In case the Series found by the `where` argument doesn't exist, create a new Series with this data.
     */
    create: XOR<SeriesCreateInput, SeriesUncheckedCreateInput>
    /**
     * In case the Series was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SeriesUpdateInput, SeriesUncheckedUpdateInput>
  }

  /**
   * Series delete
   */
  export type SeriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    /**
     * Filter which Series to delete.
     */
    where: SeriesWhereUniqueInput
  }

  /**
   * Series deleteMany
   */
  export type SeriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Series to delete
     */
    where?: SeriesWhereInput
    /**
     * Limit how many Series to delete.
     */
    limit?: number
  }

  /**
   * Series.Post
   */
  export type Series$PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Series without action
   */
  export type SeriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentAvgAggregateOutputType = {
    id: number | null
    post_id: number | null
    user_id: number | null
    parent_id: number | null
  }

  export type CommentSumAggregateOutputType = {
    id: number | null
    post_id: number | null
    user_id: number | null
    parent_id: number | null
  }

  export type CommentMinAggregateOutputType = {
    id: number | null
    post_id: number | null
    author_name: string | null
    author_email: string | null
    content: string | null
    created_at: Date | null
    user_id: number | null
    parent_id: number | null
  }

  export type CommentMaxAggregateOutputType = {
    id: number | null
    post_id: number | null
    author_name: string | null
    author_email: string | null
    content: string | null
    created_at: Date | null
    user_id: number | null
    parent_id: number | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    post_id: number
    author_name: number
    author_email: number
    content: number
    created_at: number
    user_id: number
    parent_id: number
    _all: number
  }


  export type CommentAvgAggregateInputType = {
    id?: true
    post_id?: true
    user_id?: true
    parent_id?: true
  }

  export type CommentSumAggregateInputType = {
    id?: true
    post_id?: true
    user_id?: true
    parent_id?: true
  }

  export type CommentMinAggregateInputType = {
    id?: true
    post_id?: true
    author_name?: true
    author_email?: true
    content?: true
    created_at?: true
    user_id?: true
    parent_id?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    post_id?: true
    author_name?: true
    author_email?: true
    content?: true
    created_at?: true
    user_id?: true
    parent_id?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    post_id?: true
    author_name?: true
    author_email?: true
    content?: true
    created_at?: true
    user_id?: true
    parent_id?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CommentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CommentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _avg?: CommentAvgAggregateInputType
    _sum?: CommentSumAggregateInputType
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: number
    post_id: number | null
    author_name: string | null
    author_email: string | null
    content: string | null
    created_at: Date
    user_id: number | null
    parent_id: number | null
    _count: CommentCountAggregateOutputType | null
    _avg: CommentAvgAggregateOutputType | null
    _sum: CommentSumAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    post_id?: boolean
    author_name?: boolean
    author_email?: boolean
    content?: boolean
    created_at?: boolean
    user_id?: boolean
    parent_id?: boolean
    Parent?: boolean | Comment$ParentArgs<ExtArgs>
    Replies?: boolean | Comment$RepliesArgs<ExtArgs>
    Post?: boolean | Comment$PostArgs<ExtArgs>
    User?: boolean | Comment$UserArgs<ExtArgs>
    _count?: boolean | CommentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    post_id?: boolean
    author_name?: boolean
    author_email?: boolean
    content?: boolean
    created_at?: boolean
    user_id?: boolean
    parent_id?: boolean
    Parent?: boolean | Comment$ParentArgs<ExtArgs>
    Post?: boolean | Comment$PostArgs<ExtArgs>
    User?: boolean | Comment$UserArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    post_id?: boolean
    author_name?: boolean
    author_email?: boolean
    content?: boolean
    created_at?: boolean
    user_id?: boolean
    parent_id?: boolean
    Parent?: boolean | Comment$ParentArgs<ExtArgs>
    Post?: boolean | Comment$PostArgs<ExtArgs>
    User?: boolean | Comment$UserArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    post_id?: boolean
    author_name?: boolean
    author_email?: boolean
    content?: boolean
    created_at?: boolean
    user_id?: boolean
    parent_id?: boolean
  }

  export type CommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "post_id" | "author_name" | "author_email" | "content" | "created_at" | "user_id" | "parent_id", ExtArgs["result"]["comment"]>
  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Parent?: boolean | Comment$ParentArgs<ExtArgs>
    Replies?: boolean | Comment$RepliesArgs<ExtArgs>
    Post?: boolean | Comment$PostArgs<ExtArgs>
    User?: boolean | Comment$UserArgs<ExtArgs>
    _count?: boolean | CommentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Parent?: boolean | Comment$ParentArgs<ExtArgs>
    Post?: boolean | Comment$PostArgs<ExtArgs>
    User?: boolean | Comment$UserArgs<ExtArgs>
  }
  export type CommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Parent?: boolean | Comment$ParentArgs<ExtArgs>
    Post?: boolean | Comment$PostArgs<ExtArgs>
    User?: boolean | Comment$UserArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      Parent: Prisma.$CommentPayload<ExtArgs> | null
      Replies: Prisma.$CommentPayload<ExtArgs>[]
      Post: Prisma.$PostPayload<ExtArgs> | null
      User: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      post_id: number | null
      author_name: string | null
      author_email: string | null
      content: string | null
      created_at: Date
      user_id: number | null
      parent_id: number | null
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Parent<T extends Comment$ParentArgs<ExtArgs> = {}>(args?: Subset<T, Comment$ParentArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    Replies<T extends Comment$RepliesArgs<ExtArgs> = {}>(args?: Subset<T, Comment$RepliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Post<T extends Comment$PostArgs<ExtArgs> = {}>(args?: Subset<T, Comment$PostArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    User<T extends Comment$UserArgs<ExtArgs> = {}>(args?: Subset<T, Comment$UserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'Int'>
    readonly post_id: FieldRef<"Comment", 'Int'>
    readonly author_name: FieldRef<"Comment", 'String'>
    readonly author_email: FieldRef<"Comment", 'String'>
    readonly content: FieldRef<"Comment", 'String'>
    readonly created_at: FieldRef<"Comment", 'DateTime'>
    readonly user_id: FieldRef<"Comment", 'Int'>
    readonly parent_id: FieldRef<"Comment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data?: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
  }

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
    /**
     * Limit how many Comments to delete.
     */
    limit?: number
  }

  /**
   * Comment.Parent
   */
  export type Comment$ParentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
  }

  /**
   * Comment.Replies
   */
  export type Comment$RepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment.Post
   */
  export type Comment$PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
  }

  /**
   * Comment.User
   */
  export type Comment$UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    id: number | null
    series_id: number | null
    series_order: number | null
    views: number | null
    likes: number | null
    category_id: number | null
    author_id: number | null
    blocked_by_id: number | null
  }

  export type PostSumAggregateOutputType = {
    id: number | null
    series_id: number | null
    series_order: number | null
    views: number | null
    likes: number | null
    category_id: number | null
    author_id: number | null
    blocked_by_id: number | null
  }

  export type PostMinAggregateOutputType = {
    id: number | null
    title: string | null
    slug: string | null
    content: string | null
    series_id: number | null
    series_order: number | null
    cover_image: string | null
    is_pinned: boolean | null
    is_published: boolean | null
    views: number | null
    likes: number | null
    created_at: Date | null
    updated_at: Date | null
    category_id: number | null
    author_id: number | null
    is_blocked: boolean | null
    blocked_by_id: number | null
    blocked_reason: string | null
  }

  export type PostMaxAggregateOutputType = {
    id: number | null
    title: string | null
    slug: string | null
    content: string | null
    series_id: number | null
    series_order: number | null
    cover_image: string | null
    is_pinned: boolean | null
    is_published: boolean | null
    views: number | null
    likes: number | null
    created_at: Date | null
    updated_at: Date | null
    category_id: number | null
    author_id: number | null
    is_blocked: boolean | null
    blocked_by_id: number | null
    blocked_reason: string | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    content: number
    series_id: number
    series_order: number
    cover_image: number
    is_pinned: number
    is_published: number
    views: number
    likes: number
    created_at: number
    updated_at: number
    category_id: number
    author_id: number
    is_blocked: number
    blocked_by_id: number
    blocked_reason: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    id?: true
    series_id?: true
    series_order?: true
    views?: true
    likes?: true
    category_id?: true
    author_id?: true
    blocked_by_id?: true
  }

  export type PostSumAggregateInputType = {
    id?: true
    series_id?: true
    series_order?: true
    views?: true
    likes?: true
    category_id?: true
    author_id?: true
    blocked_by_id?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    content?: true
    series_id?: true
    series_order?: true
    cover_image?: true
    is_pinned?: true
    is_published?: true
    views?: true
    likes?: true
    created_at?: true
    updated_at?: true
    category_id?: true
    author_id?: true
    is_blocked?: true
    blocked_by_id?: true
    blocked_reason?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    content?: true
    series_id?: true
    series_order?: true
    cover_image?: true
    is_pinned?: true
    is_published?: true
    views?: true
    likes?: true
    created_at?: true
    updated_at?: true
    category_id?: true
    author_id?: true
    is_blocked?: true
    blocked_by_id?: true
    blocked_reason?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    content?: true
    series_id?: true
    series_order?: true
    cover_image?: true
    is_pinned?: true
    is_published?: true
    views?: true
    likes?: true
    created_at?: true
    updated_at?: true
    category_id?: true
    author_id?: true
    is_blocked?: true
    blocked_by_id?: true
    blocked_reason?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: number
    title: string
    slug: string
    content: string | null
    series_id: number | null
    series_order: number | null
    cover_image: string | null
    is_pinned: boolean
    is_published: boolean
    views: number
    likes: number
    created_at: Date
    updated_at: Date
    category_id: number | null
    author_id: number | null
    is_blocked: boolean
    blocked_by_id: number | null
    blocked_reason: string | null
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    series_id?: boolean
    series_order?: boolean
    cover_image?: boolean
    is_pinned?: boolean
    is_published?: boolean
    views?: boolean
    likes?: boolean
    created_at?: boolean
    updated_at?: boolean
    category_id?: boolean
    author_id?: boolean
    is_blocked?: boolean
    blocked_by_id?: boolean
    blocked_reason?: boolean
    Comment?: boolean | Post$CommentArgs<ExtArgs>
    Author?: boolean | Post$AuthorArgs<ExtArgs>
    BlockedBy?: boolean | Post$BlockedByArgs<ExtArgs>
    Category?: boolean | Post$CategoryArgs<ExtArgs>
    Series?: boolean | Post$SeriesArgs<ExtArgs>
    PostLike?: boolean | Post$PostLikeArgs<ExtArgs>
    Tag?: boolean | Post$TagArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    series_id?: boolean
    series_order?: boolean
    cover_image?: boolean
    is_pinned?: boolean
    is_published?: boolean
    views?: boolean
    likes?: boolean
    created_at?: boolean
    updated_at?: boolean
    category_id?: boolean
    author_id?: boolean
    is_blocked?: boolean
    blocked_by_id?: boolean
    blocked_reason?: boolean
    Author?: boolean | Post$AuthorArgs<ExtArgs>
    BlockedBy?: boolean | Post$BlockedByArgs<ExtArgs>
    Category?: boolean | Post$CategoryArgs<ExtArgs>
    Series?: boolean | Post$SeriesArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    series_id?: boolean
    series_order?: boolean
    cover_image?: boolean
    is_pinned?: boolean
    is_published?: boolean
    views?: boolean
    likes?: boolean
    created_at?: boolean
    updated_at?: boolean
    category_id?: boolean
    author_id?: boolean
    is_blocked?: boolean
    blocked_by_id?: boolean
    blocked_reason?: boolean
    Author?: boolean | Post$AuthorArgs<ExtArgs>
    BlockedBy?: boolean | Post$BlockedByArgs<ExtArgs>
    Category?: boolean | Post$CategoryArgs<ExtArgs>
    Series?: boolean | Post$SeriesArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    content?: boolean
    series_id?: boolean
    series_order?: boolean
    cover_image?: boolean
    is_pinned?: boolean
    is_published?: boolean
    views?: boolean
    likes?: boolean
    created_at?: boolean
    updated_at?: boolean
    category_id?: boolean
    author_id?: boolean
    is_blocked?: boolean
    blocked_by_id?: boolean
    blocked_reason?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "content" | "series_id" | "series_order" | "cover_image" | "is_pinned" | "is_published" | "views" | "likes" | "created_at" | "updated_at" | "category_id" | "author_id" | "is_blocked" | "blocked_by_id" | "blocked_reason", ExtArgs["result"]["post"]>
  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Comment?: boolean | Post$CommentArgs<ExtArgs>
    Author?: boolean | Post$AuthorArgs<ExtArgs>
    BlockedBy?: boolean | Post$BlockedByArgs<ExtArgs>
    Category?: boolean | Post$CategoryArgs<ExtArgs>
    Series?: boolean | Post$SeriesArgs<ExtArgs>
    PostLike?: boolean | Post$PostLikeArgs<ExtArgs>
    Tag?: boolean | Post$TagArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Author?: boolean | Post$AuthorArgs<ExtArgs>
    BlockedBy?: boolean | Post$BlockedByArgs<ExtArgs>
    Category?: boolean | Post$CategoryArgs<ExtArgs>
    Series?: boolean | Post$SeriesArgs<ExtArgs>
  }
  export type PostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Author?: boolean | Post$AuthorArgs<ExtArgs>
    BlockedBy?: boolean | Post$BlockedByArgs<ExtArgs>
    Category?: boolean | Post$CategoryArgs<ExtArgs>
    Series?: boolean | Post$SeriesArgs<ExtArgs>
  }

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      Comment: Prisma.$CommentPayload<ExtArgs>[]
      Author: Prisma.$UserPayload<ExtArgs> | null
      BlockedBy: Prisma.$UserPayload<ExtArgs> | null
      Category: Prisma.$CategoryPayload<ExtArgs> | null
      Series: Prisma.$SeriesPayload<ExtArgs> | null
      PostLike: Prisma.$PostLikePayload<ExtArgs>[]
      Tag: Prisma.$TagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      slug: string
      content: string | null
      series_id: number | null
      series_order: number | null
      cover_image: string | null
      is_pinned: boolean
      is_published: boolean
      views: number
      likes: number
      created_at: Date
      updated_at: Date
      category_id: number | null
      author_id: number | null
      is_blocked: boolean
      blocked_by_id: number | null
      blocked_reason: string | null
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Comment<T extends Post$CommentArgs<ExtArgs> = {}>(args?: Subset<T, Post$CommentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Author<T extends Post$AuthorArgs<ExtArgs> = {}>(args?: Subset<T, Post$AuthorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    BlockedBy<T extends Post$BlockedByArgs<ExtArgs> = {}>(args?: Subset<T, Post$BlockedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    Category<T extends Post$CategoryArgs<ExtArgs> = {}>(args?: Subset<T, Post$CategoryArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    Series<T extends Post$SeriesArgs<ExtArgs> = {}>(args?: Subset<T, Post$SeriesArgs<ExtArgs>>): Prisma__SeriesClient<$Result.GetResult<Prisma.$SeriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    PostLike<T extends Post$PostLikeArgs<ExtArgs> = {}>(args?: Subset<T, Post$PostLikeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Tag<T extends Post$TagArgs<ExtArgs> = {}>(args?: Subset<T, Post$TagArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'Int'>
    readonly title: FieldRef<"Post", 'String'>
    readonly slug: FieldRef<"Post", 'String'>
    readonly content: FieldRef<"Post", 'String'>
    readonly series_id: FieldRef<"Post", 'Int'>
    readonly series_order: FieldRef<"Post", 'Int'>
    readonly cover_image: FieldRef<"Post", 'String'>
    readonly is_pinned: FieldRef<"Post", 'Boolean'>
    readonly is_published: FieldRef<"Post", 'Boolean'>
    readonly views: FieldRef<"Post", 'Int'>
    readonly likes: FieldRef<"Post", 'Int'>
    readonly created_at: FieldRef<"Post", 'DateTime'>
    readonly updated_at: FieldRef<"Post", 'DateTime'>
    readonly category_id: FieldRef<"Post", 'Int'>
    readonly author_id: FieldRef<"Post", 'Int'>
    readonly is_blocked: FieldRef<"Post", 'Boolean'>
    readonly blocked_by_id: FieldRef<"Post", 'Int'>
    readonly blocked_reason: FieldRef<"Post", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post.Comment
   */
  export type Post$CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Post.Author
   */
  export type Post$AuthorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Post.BlockedBy
   */
  export type Post$BlockedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Post.Category
   */
  export type Post$CategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Category
     */
    omit?: CategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    where?: CategoryWhereInput
  }

  /**
   * Post.Series
   */
  export type Post$SeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Series
     */
    select?: SeriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Series
     */
    omit?: SeriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SeriesInclude<ExtArgs> | null
    where?: SeriesWhereInput
  }

  /**
   * Post.PostLike
   */
  export type Post$PostLikeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    where?: PostLikeWhereInput
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    cursor?: PostLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * Post.Tag
   */
  export type Post$TagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    where?: TagWhereInput
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    cursor?: TagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Model PostLike
   */

  export type AggregatePostLike = {
    _count: PostLikeCountAggregateOutputType | null
    _avg: PostLikeAvgAggregateOutputType | null
    _sum: PostLikeSumAggregateOutputType | null
    _min: PostLikeMinAggregateOutputType | null
    _max: PostLikeMaxAggregateOutputType | null
  }

  export type PostLikeAvgAggregateOutputType = {
    id: number | null
    post_id: number | null
    user_id: number | null
  }

  export type PostLikeSumAggregateOutputType = {
    id: number | null
    post_id: number | null
    user_id: number | null
  }

  export type PostLikeMinAggregateOutputType = {
    id: number | null
    post_id: number | null
    user_id: number | null
    created_at: Date | null
  }

  export type PostLikeMaxAggregateOutputType = {
    id: number | null
    post_id: number | null
    user_id: number | null
    created_at: Date | null
  }

  export type PostLikeCountAggregateOutputType = {
    id: number
    post_id: number
    user_id: number
    created_at: number
    _all: number
  }


  export type PostLikeAvgAggregateInputType = {
    id?: true
    post_id?: true
    user_id?: true
  }

  export type PostLikeSumAggregateInputType = {
    id?: true
    post_id?: true
    user_id?: true
  }

  export type PostLikeMinAggregateInputType = {
    id?: true
    post_id?: true
    user_id?: true
    created_at?: true
  }

  export type PostLikeMaxAggregateInputType = {
    id?: true
    post_id?: true
    user_id?: true
    created_at?: true
  }

  export type PostLikeCountAggregateInputType = {
    id?: true
    post_id?: true
    user_id?: true
    created_at?: true
    _all?: true
  }

  export type PostLikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostLike to aggregate.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PostLikes
    **/
    _count?: true | PostLikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostLikeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostLikeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostLikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostLikeMaxAggregateInputType
  }

  export type GetPostLikeAggregateType<T extends PostLikeAggregateArgs> = {
        [P in keyof T & keyof AggregatePostLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePostLike[P]>
      : GetScalarType<T[P], AggregatePostLike[P]>
  }




  export type PostLikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostLikeWhereInput
    orderBy?: PostLikeOrderByWithAggregationInput | PostLikeOrderByWithAggregationInput[]
    by: PostLikeScalarFieldEnum[] | PostLikeScalarFieldEnum
    having?: PostLikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostLikeCountAggregateInputType | true
    _avg?: PostLikeAvgAggregateInputType
    _sum?: PostLikeSumAggregateInputType
    _min?: PostLikeMinAggregateInputType
    _max?: PostLikeMaxAggregateInputType
  }

  export type PostLikeGroupByOutputType = {
    id: number
    post_id: number
    user_id: number
    created_at: Date
    _count: PostLikeCountAggregateOutputType | null
    _avg: PostLikeAvgAggregateOutputType | null
    _sum: PostLikeSumAggregateOutputType | null
    _min: PostLikeMinAggregateOutputType | null
    _max: PostLikeMaxAggregateOutputType | null
  }

  type GetPostLikeGroupByPayload<T extends PostLikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostLikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostLikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostLikeGroupByOutputType[P]>
            : GetScalarType<T[P], PostLikeGroupByOutputType[P]>
        }
      >
    >


  export type PostLikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    post_id?: boolean
    user_id?: boolean
    created_at?: boolean
    Post?: boolean | PostDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postLike"]>

  export type PostLikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    post_id?: boolean
    user_id?: boolean
    created_at?: boolean
    Post?: boolean | PostDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postLike"]>

  export type PostLikeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    post_id?: boolean
    user_id?: boolean
    created_at?: boolean
    Post?: boolean | PostDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["postLike"]>

  export type PostLikeSelectScalar = {
    id?: boolean
    post_id?: boolean
    user_id?: boolean
    created_at?: boolean
  }

  export type PostLikeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "post_id" | "user_id" | "created_at", ExtArgs["result"]["postLike"]>
  export type PostLikeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | PostDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostLikeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | PostDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PostLikeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | PostDefaultArgs<ExtArgs>
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PostLikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PostLike"
    objects: {
      Post: Prisma.$PostPayload<ExtArgs>
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      post_id: number
      user_id: number
      created_at: Date
    }, ExtArgs["result"]["postLike"]>
    composites: {}
  }

  type PostLikeGetPayload<S extends boolean | null | undefined | PostLikeDefaultArgs> = $Result.GetResult<Prisma.$PostLikePayload, S>

  type PostLikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostLikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostLikeCountAggregateInputType | true
    }

  export interface PostLikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PostLike'], meta: { name: 'PostLike' } }
    /**
     * Find zero or one PostLike that matches the filter.
     * @param {PostLikeFindUniqueArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostLikeFindUniqueArgs>(args: SelectSubset<T, PostLikeFindUniqueArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PostLike that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostLikeFindUniqueOrThrowArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostLikeFindUniqueOrThrowArgs>(args: SelectSubset<T, PostLikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostLike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeFindFirstArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostLikeFindFirstArgs>(args?: SelectSubset<T, PostLikeFindFirstArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PostLike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeFindFirstOrThrowArgs} args - Arguments to find a PostLike
     * @example
     * // Get one PostLike
     * const postLike = await prisma.postLike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostLikeFindFirstOrThrowArgs>(args?: SelectSubset<T, PostLikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PostLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PostLikes
     * const postLikes = await prisma.postLike.findMany()
     * 
     * // Get first 10 PostLikes
     * const postLikes = await prisma.postLike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postLikeWithIdOnly = await prisma.postLike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostLikeFindManyArgs>(args?: SelectSubset<T, PostLikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PostLike.
     * @param {PostLikeCreateArgs} args - Arguments to create a PostLike.
     * @example
     * // Create one PostLike
     * const PostLike = await prisma.postLike.create({
     *   data: {
     *     // ... data to create a PostLike
     *   }
     * })
     * 
     */
    create<T extends PostLikeCreateArgs>(args: SelectSubset<T, PostLikeCreateArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PostLikes.
     * @param {PostLikeCreateManyArgs} args - Arguments to create many PostLikes.
     * @example
     * // Create many PostLikes
     * const postLike = await prisma.postLike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostLikeCreateManyArgs>(args?: SelectSubset<T, PostLikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PostLikes and returns the data saved in the database.
     * @param {PostLikeCreateManyAndReturnArgs} args - Arguments to create many PostLikes.
     * @example
     * // Create many PostLikes
     * const postLike = await prisma.postLike.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PostLikes and only return the `id`
     * const postLikeWithIdOnly = await prisma.postLike.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostLikeCreateManyAndReturnArgs>(args?: SelectSubset<T, PostLikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PostLike.
     * @param {PostLikeDeleteArgs} args - Arguments to delete one PostLike.
     * @example
     * // Delete one PostLike
     * const PostLike = await prisma.postLike.delete({
     *   where: {
     *     // ... filter to delete one PostLike
     *   }
     * })
     * 
     */
    delete<T extends PostLikeDeleteArgs>(args: SelectSubset<T, PostLikeDeleteArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PostLike.
     * @param {PostLikeUpdateArgs} args - Arguments to update one PostLike.
     * @example
     * // Update one PostLike
     * const postLike = await prisma.postLike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostLikeUpdateArgs>(args: SelectSubset<T, PostLikeUpdateArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PostLikes.
     * @param {PostLikeDeleteManyArgs} args - Arguments to filter PostLikes to delete.
     * @example
     * // Delete a few PostLikes
     * const { count } = await prisma.postLike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostLikeDeleteManyArgs>(args?: SelectSubset<T, PostLikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PostLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PostLikes
     * const postLike = await prisma.postLike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostLikeUpdateManyArgs>(args: SelectSubset<T, PostLikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PostLikes and returns the data updated in the database.
     * @param {PostLikeUpdateManyAndReturnArgs} args - Arguments to update many PostLikes.
     * @example
     * // Update many PostLikes
     * const postLike = await prisma.postLike.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PostLikes and only return the `id`
     * const postLikeWithIdOnly = await prisma.postLike.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostLikeUpdateManyAndReturnArgs>(args: SelectSubset<T, PostLikeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PostLike.
     * @param {PostLikeUpsertArgs} args - Arguments to update or create a PostLike.
     * @example
     * // Update or create a PostLike
     * const postLike = await prisma.postLike.upsert({
     *   create: {
     *     // ... data to create a PostLike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PostLike we want to update
     *   }
     * })
     */
    upsert<T extends PostLikeUpsertArgs>(args: SelectSubset<T, PostLikeUpsertArgs<ExtArgs>>): Prisma__PostLikeClient<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PostLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeCountArgs} args - Arguments to filter PostLikes to count.
     * @example
     * // Count the number of PostLikes
     * const count = await prisma.postLike.count({
     *   where: {
     *     // ... the filter for the PostLikes we want to count
     *   }
     * })
    **/
    count<T extends PostLikeCountArgs>(
      args?: Subset<T, PostLikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostLikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PostLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostLikeAggregateArgs>(args: Subset<T, PostLikeAggregateArgs>): Prisma.PrismaPromise<GetPostLikeAggregateType<T>>

    /**
     * Group by PostLike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostLikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostLikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostLikeGroupByArgs['orderBy'] }
        : { orderBy?: PostLikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostLikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostLikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PostLike model
   */
  readonly fields: PostLikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PostLike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostLikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Post<T extends PostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostDefaultArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PostLike model
   */
  interface PostLikeFieldRefs {
    readonly id: FieldRef<"PostLike", 'Int'>
    readonly post_id: FieldRef<"PostLike", 'Int'>
    readonly user_id: FieldRef<"PostLike", 'Int'>
    readonly created_at: FieldRef<"PostLike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PostLike findUnique
   */
  export type PostLikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike findUniqueOrThrow
   */
  export type PostLikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike findFirst
   */
  export type PostLikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostLikes.
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostLikes.
     */
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * PostLike findFirstOrThrow
   */
  export type PostLikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLike to fetch.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PostLikes.
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PostLikes.
     */
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * PostLike findMany
   */
  export type PostLikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter, which PostLikes to fetch.
     */
    where?: PostLikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PostLikes to fetch.
     */
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PostLikes.
     */
    cursor?: PostLikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PostLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PostLikes.
     */
    skip?: number
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * PostLike create
   */
  export type PostLikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * The data needed to create a PostLike.
     */
    data: XOR<PostLikeCreateInput, PostLikeUncheckedCreateInput>
  }

  /**
   * PostLike createMany
   */
  export type PostLikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PostLikes.
     */
    data: PostLikeCreateManyInput | PostLikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PostLike createManyAndReturn
   */
  export type PostLikeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * The data used to create many PostLikes.
     */
    data: PostLikeCreateManyInput | PostLikeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PostLike update
   */
  export type PostLikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * The data needed to update a PostLike.
     */
    data: XOR<PostLikeUpdateInput, PostLikeUncheckedUpdateInput>
    /**
     * Choose, which PostLike to update.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike updateMany
   */
  export type PostLikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PostLikes.
     */
    data: XOR<PostLikeUpdateManyMutationInput, PostLikeUncheckedUpdateManyInput>
    /**
     * Filter which PostLikes to update
     */
    where?: PostLikeWhereInput
    /**
     * Limit how many PostLikes to update.
     */
    limit?: number
  }

  /**
   * PostLike updateManyAndReturn
   */
  export type PostLikeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * The data used to update PostLikes.
     */
    data: XOR<PostLikeUpdateManyMutationInput, PostLikeUncheckedUpdateManyInput>
    /**
     * Filter which PostLikes to update
     */
    where?: PostLikeWhereInput
    /**
     * Limit how many PostLikes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PostLike upsert
   */
  export type PostLikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * The filter to search for the PostLike to update in case it exists.
     */
    where: PostLikeWhereUniqueInput
    /**
     * In case the PostLike found by the `where` argument doesn't exist, create a new PostLike with this data.
     */
    create: XOR<PostLikeCreateInput, PostLikeUncheckedCreateInput>
    /**
     * In case the PostLike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostLikeUpdateInput, PostLikeUncheckedUpdateInput>
  }

  /**
   * PostLike delete
   */
  export type PostLikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    /**
     * Filter which PostLike to delete.
     */
    where: PostLikeWhereUniqueInput
  }

  /**
   * PostLike deleteMany
   */
  export type PostLikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PostLikes to delete
     */
    where?: PostLikeWhereInput
    /**
     * Limit how many PostLikes to delete.
     */
    limit?: number
  }

  /**
   * PostLike without action
   */
  export type PostLikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
  }


  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagAvgAggregateOutputType = {
    id: number | null
  }

  export type TagSumAggregateOutputType = {
    id: number | null
  }

  export type TagMinAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
  }

  export type TagMaxAggregateOutputType = {
    id: number | null
    name: string | null
    created_at: Date | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    name: number
    created_at: number
    _all: number
  }


  export type TagAvgAggregateInputType = {
    id?: true
  }

  export type TagSumAggregateInputType = {
    id?: true
  }

  export type TagMinAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    name?: true
    created_at?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TagAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TagSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _avg?: TagAvgAggregateInputType
    _sum?: TagSumAggregateInputType
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: number
    name: string
    created_at: Date
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
    Post?: boolean | Tag$PostArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    name?: boolean
    created_at?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "created_at", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Post?: boolean | Tag$PostArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      Post: Prisma.$PostPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      created_at: Date
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Post<T extends Tag$PostArgs<ExtArgs> = {}>(args?: Subset<T, Tag$PostArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'Int'>
    readonly name: FieldRef<"Tag", 'String'>
    readonly created_at: FieldRef<"Tag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag.Post
   */
  export type Tag$PostArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    username: string | null
    email: string | null
    fullname: string | null
    avatar: string | null
    profession: string | null
    password: string | null
    role: string | null
    phone: string | null
    birthday: string | null
    address: string | null
    google_id: string | null
    facebook_id: string | null
    apple_id: string | null
    reset_token: string | null
    reset_token_expiry: Date | null
    is_active: boolean | null
    created_at: Date | null
    can_comment: boolean | null
    can_post: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    username: string | null
    email: string | null
    fullname: string | null
    avatar: string | null
    profession: string | null
    password: string | null
    role: string | null
    phone: string | null
    birthday: string | null
    address: string | null
    google_id: string | null
    facebook_id: string | null
    apple_id: string | null
    reset_token: string | null
    reset_token_expiry: Date | null
    is_active: boolean | null
    created_at: Date | null
    can_comment: boolean | null
    can_post: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    email: number
    fullname: number
    avatar: number
    profession: number
    password: number
    role: number
    phone: number
    birthday: number
    address: number
    google_id: number
    facebook_id: number
    apple_id: number
    reset_token: number
    reset_token_expiry: number
    is_active: number
    created_at: number
    can_comment: number
    can_post: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    fullname?: true
    avatar?: true
    profession?: true
    password?: true
    role?: true
    phone?: true
    birthday?: true
    address?: true
    google_id?: true
    facebook_id?: true
    apple_id?: true
    reset_token?: true
    reset_token_expiry?: true
    is_active?: true
    created_at?: true
    can_comment?: true
    can_post?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    fullname?: true
    avatar?: true
    profession?: true
    password?: true
    role?: true
    phone?: true
    birthday?: true
    address?: true
    google_id?: true
    facebook_id?: true
    apple_id?: true
    reset_token?: true
    reset_token_expiry?: true
    is_active?: true
    created_at?: true
    can_comment?: true
    can_post?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    fullname?: true
    avatar?: true
    profession?: true
    password?: true
    role?: true
    phone?: true
    birthday?: true
    address?: true
    google_id?: true
    facebook_id?: true
    apple_id?: true
    reset_token?: true
    reset_token_expiry?: true
    is_active?: true
    created_at?: true
    can_comment?: true
    can_post?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    username: string
    email: string | null
    fullname: string | null
    avatar: string | null
    profession: string | null
    password: string
    role: string | null
    phone: string | null
    birthday: string | null
    address: string | null
    google_id: string | null
    facebook_id: string | null
    apple_id: string | null
    reset_token: string | null
    reset_token_expiry: Date | null
    is_active: boolean
    created_at: Date
    can_comment: boolean
    can_post: boolean
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    fullname?: boolean
    avatar?: boolean
    profession?: boolean
    password?: boolean
    role?: boolean
    phone?: boolean
    birthday?: boolean
    address?: boolean
    google_id?: boolean
    facebook_id?: boolean
    apple_id?: boolean
    reset_token?: boolean
    reset_token_expiry?: boolean
    is_active?: boolean
    created_at?: boolean
    can_comment?: boolean
    can_post?: boolean
    Comment?: boolean | User$CommentArgs<ExtArgs>
    Notification?: boolean | User$NotificationArgs<ExtArgs>
    Posts?: boolean | User$PostsArgs<ExtArgs>
    BlockedPosts?: boolean | User$BlockedPostsArgs<ExtArgs>
    SentNotification?: boolean | User$SentNotificationArgs<ExtArgs>
    PostLike?: boolean | User$PostLikeArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    fullname?: boolean
    avatar?: boolean
    profession?: boolean
    password?: boolean
    role?: boolean
    phone?: boolean
    birthday?: boolean
    address?: boolean
    google_id?: boolean
    facebook_id?: boolean
    apple_id?: boolean
    reset_token?: boolean
    reset_token_expiry?: boolean
    is_active?: boolean
    created_at?: boolean
    can_comment?: boolean
    can_post?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    fullname?: boolean
    avatar?: boolean
    profession?: boolean
    password?: boolean
    role?: boolean
    phone?: boolean
    birthday?: boolean
    address?: boolean
    google_id?: boolean
    facebook_id?: boolean
    apple_id?: boolean
    reset_token?: boolean
    reset_token_expiry?: boolean
    is_active?: boolean
    created_at?: boolean
    can_comment?: boolean
    can_post?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    fullname?: boolean
    avatar?: boolean
    profession?: boolean
    password?: boolean
    role?: boolean
    phone?: boolean
    birthday?: boolean
    address?: boolean
    google_id?: boolean
    facebook_id?: boolean
    apple_id?: boolean
    reset_token?: boolean
    reset_token_expiry?: boolean
    is_active?: boolean
    created_at?: boolean
    can_comment?: boolean
    can_post?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "email" | "fullname" | "avatar" | "profession" | "password" | "role" | "phone" | "birthday" | "address" | "google_id" | "facebook_id" | "apple_id" | "reset_token" | "reset_token_expiry" | "is_active" | "created_at" | "can_comment" | "can_post", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Comment?: boolean | User$CommentArgs<ExtArgs>
    Notification?: boolean | User$NotificationArgs<ExtArgs>
    Posts?: boolean | User$PostsArgs<ExtArgs>
    BlockedPosts?: boolean | User$BlockedPostsArgs<ExtArgs>
    SentNotification?: boolean | User$SentNotificationArgs<ExtArgs>
    PostLike?: boolean | User$PostLikeArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      Comment: Prisma.$CommentPayload<ExtArgs>[]
      Notification: Prisma.$NotificationPayload<ExtArgs>[]
      Posts: Prisma.$PostPayload<ExtArgs>[]
      BlockedPosts: Prisma.$PostPayload<ExtArgs>[]
      SentNotification: Prisma.$NotificationPayload<ExtArgs>[]
      PostLike: Prisma.$PostLikePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      email: string | null
      fullname: string | null
      avatar: string | null
      profession: string | null
      password: string
      role: string | null
      phone: string | null
      birthday: string | null
      address: string | null
      google_id: string | null
      facebook_id: string | null
      apple_id: string | null
      reset_token: string | null
      reset_token_expiry: Date | null
      is_active: boolean
      created_at: Date
      can_comment: boolean
      can_post: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Comment<T extends User$CommentArgs<ExtArgs> = {}>(args?: Subset<T, User$CommentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Notification<T extends User$NotificationArgs<ExtArgs> = {}>(args?: Subset<T, User$NotificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Posts<T extends User$PostsArgs<ExtArgs> = {}>(args?: Subset<T, User$PostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    BlockedPosts<T extends User$BlockedPostsArgs<ExtArgs> = {}>(args?: Subset<T, User$BlockedPostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    SentNotification<T extends User$SentNotificationArgs<ExtArgs> = {}>(args?: Subset<T, User$SentNotificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    PostLike<T extends User$PostLikeArgs<ExtArgs> = {}>(args?: Subset<T, User$PostLikeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostLikePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly fullname: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly profession: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly birthday: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly google_id: FieldRef<"User", 'String'>
    readonly facebook_id: FieldRef<"User", 'String'>
    readonly apple_id: FieldRef<"User", 'String'>
    readonly reset_token: FieldRef<"User", 'String'>
    readonly reset_token_expiry: FieldRef<"User", 'DateTime'>
    readonly is_active: FieldRef<"User", 'Boolean'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly can_comment: FieldRef<"User", 'Boolean'>
    readonly can_post: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.Comment
   */
  export type User$CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User.Notification
   */
  export type User$NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.Posts
   */
  export type User$PostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * User.BlockedPosts
   */
  export type User$BlockedPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * User.SentNotification
   */
  export type User$SentNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.PostLike
   */
  export type User$PostLikeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostLike
     */
    select?: PostLikeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PostLike
     */
    omit?: PostLikeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostLikeInclude<ExtArgs> | null
    where?: PostLikeWhereInput
    orderBy?: PostLikeOrderByWithRelationInput | PostLikeOrderByWithRelationInput[]
    cursor?: PostLikeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostLikeScalarFieldEnum | PostLikeScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    id: number | null
    recipient_id: number | null
    sender_id: number | null
  }

  export type NotificationSumAggregateOutputType = {
    id: number | null
    recipient_id: number | null
    sender_id: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: number | null
    recipient_id: number | null
    sender_id: number | null
    type: string | null
    title: string | null
    content: string | null
    link: string | null
    is_read: boolean | null
    created_at: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: number | null
    recipient_id: number | null
    sender_id: number | null
    type: string | null
    title: string | null
    content: string | null
    link: string | null
    is_read: boolean | null
    created_at: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    recipient_id: number
    sender_id: number
    type: number
    title: number
    content: number
    link: number
    is_read: number
    created_at: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    id?: true
    recipient_id?: true
    sender_id?: true
  }

  export type NotificationSumAggregateInputType = {
    id?: true
    recipient_id?: true
    sender_id?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    recipient_id?: true
    sender_id?: true
    type?: true
    title?: true
    content?: true
    link?: true
    is_read?: true
    created_at?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    recipient_id?: true
    sender_id?: true
    type?: true
    title?: true
    content?: true
    link?: true
    is_read?: true
    created_at?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    recipient_id?: true
    sender_id?: true
    type?: true
    title?: true
    content?: true
    link?: true
    is_read?: true
    created_at?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: number
    recipient_id: number
    sender_id: number | null
    type: string
    title: string
    content: string
    link: string | null
    is_read: boolean
    created_at: Date
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipient_id?: boolean
    sender_id?: boolean
    type?: boolean
    title?: boolean
    content?: boolean
    link?: boolean
    is_read?: boolean
    created_at?: boolean
    Recipient?: boolean | UserDefaultArgs<ExtArgs>
    Sender?: boolean | Notification$SenderArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipient_id?: boolean
    sender_id?: boolean
    type?: boolean
    title?: boolean
    content?: boolean
    link?: boolean
    is_read?: boolean
    created_at?: boolean
    Recipient?: boolean | UserDefaultArgs<ExtArgs>
    Sender?: boolean | Notification$SenderArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    recipient_id?: boolean
    sender_id?: boolean
    type?: boolean
    title?: boolean
    content?: boolean
    link?: boolean
    is_read?: boolean
    created_at?: boolean
    Recipient?: boolean | UserDefaultArgs<ExtArgs>
    Sender?: boolean | Notification$SenderArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    recipient_id?: boolean
    sender_id?: boolean
    type?: boolean
    title?: boolean
    content?: boolean
    link?: boolean
    is_read?: boolean
    created_at?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "recipient_id" | "sender_id" | "type" | "title" | "content" | "link" | "is_read" | "created_at", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Recipient?: boolean | UserDefaultArgs<ExtArgs>
    Sender?: boolean | Notification$SenderArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Recipient?: boolean | UserDefaultArgs<ExtArgs>
    Sender?: boolean | Notification$SenderArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Recipient?: boolean | UserDefaultArgs<ExtArgs>
    Sender?: boolean | Notification$SenderArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      Recipient: Prisma.$UserPayload<ExtArgs>
      Sender: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      recipient_id: number
      sender_id: number | null
      type: string
      title: string
      content: string
      link: string | null
      is_read: boolean
      created_at: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Recipient<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Sender<T extends Notification$SenderArgs<ExtArgs> = {}>(args?: Subset<T, Notification$SenderArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'Int'>
    readonly recipient_id: FieldRef<"Notification", 'Int'>
    readonly sender_id: FieldRef<"Notification", 'Int'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly content: FieldRef<"Notification", 'String'>
    readonly link: FieldRef<"Notification", 'String'>
    readonly is_read: FieldRef<"Notification", 'Boolean'>
    readonly created_at: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.Sender
   */
  export type Notification$SenderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model Setting
   */

  export type AggregateSetting = {
    _count: SettingCountAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  export type SettingMinAggregateOutputType = {
    key: string | null
    value: string | null
    group: string | null
    is_public: boolean | null
    updated_at: Date | null
  }

  export type SettingMaxAggregateOutputType = {
    key: string | null
    value: string | null
    group: string | null
    is_public: boolean | null
    updated_at: Date | null
  }

  export type SettingCountAggregateOutputType = {
    key: number
    value: number
    group: number
    is_public: number
    updated_at: number
    _all: number
  }


  export type SettingMinAggregateInputType = {
    key?: true
    value?: true
    group?: true
    is_public?: true
    updated_at?: true
  }

  export type SettingMaxAggregateInputType = {
    key?: true
    value?: true
    group?: true
    is_public?: true
    updated_at?: true
  }

  export type SettingCountAggregateInputType = {
    key?: true
    value?: true
    group?: true
    is_public?: true
    updated_at?: true
    _all?: true
  }

  export type SettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Setting to aggregate.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingMaxAggregateInputType
  }

  export type GetSettingAggregateType<T extends SettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSetting[P]>
      : GetScalarType<T[P], AggregateSetting[P]>
  }




  export type SettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingWhereInput
    orderBy?: SettingOrderByWithAggregationInput | SettingOrderByWithAggregationInput[]
    by: SettingScalarFieldEnum[] | SettingScalarFieldEnum
    having?: SettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingCountAggregateInputType | true
    _min?: SettingMinAggregateInputType
    _max?: SettingMaxAggregateInputType
  }

  export type SettingGroupByOutputType = {
    key: string
    value: string | null
    group: string
    is_public: boolean
    updated_at: Date
    _count: SettingCountAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  type GetSettingGroupByPayload<T extends SettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingGroupByOutputType[P]>
            : GetScalarType<T[P], SettingGroupByOutputType[P]>
        }
      >
    >


  export type SettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    group?: boolean
    is_public?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    group?: boolean
    is_public?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    value?: boolean
    group?: boolean
    is_public?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectScalar = {
    key?: boolean
    value?: boolean
    group?: boolean
    is_public?: boolean
    updated_at?: boolean
  }

  export type SettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "value" | "group" | "is_public" | "updated_at", ExtArgs["result"]["setting"]>

  export type $SettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Setting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      value: string | null
      group: string
      is_public: boolean
      updated_at: Date
    }, ExtArgs["result"]["setting"]>
    composites: {}
  }

  type SettingGetPayload<S extends boolean | null | undefined | SettingDefaultArgs> = $Result.GetResult<Prisma.$SettingPayload, S>

  type SettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SettingCountAggregateInputType | true
    }

  export interface SettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Setting'], meta: { name: 'Setting' } }
    /**
     * Find zero or one Setting that matches the filter.
     * @param {SettingFindUniqueArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingFindUniqueArgs>(args: SelectSubset<T, SettingFindUniqueArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Setting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingFindUniqueOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingFindFirstArgs>(args?: SelectSubset<T, SettingFindFirstArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.setting.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.setting.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const settingWithKeyOnly = await prisma.setting.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends SettingFindManyArgs>(args?: SelectSubset<T, SettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Setting.
     * @param {SettingCreateArgs} args - Arguments to create a Setting.
     * @example
     * // Create one Setting
     * const Setting = await prisma.setting.create({
     *   data: {
     *     // ... data to create a Setting
     *   }
     * })
     * 
     */
    create<T extends SettingCreateArgs>(args: SelectSubset<T, SettingCreateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Settings.
     * @param {SettingCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingCreateManyArgs>(args?: SelectSubset<T, SettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `key`
     * const settingWithKeyOnly = await prisma.setting.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Setting.
     * @param {SettingDeleteArgs} args - Arguments to delete one Setting.
     * @example
     * // Delete one Setting
     * const Setting = await prisma.setting.delete({
     *   where: {
     *     // ... filter to delete one Setting
     *   }
     * })
     * 
     */
    delete<T extends SettingDeleteArgs>(args: SelectSubset<T, SettingDeleteArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Setting.
     * @param {SettingUpdateArgs} args - Arguments to update one Setting.
     * @example
     * // Update one Setting
     * const setting = await prisma.setting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingUpdateArgs>(args: SelectSubset<T, SettingUpdateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Settings.
     * @param {SettingDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.setting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingDeleteManyArgs>(args?: SelectSubset<T, SettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingUpdateManyArgs>(args: SelectSubset<T, SettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings and returns the data updated in the database.
     * @param {SettingUpdateManyAndReturnArgs} args - Arguments to update many Settings.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Settings and only return the `key`
     * const settingWithKeyOnly = await prisma.setting.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SettingUpdateManyAndReturnArgs>(args: SelectSubset<T, SettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Setting.
     * @param {SettingUpsertArgs} args - Arguments to update or create a Setting.
     * @example
     * // Update or create a Setting
     * const setting = await prisma.setting.upsert({
     *   create: {
     *     // ... data to create a Setting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Setting we want to update
     *   }
     * })
     */
    upsert<T extends SettingUpsertArgs>(args: SelectSubset<T, SettingUpsertArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.setting.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingCountArgs>(
      args?: Subset<T, SettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettingAggregateArgs>(args: Subset<T, SettingAggregateArgs>): Prisma.PrismaPromise<GetSettingAggregateType<T>>

    /**
     * Group by Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingGroupByArgs['orderBy'] }
        : { orderBy?: SettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Setting model
   */
  readonly fields: SettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Setting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Setting model
   */
  interface SettingFieldRefs {
    readonly key: FieldRef<"Setting", 'String'>
    readonly value: FieldRef<"Setting", 'String'>
    readonly group: FieldRef<"Setting", 'String'>
    readonly is_public: FieldRef<"Setting", 'Boolean'>
    readonly updated_at: FieldRef<"Setting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Setting findUnique
   */
  export type SettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findUniqueOrThrow
   */
  export type SettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findFirst
   */
  export type SettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findFirstOrThrow
   */
  export type SettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findMany
   */
  export type SettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting create
   */
  export type SettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to create a Setting.
     */
    data: XOR<SettingCreateInput, SettingUncheckedCreateInput>
  }

  /**
   * Setting createMany
   */
  export type SettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting createManyAndReturn
   */
  export type SettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting update
   */
  export type SettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to update a Setting.
     */
    data: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
    /**
     * Choose, which Setting to update.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting updateMany
   */
  export type SettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting updateManyAndReturn
   */
  export type SettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting upsert
   */
  export type SettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The filter to search for the Setting to update in case it exists.
     */
    where: SettingWhereUniqueInput
    /**
     * In case the Setting found by the `where` argument doesn't exist, create a new Setting with this data.
     */
    create: XOR<SettingCreateInput, SettingUncheckedCreateInput>
    /**
     * In case the Setting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
  }

  /**
   * Setting delete
   */
  export type SettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter which Setting to delete.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting deleteMany
   */
  export type SettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to delete.
     */
    limit?: number
  }

  /**
   * Setting without action
   */
  export type SettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
  }


  /**
   * Model MaintenanceCode
   */

  export type AggregateMaintenanceCode = {
    _count: MaintenanceCodeCountAggregateOutputType | null
    _avg: MaintenanceCodeAvgAggregateOutputType | null
    _sum: MaintenanceCodeSumAggregateOutputType | null
    _min: MaintenanceCodeMinAggregateOutputType | null
    _max: MaintenanceCodeMaxAggregateOutputType | null
  }

  export type MaintenanceCodeAvgAggregateOutputType = {
    id: number | null
  }

  export type MaintenanceCodeSumAggregateOutputType = {
    id: number | null
  }

  export type MaintenanceCodeMinAggregateOutputType = {
    id: number | null
    code: string | null
    is_used: boolean | null
    expires_at: Date | null
    created_at: Date | null
  }

  export type MaintenanceCodeMaxAggregateOutputType = {
    id: number | null
    code: string | null
    is_used: boolean | null
    expires_at: Date | null
    created_at: Date | null
  }

  export type MaintenanceCodeCountAggregateOutputType = {
    id: number
    code: number
    is_used: number
    expires_at: number
    created_at: number
    _all: number
  }


  export type MaintenanceCodeAvgAggregateInputType = {
    id?: true
  }

  export type MaintenanceCodeSumAggregateInputType = {
    id?: true
  }

  export type MaintenanceCodeMinAggregateInputType = {
    id?: true
    code?: true
    is_used?: true
    expires_at?: true
    created_at?: true
  }

  export type MaintenanceCodeMaxAggregateInputType = {
    id?: true
    code?: true
    is_used?: true
    expires_at?: true
    created_at?: true
  }

  export type MaintenanceCodeCountAggregateInputType = {
    id?: true
    code?: true
    is_used?: true
    expires_at?: true
    created_at?: true
    _all?: true
  }

  export type MaintenanceCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceCode to aggregate.
     */
    where?: MaintenanceCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceCodes to fetch.
     */
    orderBy?: MaintenanceCodeOrderByWithRelationInput | MaintenanceCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceCodes
    **/
    _count?: true | MaintenanceCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaintenanceCodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaintenanceCodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceCodeMaxAggregateInputType
  }

  export type GetMaintenanceCodeAggregateType<T extends MaintenanceCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceCode[P]>
      : GetScalarType<T[P], AggregateMaintenanceCode[P]>
  }




  export type MaintenanceCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceCodeWhereInput
    orderBy?: MaintenanceCodeOrderByWithAggregationInput | MaintenanceCodeOrderByWithAggregationInput[]
    by: MaintenanceCodeScalarFieldEnum[] | MaintenanceCodeScalarFieldEnum
    having?: MaintenanceCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceCodeCountAggregateInputType | true
    _avg?: MaintenanceCodeAvgAggregateInputType
    _sum?: MaintenanceCodeSumAggregateInputType
    _min?: MaintenanceCodeMinAggregateInputType
    _max?: MaintenanceCodeMaxAggregateInputType
  }

  export type MaintenanceCodeGroupByOutputType = {
    id: number
    code: string
    is_used: boolean
    expires_at: Date
    created_at: Date
    _count: MaintenanceCodeCountAggregateOutputType | null
    _avg: MaintenanceCodeAvgAggregateOutputType | null
    _sum: MaintenanceCodeSumAggregateOutputType | null
    _min: MaintenanceCodeMinAggregateOutputType | null
    _max: MaintenanceCodeMaxAggregateOutputType | null
  }

  type GetMaintenanceCodeGroupByPayload<T extends MaintenanceCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceCodeGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceCodeGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    is_used?: boolean
    expires_at?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["maintenanceCode"]>

  export type MaintenanceCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    is_used?: boolean
    expires_at?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["maintenanceCode"]>

  export type MaintenanceCodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    is_used?: boolean
    expires_at?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["maintenanceCode"]>

  export type MaintenanceCodeSelectScalar = {
    id?: boolean
    code?: boolean
    is_used?: boolean
    expires_at?: boolean
    created_at?: boolean
  }

  export type MaintenanceCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "is_used" | "expires_at" | "created_at", ExtArgs["result"]["maintenanceCode"]>

  export type $MaintenanceCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceCode"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      is_used: boolean
      expires_at: Date
      created_at: Date
    }, ExtArgs["result"]["maintenanceCode"]>
    composites: {}
  }

  type MaintenanceCodeGetPayload<S extends boolean | null | undefined | MaintenanceCodeDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceCodePayload, S>

  type MaintenanceCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaintenanceCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaintenanceCodeCountAggregateInputType | true
    }

  export interface MaintenanceCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceCode'], meta: { name: 'MaintenanceCode' } }
    /**
     * Find zero or one MaintenanceCode that matches the filter.
     * @param {MaintenanceCodeFindUniqueArgs} args - Arguments to find a MaintenanceCode
     * @example
     * // Get one MaintenanceCode
     * const maintenanceCode = await prisma.maintenanceCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceCodeFindUniqueArgs>(args: SelectSubset<T, MaintenanceCodeFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaintenanceCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceCodeFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceCode
     * @example
     * // Get one MaintenanceCode
     * const maintenanceCode = await prisma.maintenanceCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCodeFindFirstArgs} args - Arguments to find a MaintenanceCode
     * @example
     * // Get one MaintenanceCode
     * const maintenanceCode = await prisma.maintenanceCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceCodeFindFirstArgs>(args?: SelectSubset<T, MaintenanceCodeFindFirstArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCodeFindFirstOrThrowArgs} args - Arguments to find a MaintenanceCode
     * @example
     * // Get one MaintenanceCode
     * const maintenanceCode = await prisma.maintenanceCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaintenanceCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceCodes
     * const maintenanceCodes = await prisma.maintenanceCode.findMany()
     * 
     * // Get first 10 MaintenanceCodes
     * const maintenanceCodes = await prisma.maintenanceCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceCodeWithIdOnly = await prisma.maintenanceCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceCodeFindManyArgs>(args?: SelectSubset<T, MaintenanceCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaintenanceCode.
     * @param {MaintenanceCodeCreateArgs} args - Arguments to create a MaintenanceCode.
     * @example
     * // Create one MaintenanceCode
     * const MaintenanceCode = await prisma.maintenanceCode.create({
     *   data: {
     *     // ... data to create a MaintenanceCode
     *   }
     * })
     * 
     */
    create<T extends MaintenanceCodeCreateArgs>(args: SelectSubset<T, MaintenanceCodeCreateArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaintenanceCodes.
     * @param {MaintenanceCodeCreateManyArgs} args - Arguments to create many MaintenanceCodes.
     * @example
     * // Create many MaintenanceCodes
     * const maintenanceCode = await prisma.maintenanceCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceCodeCreateManyArgs>(args?: SelectSubset<T, MaintenanceCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaintenanceCodes and returns the data saved in the database.
     * @param {MaintenanceCodeCreateManyAndReturnArgs} args - Arguments to create many MaintenanceCodes.
     * @example
     * // Create many MaintenanceCodes
     * const maintenanceCode = await prisma.maintenanceCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaintenanceCodes and only return the `id`
     * const maintenanceCodeWithIdOnly = await prisma.maintenanceCode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MaintenanceCode.
     * @param {MaintenanceCodeDeleteArgs} args - Arguments to delete one MaintenanceCode.
     * @example
     * // Delete one MaintenanceCode
     * const MaintenanceCode = await prisma.maintenanceCode.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceCode
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceCodeDeleteArgs>(args: SelectSubset<T, MaintenanceCodeDeleteArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaintenanceCode.
     * @param {MaintenanceCodeUpdateArgs} args - Arguments to update one MaintenanceCode.
     * @example
     * // Update one MaintenanceCode
     * const maintenanceCode = await prisma.maintenanceCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceCodeUpdateArgs>(args: SelectSubset<T, MaintenanceCodeUpdateArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaintenanceCodes.
     * @param {MaintenanceCodeDeleteManyArgs} args - Arguments to filter MaintenanceCodes to delete.
     * @example
     * // Delete a few MaintenanceCodes
     * const { count } = await prisma.maintenanceCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceCodeDeleteManyArgs>(args?: SelectSubset<T, MaintenanceCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceCodes
     * const maintenanceCode = await prisma.maintenanceCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceCodeUpdateManyArgs>(args: SelectSubset<T, MaintenanceCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceCodes and returns the data updated in the database.
     * @param {MaintenanceCodeUpdateManyAndReturnArgs} args - Arguments to update many MaintenanceCodes.
     * @example
     * // Update many MaintenanceCodes
     * const maintenanceCode = await prisma.maintenanceCode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MaintenanceCodes and only return the `id`
     * const maintenanceCodeWithIdOnly = await prisma.maintenanceCode.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaintenanceCodeUpdateManyAndReturnArgs>(args: SelectSubset<T, MaintenanceCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MaintenanceCode.
     * @param {MaintenanceCodeUpsertArgs} args - Arguments to update or create a MaintenanceCode.
     * @example
     * // Update or create a MaintenanceCode
     * const maintenanceCode = await prisma.maintenanceCode.upsert({
     *   create: {
     *     // ... data to create a MaintenanceCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceCode we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceCodeUpsertArgs>(args: SelectSubset<T, MaintenanceCodeUpsertArgs<ExtArgs>>): Prisma__MaintenanceCodeClient<$Result.GetResult<Prisma.$MaintenanceCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaintenanceCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCodeCountArgs} args - Arguments to filter MaintenanceCodes to count.
     * @example
     * // Count the number of MaintenanceCodes
     * const count = await prisma.maintenanceCode.count({
     *   where: {
     *     // ... the filter for the MaintenanceCodes we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceCodeCountArgs>(
      args?: Subset<T, MaintenanceCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaintenanceCodeAggregateArgs>(args: Subset<T, MaintenanceCodeAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceCodeAggregateType<T>>

    /**
     * Group by MaintenanceCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaintenanceCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceCodeGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaintenanceCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceCode model
   */
  readonly fields: MaintenanceCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MaintenanceCode model
   */
  interface MaintenanceCodeFieldRefs {
    readonly id: FieldRef<"MaintenanceCode", 'Int'>
    readonly code: FieldRef<"MaintenanceCode", 'String'>
    readonly is_used: FieldRef<"MaintenanceCode", 'Boolean'>
    readonly expires_at: FieldRef<"MaintenanceCode", 'DateTime'>
    readonly created_at: FieldRef<"MaintenanceCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceCode findUnique
   */
  export type MaintenanceCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceCode to fetch.
     */
    where: MaintenanceCodeWhereUniqueInput
  }

  /**
   * MaintenanceCode findUniqueOrThrow
   */
  export type MaintenanceCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceCode to fetch.
     */
    where: MaintenanceCodeWhereUniqueInput
  }

  /**
   * MaintenanceCode findFirst
   */
  export type MaintenanceCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceCode to fetch.
     */
    where?: MaintenanceCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceCodes to fetch.
     */
    orderBy?: MaintenanceCodeOrderByWithRelationInput | MaintenanceCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceCodes.
     */
    cursor?: MaintenanceCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceCodes.
     */
    distinct?: MaintenanceCodeScalarFieldEnum | MaintenanceCodeScalarFieldEnum[]
  }

  /**
   * MaintenanceCode findFirstOrThrow
   */
  export type MaintenanceCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceCode to fetch.
     */
    where?: MaintenanceCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceCodes to fetch.
     */
    orderBy?: MaintenanceCodeOrderByWithRelationInput | MaintenanceCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceCodes.
     */
    cursor?: MaintenanceCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceCodes.
     */
    distinct?: MaintenanceCodeScalarFieldEnum | MaintenanceCodeScalarFieldEnum[]
  }

  /**
   * MaintenanceCode findMany
   */
  export type MaintenanceCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * Filter, which MaintenanceCodes to fetch.
     */
    where?: MaintenanceCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceCodes to fetch.
     */
    orderBy?: MaintenanceCodeOrderByWithRelationInput | MaintenanceCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceCodes.
     */
    cursor?: MaintenanceCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceCodes.
     */
    skip?: number
    distinct?: MaintenanceCodeScalarFieldEnum | MaintenanceCodeScalarFieldEnum[]
  }

  /**
   * MaintenanceCode create
   */
  export type MaintenanceCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceCode.
     */
    data: XOR<MaintenanceCodeCreateInput, MaintenanceCodeUncheckedCreateInput>
  }

  /**
   * MaintenanceCode createMany
   */
  export type MaintenanceCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceCodes.
     */
    data: MaintenanceCodeCreateManyInput | MaintenanceCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceCode createManyAndReturn
   */
  export type MaintenanceCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * The data used to create many MaintenanceCodes.
     */
    data: MaintenanceCodeCreateManyInput | MaintenanceCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceCode update
   */
  export type MaintenanceCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceCode.
     */
    data: XOR<MaintenanceCodeUpdateInput, MaintenanceCodeUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceCode to update.
     */
    where: MaintenanceCodeWhereUniqueInput
  }

  /**
   * MaintenanceCode updateMany
   */
  export type MaintenanceCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceCodes.
     */
    data: XOR<MaintenanceCodeUpdateManyMutationInput, MaintenanceCodeUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceCodes to update
     */
    where?: MaintenanceCodeWhereInput
    /**
     * Limit how many MaintenanceCodes to update.
     */
    limit?: number
  }

  /**
   * MaintenanceCode updateManyAndReturn
   */
  export type MaintenanceCodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * The data used to update MaintenanceCodes.
     */
    data: XOR<MaintenanceCodeUpdateManyMutationInput, MaintenanceCodeUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceCodes to update
     */
    where?: MaintenanceCodeWhereInput
    /**
     * Limit how many MaintenanceCodes to update.
     */
    limit?: number
  }

  /**
   * MaintenanceCode upsert
   */
  export type MaintenanceCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceCode to update in case it exists.
     */
    where: MaintenanceCodeWhereUniqueInput
    /**
     * In case the MaintenanceCode found by the `where` argument doesn't exist, create a new MaintenanceCode with this data.
     */
    create: XOR<MaintenanceCodeCreateInput, MaintenanceCodeUncheckedCreateInput>
    /**
     * In case the MaintenanceCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceCodeUpdateInput, MaintenanceCodeUncheckedUpdateInput>
  }

  /**
   * MaintenanceCode delete
   */
  export type MaintenanceCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
    /**
     * Filter which MaintenanceCode to delete.
     */
    where: MaintenanceCodeWhereUniqueInput
  }

  /**
   * MaintenanceCode deleteMany
   */
  export type MaintenanceCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceCodes to delete
     */
    where?: MaintenanceCodeWhereInput
    /**
     * Limit how many MaintenanceCodes to delete.
     */
    limit?: number
  }

  /**
   * MaintenanceCode without action
   */
  export type MaintenanceCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCode
     */
    select?: MaintenanceCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceCode
     */
    omit?: MaintenanceCodeOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    created_at: 'created_at'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const SeriesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    description: 'description',
    created_at: 'created_at'
  };

  export type SeriesScalarFieldEnum = (typeof SeriesScalarFieldEnum)[keyof typeof SeriesScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    post_id: 'post_id',
    author_name: 'author_name',
    author_email: 'author_email',
    content: 'content',
    created_at: 'created_at',
    user_id: 'user_id',
    parent_id: 'parent_id'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    content: 'content',
    series_id: 'series_id',
    series_order: 'series_order',
    cover_image: 'cover_image',
    is_pinned: 'is_pinned',
    is_published: 'is_published',
    views: 'views',
    likes: 'likes',
    created_at: 'created_at',
    updated_at: 'updated_at',
    category_id: 'category_id',
    author_id: 'author_id',
    is_blocked: 'is_blocked',
    blocked_by_id: 'blocked_by_id',
    blocked_reason: 'blocked_reason'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const PostLikeScalarFieldEnum: {
    id: 'id',
    post_id: 'post_id',
    user_id: 'user_id',
    created_at: 'created_at'
  };

  export type PostLikeScalarFieldEnum = (typeof PostLikeScalarFieldEnum)[keyof typeof PostLikeScalarFieldEnum]


  export const TagScalarFieldEnum: {
    id: 'id',
    name: 'name',
    created_at: 'created_at'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    fullname: 'fullname',
    avatar: 'avatar',
    profession: 'profession',
    password: 'password',
    role: 'role',
    phone: 'phone',
    birthday: 'birthday',
    address: 'address',
    google_id: 'google_id',
    facebook_id: 'facebook_id',
    apple_id: 'apple_id',
    reset_token: 'reset_token',
    reset_token_expiry: 'reset_token_expiry',
    is_active: 'is_active',
    created_at: 'created_at',
    can_comment: 'can_comment',
    can_post: 'can_post'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    recipient_id: 'recipient_id',
    sender_id: 'sender_id',
    type: 'type',
    title: 'title',
    content: 'content',
    link: 'link',
    is_read: 'is_read',
    created_at: 'created_at'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SettingScalarFieldEnum: {
    key: 'key',
    value: 'value',
    group: 'group',
    is_public: 'is_public',
    updated_at: 'updated_at'
  };

  export type SettingScalarFieldEnum = (typeof SettingScalarFieldEnum)[keyof typeof SettingScalarFieldEnum]


  export const MaintenanceCodeScalarFieldEnum: {
    id: 'id',
    code: 'code',
    is_used: 'is_used',
    expires_at: 'expires_at',
    created_at: 'created_at'
  };

  export type MaintenanceCodeScalarFieldEnum = (typeof MaintenanceCodeScalarFieldEnum)[keyof typeof MaintenanceCodeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: IntFilter<"Category"> | number
    name?: StringFilter<"Category"> | string
    slug?: StringFilter<"Category"> | string
    created_at?: DateTimeFilter<"Category"> | Date | string
    Post?: PostListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    created_at?: SortOrder
    Post?: PostOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    created_at?: DateTimeFilter<"Category"> | Date | string
    Post?: PostListRelationFilter
  }, "id" | "name" | "slug">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    created_at?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _avg?: CategoryAvgOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
    _sum?: CategorySumOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Category"> | number
    name?: StringWithAggregatesFilter<"Category"> | string
    slug?: StringWithAggregatesFilter<"Category"> | string
    created_at?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type SeriesWhereInput = {
    AND?: SeriesWhereInput | SeriesWhereInput[]
    OR?: SeriesWhereInput[]
    NOT?: SeriesWhereInput | SeriesWhereInput[]
    id?: IntFilter<"Series"> | number
    name?: StringFilter<"Series"> | string
    slug?: StringFilter<"Series"> | string
    description?: StringNullableFilter<"Series"> | string | null
    created_at?: DateTimeFilter<"Series"> | Date | string
    Post?: PostListRelationFilter
  }

  export type SeriesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    Post?: PostOrderByRelationAggregateInput
  }

  export type SeriesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    slug?: string
    AND?: SeriesWhereInput | SeriesWhereInput[]
    OR?: SeriesWhereInput[]
    NOT?: SeriesWhereInput | SeriesWhereInput[]
    description?: StringNullableFilter<"Series"> | string | null
    created_at?: DateTimeFilter<"Series"> | Date | string
    Post?: PostListRelationFilter
  }, "id" | "name" | "slug">

  export type SeriesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: SeriesCountOrderByAggregateInput
    _avg?: SeriesAvgOrderByAggregateInput
    _max?: SeriesMaxOrderByAggregateInput
    _min?: SeriesMinOrderByAggregateInput
    _sum?: SeriesSumOrderByAggregateInput
  }

  export type SeriesScalarWhereWithAggregatesInput = {
    AND?: SeriesScalarWhereWithAggregatesInput | SeriesScalarWhereWithAggregatesInput[]
    OR?: SeriesScalarWhereWithAggregatesInput[]
    NOT?: SeriesScalarWhereWithAggregatesInput | SeriesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Series"> | number
    name?: StringWithAggregatesFilter<"Series"> | string
    slug?: StringWithAggregatesFilter<"Series"> | string
    description?: StringNullableWithAggregatesFilter<"Series"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Series"> | Date | string
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: IntFilter<"Comment"> | number
    post_id?: IntNullableFilter<"Comment"> | number | null
    author_name?: StringNullableFilter<"Comment"> | string | null
    author_email?: StringNullableFilter<"Comment"> | string | null
    content?: StringNullableFilter<"Comment"> | string | null
    created_at?: DateTimeFilter<"Comment"> | Date | string
    user_id?: IntNullableFilter<"Comment"> | number | null
    parent_id?: IntNullableFilter<"Comment"> | number | null
    Parent?: XOR<CommentNullableScalarRelationFilter, CommentWhereInput> | null
    Replies?: CommentListRelationFilter
    Post?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null
    User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    post_id?: SortOrderInput | SortOrder
    author_name?: SortOrderInput | SortOrder
    author_email?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user_id?: SortOrderInput | SortOrder
    parent_id?: SortOrderInput | SortOrder
    Parent?: CommentOrderByWithRelationInput
    Replies?: CommentOrderByRelationAggregateInput
    Post?: PostOrderByWithRelationInput
    User?: UserOrderByWithRelationInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    post_id?: IntNullableFilter<"Comment"> | number | null
    author_name?: StringNullableFilter<"Comment"> | string | null
    author_email?: StringNullableFilter<"Comment"> | string | null
    content?: StringNullableFilter<"Comment"> | string | null
    created_at?: DateTimeFilter<"Comment"> | Date | string
    user_id?: IntNullableFilter<"Comment"> | number | null
    parent_id?: IntNullableFilter<"Comment"> | number | null
    Parent?: XOR<CommentNullableScalarRelationFilter, CommentWhereInput> | null
    Replies?: CommentListRelationFilter
    Post?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null
    User?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    post_id?: SortOrderInput | SortOrder
    author_name?: SortOrderInput | SortOrder
    author_email?: SortOrderInput | SortOrder
    content?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user_id?: SortOrderInput | SortOrder
    parent_id?: SortOrderInput | SortOrder
    _count?: CommentCountOrderByAggregateInput
    _avg?: CommentAvgOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
    _sum?: CommentSumOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Comment"> | number
    post_id?: IntNullableWithAggregatesFilter<"Comment"> | number | null
    author_name?: StringNullableWithAggregatesFilter<"Comment"> | string | null
    author_email?: StringNullableWithAggregatesFilter<"Comment"> | string | null
    content?: StringNullableWithAggregatesFilter<"Comment"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    user_id?: IntNullableWithAggregatesFilter<"Comment"> | number | null
    parent_id?: IntNullableWithAggregatesFilter<"Comment"> | number | null
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: IntFilter<"Post"> | number
    title?: StringFilter<"Post"> | string
    slug?: StringFilter<"Post"> | string
    content?: StringNullableFilter<"Post"> | string | null
    series_id?: IntNullableFilter<"Post"> | number | null
    series_order?: IntNullableFilter<"Post"> | number | null
    cover_image?: StringNullableFilter<"Post"> | string | null
    is_pinned?: BoolFilter<"Post"> | boolean
    is_published?: BoolFilter<"Post"> | boolean
    views?: IntFilter<"Post"> | number
    likes?: IntFilter<"Post"> | number
    created_at?: DateTimeFilter<"Post"> | Date | string
    updated_at?: DateTimeFilter<"Post"> | Date | string
    category_id?: IntNullableFilter<"Post"> | number | null
    author_id?: IntNullableFilter<"Post"> | number | null
    is_blocked?: BoolFilter<"Post"> | boolean
    blocked_by_id?: IntNullableFilter<"Post"> | number | null
    blocked_reason?: StringNullableFilter<"Post"> | string | null
    Comment?: CommentListRelationFilter
    Author?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    BlockedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    Category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    Series?: XOR<SeriesNullableScalarRelationFilter, SeriesWhereInput> | null
    PostLike?: PostLikeListRelationFilter
    Tag?: TagListRelationFilter
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrderInput | SortOrder
    series_id?: SortOrderInput | SortOrder
    series_order?: SortOrderInput | SortOrder
    cover_image?: SortOrderInput | SortOrder
    is_pinned?: SortOrder
    is_published?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    category_id?: SortOrderInput | SortOrder
    author_id?: SortOrderInput | SortOrder
    is_blocked?: SortOrder
    blocked_by_id?: SortOrderInput | SortOrder
    blocked_reason?: SortOrderInput | SortOrder
    Comment?: CommentOrderByRelationAggregateInput
    Author?: UserOrderByWithRelationInput
    BlockedBy?: UserOrderByWithRelationInput
    Category?: CategoryOrderByWithRelationInput
    Series?: SeriesOrderByWithRelationInput
    PostLike?: PostLikeOrderByRelationAggregateInput
    Tag?: TagOrderByRelationAggregateInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    slug?: string
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    title?: StringFilter<"Post"> | string
    content?: StringNullableFilter<"Post"> | string | null
    series_id?: IntNullableFilter<"Post"> | number | null
    series_order?: IntNullableFilter<"Post"> | number | null
    cover_image?: StringNullableFilter<"Post"> | string | null
    is_pinned?: BoolFilter<"Post"> | boolean
    is_published?: BoolFilter<"Post"> | boolean
    views?: IntFilter<"Post"> | number
    likes?: IntFilter<"Post"> | number
    created_at?: DateTimeFilter<"Post"> | Date | string
    updated_at?: DateTimeFilter<"Post"> | Date | string
    category_id?: IntNullableFilter<"Post"> | number | null
    author_id?: IntNullableFilter<"Post"> | number | null
    is_blocked?: BoolFilter<"Post"> | boolean
    blocked_by_id?: IntNullableFilter<"Post"> | number | null
    blocked_reason?: StringNullableFilter<"Post"> | string | null
    Comment?: CommentListRelationFilter
    Author?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    BlockedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    Category?: XOR<CategoryNullableScalarRelationFilter, CategoryWhereInput> | null
    Series?: XOR<SeriesNullableScalarRelationFilter, SeriesWhereInput> | null
    PostLike?: PostLikeListRelationFilter
    Tag?: TagListRelationFilter
  }, "id" | "slug">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrderInput | SortOrder
    series_id?: SortOrderInput | SortOrder
    series_order?: SortOrderInput | SortOrder
    cover_image?: SortOrderInput | SortOrder
    is_pinned?: SortOrder
    is_published?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    category_id?: SortOrderInput | SortOrder
    author_id?: SortOrderInput | SortOrder
    is_blocked?: SortOrder
    blocked_by_id?: SortOrderInput | SortOrder
    blocked_reason?: SortOrderInput | SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Post"> | number
    title?: StringWithAggregatesFilter<"Post"> | string
    slug?: StringWithAggregatesFilter<"Post"> | string
    content?: StringNullableWithAggregatesFilter<"Post"> | string | null
    series_id?: IntNullableWithAggregatesFilter<"Post"> | number | null
    series_order?: IntNullableWithAggregatesFilter<"Post"> | number | null
    cover_image?: StringNullableWithAggregatesFilter<"Post"> | string | null
    is_pinned?: BoolWithAggregatesFilter<"Post"> | boolean
    is_published?: BoolWithAggregatesFilter<"Post"> | boolean
    views?: IntWithAggregatesFilter<"Post"> | number
    likes?: IntWithAggregatesFilter<"Post"> | number
    created_at?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    category_id?: IntNullableWithAggregatesFilter<"Post"> | number | null
    author_id?: IntNullableWithAggregatesFilter<"Post"> | number | null
    is_blocked?: BoolWithAggregatesFilter<"Post"> | boolean
    blocked_by_id?: IntNullableWithAggregatesFilter<"Post"> | number | null
    blocked_reason?: StringNullableWithAggregatesFilter<"Post"> | string | null
  }

  export type PostLikeWhereInput = {
    AND?: PostLikeWhereInput | PostLikeWhereInput[]
    OR?: PostLikeWhereInput[]
    NOT?: PostLikeWhereInput | PostLikeWhereInput[]
    id?: IntFilter<"PostLike"> | number
    post_id?: IntFilter<"PostLike"> | number
    user_id?: IntFilter<"PostLike"> | number
    created_at?: DateTimeFilter<"PostLike"> | Date | string
    Post?: XOR<PostScalarRelationFilter, PostWhereInput>
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PostLikeOrderByWithRelationInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    Post?: PostOrderByWithRelationInput
    User?: UserOrderByWithRelationInput
  }

  export type PostLikeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    user_id_post_id?: PostLikeUser_idPost_idCompoundUniqueInput
    AND?: PostLikeWhereInput | PostLikeWhereInput[]
    OR?: PostLikeWhereInput[]
    NOT?: PostLikeWhereInput | PostLikeWhereInput[]
    post_id?: IntFilter<"PostLike"> | number
    user_id?: IntFilter<"PostLike"> | number
    created_at?: DateTimeFilter<"PostLike"> | Date | string
    Post?: XOR<PostScalarRelationFilter, PostWhereInput>
    User?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "user_id_post_id">

  export type PostLikeOrderByWithAggregationInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    _count?: PostLikeCountOrderByAggregateInput
    _avg?: PostLikeAvgOrderByAggregateInput
    _max?: PostLikeMaxOrderByAggregateInput
    _min?: PostLikeMinOrderByAggregateInput
    _sum?: PostLikeSumOrderByAggregateInput
  }

  export type PostLikeScalarWhereWithAggregatesInput = {
    AND?: PostLikeScalarWhereWithAggregatesInput | PostLikeScalarWhereWithAggregatesInput[]
    OR?: PostLikeScalarWhereWithAggregatesInput[]
    NOT?: PostLikeScalarWhereWithAggregatesInput | PostLikeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PostLike"> | number
    post_id?: IntWithAggregatesFilter<"PostLike"> | number
    user_id?: IntWithAggregatesFilter<"PostLike"> | number
    created_at?: DateTimeWithAggregatesFilter<"PostLike"> | Date | string
  }

  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: IntFilter<"Tag"> | number
    name?: StringFilter<"Tag"> | string
    created_at?: DateTimeFilter<"Tag"> | Date | string
    Post?: PostListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    Post?: PostOrderByRelationAggregateInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    created_at?: DateTimeFilter<"Tag"> | Date | string
    Post?: PostListRelationFilter
  }, "id" | "name">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _avg?: TagAvgOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
    _sum?: TagSumOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Tag"> | number
    name?: StringWithAggregatesFilter<"Tag"> | string
    created_at?: DateTimeWithAggregatesFilter<"Tag"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    username?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    fullname?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    profession?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    birthday?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    google_id?: StringNullableFilter<"User"> | string | null
    facebook_id?: StringNullableFilter<"User"> | string | null
    apple_id?: StringNullableFilter<"User"> | string | null
    reset_token?: StringNullableFilter<"User"> | string | null
    reset_token_expiry?: DateTimeNullableFilter<"User"> | Date | string | null
    is_active?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    can_comment?: BoolFilter<"User"> | boolean
    can_post?: BoolFilter<"User"> | boolean
    Comment?: CommentListRelationFilter
    Notification?: NotificationListRelationFilter
    Posts?: PostListRelationFilter
    BlockedPosts?: PostListRelationFilter
    SentNotification?: NotificationListRelationFilter
    PostLike?: PostLikeListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    fullname?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    profession?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    birthday?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    google_id?: SortOrderInput | SortOrder
    facebook_id?: SortOrderInput | SortOrder
    apple_id?: SortOrderInput | SortOrder
    reset_token?: SortOrderInput | SortOrder
    reset_token_expiry?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    can_comment?: SortOrder
    can_post?: SortOrder
    Comment?: CommentOrderByRelationAggregateInput
    Notification?: NotificationOrderByRelationAggregateInput
    Posts?: PostOrderByRelationAggregateInput
    BlockedPosts?: PostOrderByRelationAggregateInput
    SentNotification?: NotificationOrderByRelationAggregateInput
    PostLike?: PostLikeOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    google_id?: string
    facebook_id?: string
    apple_id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    email?: StringNullableFilter<"User"> | string | null
    fullname?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    profession?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    birthday?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    reset_token?: StringNullableFilter<"User"> | string | null
    reset_token_expiry?: DateTimeNullableFilter<"User"> | Date | string | null
    is_active?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    can_comment?: BoolFilter<"User"> | boolean
    can_post?: BoolFilter<"User"> | boolean
    Comment?: CommentListRelationFilter
    Notification?: NotificationListRelationFilter
    Posts?: PostListRelationFilter
    BlockedPosts?: PostListRelationFilter
    SentNotification?: NotificationListRelationFilter
    PostLike?: PostLikeListRelationFilter
  }, "id" | "username" | "google_id" | "facebook_id" | "apple_id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    fullname?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    profession?: SortOrderInput | SortOrder
    password?: SortOrder
    role?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    birthday?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    google_id?: SortOrderInput | SortOrder
    facebook_id?: SortOrderInput | SortOrder
    apple_id?: SortOrderInput | SortOrder
    reset_token?: SortOrderInput | SortOrder
    reset_token_expiry?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    can_comment?: SortOrder
    can_post?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    fullname?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    profession?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    birthday?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    google_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    facebook_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    apple_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    reset_token?: StringNullableWithAggregatesFilter<"User"> | string | null
    reset_token_expiry?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    is_active?: BoolWithAggregatesFilter<"User"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    can_comment?: BoolWithAggregatesFilter<"User"> | boolean
    can_post?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: IntFilter<"Notification"> | number
    recipient_id?: IntFilter<"Notification"> | number
    sender_id?: IntNullableFilter<"Notification"> | number | null
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    link?: StringNullableFilter<"Notification"> | string | null
    is_read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    Recipient?: XOR<UserScalarRelationFilter, UserWhereInput>
    Sender?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    recipient_id?: SortOrder
    sender_id?: SortOrderInput | SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    link?: SortOrderInput | SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
    Recipient?: UserOrderByWithRelationInput
    Sender?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    recipient_id?: IntFilter<"Notification"> | number
    sender_id?: IntNullableFilter<"Notification"> | number | null
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    link?: StringNullableFilter<"Notification"> | string | null
    is_read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    Recipient?: XOR<UserScalarRelationFilter, UserWhereInput>
    Sender?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    recipient_id?: SortOrder
    sender_id?: SortOrderInput | SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    link?: SortOrderInput | SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notification"> | number
    recipient_id?: IntWithAggregatesFilter<"Notification"> | number
    sender_id?: IntNullableWithAggregatesFilter<"Notification"> | number | null
    type?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    content?: StringWithAggregatesFilter<"Notification"> | string
    link?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    is_read?: BoolWithAggregatesFilter<"Notification"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type SettingWhereInput = {
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    key?: StringFilter<"Setting"> | string
    value?: StringNullableFilter<"Setting"> | string | null
    group?: StringFilter<"Setting"> | string
    is_public?: BoolFilter<"Setting"> | boolean
    updated_at?: DateTimeFilter<"Setting"> | Date | string
  }

  export type SettingOrderByWithRelationInput = {
    key?: SortOrder
    value?: SortOrderInput | SortOrder
    group?: SortOrder
    is_public?: SortOrder
    updated_at?: SortOrder
  }

  export type SettingWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    value?: StringNullableFilter<"Setting"> | string | null
    group?: StringFilter<"Setting"> | string
    is_public?: BoolFilter<"Setting"> | boolean
    updated_at?: DateTimeFilter<"Setting"> | Date | string
  }, "key">

  export type SettingOrderByWithAggregationInput = {
    key?: SortOrder
    value?: SortOrderInput | SortOrder
    group?: SortOrder
    is_public?: SortOrder
    updated_at?: SortOrder
    _count?: SettingCountOrderByAggregateInput
    _max?: SettingMaxOrderByAggregateInput
    _min?: SettingMinOrderByAggregateInput
  }

  export type SettingScalarWhereWithAggregatesInput = {
    AND?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    OR?: SettingScalarWhereWithAggregatesInput[]
    NOT?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    key?: StringWithAggregatesFilter<"Setting"> | string
    value?: StringNullableWithAggregatesFilter<"Setting"> | string | null
    group?: StringWithAggregatesFilter<"Setting"> | string
    is_public?: BoolWithAggregatesFilter<"Setting"> | boolean
    updated_at?: DateTimeWithAggregatesFilter<"Setting"> | Date | string
  }

  export type MaintenanceCodeWhereInput = {
    AND?: MaintenanceCodeWhereInput | MaintenanceCodeWhereInput[]
    OR?: MaintenanceCodeWhereInput[]
    NOT?: MaintenanceCodeWhereInput | MaintenanceCodeWhereInput[]
    id?: IntFilter<"MaintenanceCode"> | number
    code?: StringFilter<"MaintenanceCode"> | string
    is_used?: BoolFilter<"MaintenanceCode"> | boolean
    expires_at?: DateTimeFilter<"MaintenanceCode"> | Date | string
    created_at?: DateTimeFilter<"MaintenanceCode"> | Date | string
  }

  export type MaintenanceCodeOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    is_used?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type MaintenanceCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MaintenanceCodeWhereInput | MaintenanceCodeWhereInput[]
    OR?: MaintenanceCodeWhereInput[]
    NOT?: MaintenanceCodeWhereInput | MaintenanceCodeWhereInput[]
    code?: StringFilter<"MaintenanceCode"> | string
    is_used?: BoolFilter<"MaintenanceCode"> | boolean
    expires_at?: DateTimeFilter<"MaintenanceCode"> | Date | string
    created_at?: DateTimeFilter<"MaintenanceCode"> | Date | string
  }, "id">

  export type MaintenanceCodeOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    is_used?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
    _count?: MaintenanceCodeCountOrderByAggregateInput
    _avg?: MaintenanceCodeAvgOrderByAggregateInput
    _max?: MaintenanceCodeMaxOrderByAggregateInput
    _min?: MaintenanceCodeMinOrderByAggregateInput
    _sum?: MaintenanceCodeSumOrderByAggregateInput
  }

  export type MaintenanceCodeScalarWhereWithAggregatesInput = {
    AND?: MaintenanceCodeScalarWhereWithAggregatesInput | MaintenanceCodeScalarWhereWithAggregatesInput[]
    OR?: MaintenanceCodeScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceCodeScalarWhereWithAggregatesInput | MaintenanceCodeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MaintenanceCode"> | number
    code?: StringWithAggregatesFilter<"MaintenanceCode"> | string
    is_used?: BoolWithAggregatesFilter<"MaintenanceCode"> | boolean
    expires_at?: DateTimeWithAggregatesFilter<"MaintenanceCode"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"MaintenanceCode"> | Date | string
  }

  export type CategoryCreateInput = {
    name: string
    slug?: string
    created_at?: Date | string
    Post?: PostCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: number
    name: string
    slug?: string
    created_at?: Date | string
    Post?: PostUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: number
    name: string
    slug?: string
    created_at?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesCreateInput = {
    name: string
    slug: string
    description?: string | null
    created_at?: Date | string
    Post?: PostCreateNestedManyWithoutSeriesInput
  }

  export type SeriesUncheckedCreateInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    created_at?: Date | string
    Post?: PostUncheckedCreateNestedManyWithoutSeriesInput
  }

  export type SeriesUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUpdateManyWithoutSeriesNestedInput
  }

  export type SeriesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUncheckedUpdateManyWithoutSeriesNestedInput
  }

  export type SeriesCreateManyInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    created_at?: Date | string
  }

  export type SeriesUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentCreateInput = {
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    Parent?: CommentCreateNestedOneWithoutRepliesInput
    Replies?: CommentCreateNestedManyWithoutParentInput
    Post?: PostCreateNestedOneWithoutCommentInput
    User?: UserCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateInput = {
    id?: number
    post_id?: number | null
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    user_id?: number | null
    parent_id?: number | null
    Replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentUpdateInput = {
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Parent?: CommentUpdateOneWithoutRepliesNestedInput
    Replies?: CommentUpdateManyWithoutParentNestedInput
    Post?: PostUpdateOneWithoutCommentNestedInput
    User?: UserUpdateOneWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    Replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentCreateManyInput = {
    id?: number
    post_id?: number | null
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    user_id?: number | null
    parent_id?: number | null
  }

  export type CommentUpdateManyMutationInput = {
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PostCreateInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentCreateNestedManyWithoutPostInput
    Author?: UserCreateNestedOneWithoutPostsInput
    BlockedBy?: UserCreateNestedOneWithoutBlockedPostsInput
    Category?: CategoryCreateNestedOneWithoutPostInput
    Series?: SeriesCreateNestedOneWithoutPostInput
    PostLike?: PostLikeCreateNestedManyWithoutPostInput
    Tag?: TagCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutPostInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutPostInput
    Tag?: TagUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUpdateManyWithoutPostNestedInput
    Author?: UserUpdateOneWithoutPostsNestedInput
    BlockedBy?: UserUpdateOneWithoutBlockedPostsNestedInput
    Category?: CategoryUpdateOneWithoutPostNestedInput
    Series?: SeriesUpdateOneWithoutPostNestedInput
    PostLike?: PostLikeUpdateManyWithoutPostNestedInput
    Tag?: TagUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutPostNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
    Tag?: TagUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostCreateManyInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
  }

  export type PostUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostLikeCreateInput = {
    created_at?: Date | string
    Post: PostCreateNestedOneWithoutPostLikeInput
    User: UserCreateNestedOneWithoutPostLikeInput
  }

  export type PostLikeUncheckedCreateInput = {
    id?: number
    post_id: number
    user_id: number
    created_at?: Date | string
  }

  export type PostLikeUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUpdateOneRequiredWithoutPostLikeNestedInput
    User?: UserUpdateOneRequiredWithoutPostLikeNestedInput
  }

  export type PostLikeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeCreateManyInput = {
    id?: number
    post_id: number
    user_id: number
    created_at?: Date | string
  }

  export type PostLikeUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagCreateInput = {
    name: string
    created_at?: Date | string
    Post?: PostCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: number
    name: string
    created_at?: Date | string
    Post?: PostUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: number
    name: string
    created_at?: Date | string
  }

  export type TagUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutRecipientInput
    Posts?: PostCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutRecipientInput
    Posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostUncheckedCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutRecipientNestedInput
    Posts?: PostUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput
    Posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUncheckedUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
  }

  export type UserUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationCreateInput = {
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
    Recipient: UserCreateNestedOneWithoutNotificationInput
    Sender?: UserCreateNestedOneWithoutSentNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: number
    recipient_id: number
    sender_id?: number | null
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Recipient?: UserUpdateOneRequiredWithoutNotificationNestedInput
    Sender?: UserUpdateOneWithoutSentNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipient_id?: IntFieldUpdateOperationsInput | number
    sender_id?: NullableIntFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: number
    recipient_id: number
    sender_id?: number | null
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipient_id?: IntFieldUpdateOperationsInput | number
    sender_id?: NullableIntFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingCreateInput = {
    key: string
    value?: string | null
    group?: string
    is_public?: boolean
    updated_at?: Date | string
  }

  export type SettingUncheckedCreateInput = {
    key: string
    value?: string | null
    group?: string
    is_public?: boolean
    updated_at?: Date | string
  }

  export type SettingUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
    group?: StringFieldUpdateOperationsInput | string
    is_public?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
    group?: StringFieldUpdateOperationsInput | string
    is_public?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingCreateManyInput = {
    key: string
    value?: string | null
    group?: string
    is_public?: boolean
    updated_at?: Date | string
  }

  export type SettingUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
    group?: StringFieldUpdateOperationsInput | string
    is_public?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: NullableStringFieldUpdateOperationsInput | string | null
    group?: StringFieldUpdateOperationsInput | string
    is_public?: BoolFieldUpdateOperationsInput | boolean
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceCodeCreateInput = {
    code: string
    is_used?: boolean
    expires_at: Date | string
    created_at?: Date | string
  }

  export type MaintenanceCodeUncheckedCreateInput = {
    id?: number
    code: string
    is_used?: boolean
    expires_at: Date | string
    created_at?: Date | string
  }

  export type MaintenanceCodeUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    is_used?: BoolFieldUpdateOperationsInput | boolean
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceCodeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    is_used?: BoolFieldUpdateOperationsInput | boolean
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceCodeCreateManyInput = {
    id?: number
    code: string
    is_used?: boolean
    expires_at: Date | string
    created_at?: Date | string
  }

  export type MaintenanceCodeUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    is_used?: BoolFieldUpdateOperationsInput | boolean
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceCodeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    is_used?: BoolFieldUpdateOperationsInput | boolean
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PostListRelationFilter = {
    every?: PostWhereInput
    some?: PostWhereInput
    none?: PostWhereInput
  }

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    created_at?: SortOrder
  }

  export type CategoryAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    created_at?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    created_at?: SortOrder
  }

  export type CategorySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SeriesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type SeriesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SeriesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type SeriesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
  }

  export type SeriesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type CommentNullableScalarRelationFilter = {
    is?: CommentWhereInput | null
    isNot?: CommentWhereInput | null
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type PostNullableScalarRelationFilter = {
    is?: PostWhereInput | null
    isNot?: PostWhereInput | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    author_name?: SortOrder
    author_email?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    parent_id?: SortOrder
  }

  export type CommentAvgOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
    parent_id?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    author_name?: SortOrder
    author_email?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    parent_id?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    author_name?: SortOrder
    author_email?: SortOrder
    content?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    parent_id?: SortOrder
  }

  export type CommentSumOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
    parent_id?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CategoryNullableScalarRelationFilter = {
    is?: CategoryWhereInput | null
    isNot?: CategoryWhereInput | null
  }

  export type SeriesNullableScalarRelationFilter = {
    is?: SeriesWhereInput | null
    isNot?: SeriesWhereInput | null
  }

  export type PostLikeListRelationFilter = {
    every?: PostLikeWhereInput
    some?: PostLikeWhereInput
    none?: PostLikeWhereInput
  }

  export type TagListRelationFilter = {
    every?: TagWhereInput
    some?: TagWhereInput
    none?: TagWhereInput
  }

  export type PostLikeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    series_id?: SortOrder
    series_order?: SortOrder
    cover_image?: SortOrder
    is_pinned?: SortOrder
    is_published?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    is_blocked?: SortOrder
    blocked_by_id?: SortOrder
    blocked_reason?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    id?: SortOrder
    series_id?: SortOrder
    series_order?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    blocked_by_id?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    series_id?: SortOrder
    series_order?: SortOrder
    cover_image?: SortOrder
    is_pinned?: SortOrder
    is_published?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    is_blocked?: SortOrder
    blocked_by_id?: SortOrder
    blocked_reason?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    content?: SortOrder
    series_id?: SortOrder
    series_order?: SortOrder
    cover_image?: SortOrder
    is_pinned?: SortOrder
    is_published?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    is_blocked?: SortOrder
    blocked_by_id?: SortOrder
    blocked_reason?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    id?: SortOrder
    series_id?: SortOrder
    series_order?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    blocked_by_id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PostScalarRelationFilter = {
    is?: PostWhereInput
    isNot?: PostWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PostLikeUser_idPost_idCompoundUniqueInput = {
    user_id: number
    post_id: number
  }

  export type PostLikeCountOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type PostLikeAvgOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
  }

  export type PostLikeMaxOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type PostLikeMinOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type PostLikeSumOrderByAggregateInput = {
    id?: SortOrder
    post_id?: SortOrder
    user_id?: SortOrder
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type TagAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type TagSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    fullname?: SortOrder
    avatar?: SortOrder
    profession?: SortOrder
    password?: SortOrder
    role?: SortOrder
    phone?: SortOrder
    birthday?: SortOrder
    address?: SortOrder
    google_id?: SortOrder
    facebook_id?: SortOrder
    apple_id?: SortOrder
    reset_token?: SortOrder
    reset_token_expiry?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    can_comment?: SortOrder
    can_post?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    fullname?: SortOrder
    avatar?: SortOrder
    profession?: SortOrder
    password?: SortOrder
    role?: SortOrder
    phone?: SortOrder
    birthday?: SortOrder
    address?: SortOrder
    google_id?: SortOrder
    facebook_id?: SortOrder
    apple_id?: SortOrder
    reset_token?: SortOrder
    reset_token_expiry?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    can_comment?: SortOrder
    can_post?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    fullname?: SortOrder
    avatar?: SortOrder
    profession?: SortOrder
    password?: SortOrder
    role?: SortOrder
    phone?: SortOrder
    birthday?: SortOrder
    address?: SortOrder
    google_id?: SortOrder
    facebook_id?: SortOrder
    apple_id?: SortOrder
    reset_token?: SortOrder
    reset_token_expiry?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    can_comment?: SortOrder
    can_post?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    recipient_id?: SortOrder
    sender_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    link?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    id?: SortOrder
    recipient_id?: SortOrder
    sender_id?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    recipient_id?: SortOrder
    sender_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    link?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    recipient_id?: SortOrder
    sender_id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    content?: SortOrder
    link?: SortOrder
    is_read?: SortOrder
    created_at?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    id?: SortOrder
    recipient_id?: SortOrder
    sender_id?: SortOrder
  }

  export type SettingCountOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    group?: SortOrder
    is_public?: SortOrder
    updated_at?: SortOrder
  }

  export type SettingMaxOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    group?: SortOrder
    is_public?: SortOrder
    updated_at?: SortOrder
  }

  export type SettingMinOrderByAggregateInput = {
    key?: SortOrder
    value?: SortOrder
    group?: SortOrder
    is_public?: SortOrder
    updated_at?: SortOrder
  }

  export type MaintenanceCodeCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    is_used?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type MaintenanceCodeAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MaintenanceCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    is_used?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type MaintenanceCodeMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    is_used?: SortOrder
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type MaintenanceCodeSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PostCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PostCreateWithoutCategoryInput, PostUncheckedCreateWithoutCategoryInput> | PostCreateWithoutCategoryInput[] | PostUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCategoryInput | PostCreateOrConnectWithoutCategoryInput[]
    createMany?: PostCreateManyCategoryInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PostCreateWithoutCategoryInput, PostUncheckedCreateWithoutCategoryInput> | PostCreateWithoutCategoryInput[] | PostUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCategoryInput | PostCreateOrConnectWithoutCategoryInput[]
    createMany?: PostCreateManyCategoryInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PostUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PostCreateWithoutCategoryInput, PostUncheckedCreateWithoutCategoryInput> | PostCreateWithoutCategoryInput[] | PostUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCategoryInput | PostCreateOrConnectWithoutCategoryInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutCategoryInput | PostUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PostCreateManyCategoryInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutCategoryInput | PostUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PostUpdateManyWithWhereWithoutCategoryInput | PostUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PostUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PostCreateWithoutCategoryInput, PostUncheckedCreateWithoutCategoryInput> | PostCreateWithoutCategoryInput[] | PostUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PostCreateOrConnectWithoutCategoryInput | PostCreateOrConnectWithoutCategoryInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutCategoryInput | PostUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PostCreateManyCategoryInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutCategoryInput | PostUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PostUpdateManyWithWhereWithoutCategoryInput | PostUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostCreateNestedManyWithoutSeriesInput = {
    create?: XOR<PostCreateWithoutSeriesInput, PostUncheckedCreateWithoutSeriesInput> | PostCreateWithoutSeriesInput[] | PostUncheckedCreateWithoutSeriesInput[]
    connectOrCreate?: PostCreateOrConnectWithoutSeriesInput | PostCreateOrConnectWithoutSeriesInput[]
    createMany?: PostCreateManySeriesInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutSeriesInput = {
    create?: XOR<PostCreateWithoutSeriesInput, PostUncheckedCreateWithoutSeriesInput> | PostCreateWithoutSeriesInput[] | PostUncheckedCreateWithoutSeriesInput[]
    connectOrCreate?: PostCreateOrConnectWithoutSeriesInput | PostCreateOrConnectWithoutSeriesInput[]
    createMany?: PostCreateManySeriesInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type PostUpdateManyWithoutSeriesNestedInput = {
    create?: XOR<PostCreateWithoutSeriesInput, PostUncheckedCreateWithoutSeriesInput> | PostCreateWithoutSeriesInput[] | PostUncheckedCreateWithoutSeriesInput[]
    connectOrCreate?: PostCreateOrConnectWithoutSeriesInput | PostCreateOrConnectWithoutSeriesInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutSeriesInput | PostUpsertWithWhereUniqueWithoutSeriesInput[]
    createMany?: PostCreateManySeriesInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutSeriesInput | PostUpdateWithWhereUniqueWithoutSeriesInput[]
    updateMany?: PostUpdateManyWithWhereWithoutSeriesInput | PostUpdateManyWithWhereWithoutSeriesInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutSeriesNestedInput = {
    create?: XOR<PostCreateWithoutSeriesInput, PostUncheckedCreateWithoutSeriesInput> | PostCreateWithoutSeriesInput[] | PostUncheckedCreateWithoutSeriesInput[]
    connectOrCreate?: PostCreateOrConnectWithoutSeriesInput | PostCreateOrConnectWithoutSeriesInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutSeriesInput | PostUpsertWithWhereUniqueWithoutSeriesInput[]
    createMany?: PostCreateManySeriesInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutSeriesInput | PostUpdateWithWhereUniqueWithoutSeriesInput[]
    updateMany?: PostUpdateManyWithWhereWithoutSeriesInput | PostUpdateManyWithWhereWithoutSeriesInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type CommentCreateNestedOneWithoutRepliesInput = {
    create?: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: CommentCreateOrConnectWithoutRepliesInput
    connect?: CommentWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutParentInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type PostCreateNestedOneWithoutCommentInput = {
    create?: XOR<PostCreateWithoutCommentInput, PostUncheckedCreateWithoutCommentInput>
    connectOrCreate?: PostCreateOrConnectWithoutCommentInput
    connect?: PostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCommentInput = {
    create?: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentInput
    connect?: UserWhereUniqueInput
  }

  export type CommentUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CommentUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: CommentCreateOrConnectWithoutRepliesInput
    upsert?: CommentUpsertWithoutRepliesInput
    disconnect?: CommentWhereInput | boolean
    delete?: CommentWhereInput | boolean
    connect?: CommentWhereUniqueInput
    update?: XOR<XOR<CommentUpdateToOneWithWhereWithoutRepliesInput, CommentUpdateWithoutRepliesInput>, CommentUncheckedUpdateWithoutRepliesInput>
  }

  export type CommentUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutParentInput | CommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutParentInput | CommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutParentInput | CommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type PostUpdateOneWithoutCommentNestedInput = {
    create?: XOR<PostCreateWithoutCommentInput, PostUncheckedCreateWithoutCommentInput>
    connectOrCreate?: PostCreateOrConnectWithoutCommentInput
    upsert?: PostUpsertWithoutCommentInput
    disconnect?: PostWhereInput | boolean
    delete?: PostWhereInput | boolean
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutCommentInput, PostUpdateWithoutCommentInput>, PostUncheckedUpdateWithoutCommentInput>
  }

  export type UserUpdateOneWithoutCommentNestedInput = {
    create?: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentInput
    upsert?: UserUpsertWithoutCommentInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentInput, UserUpdateWithoutCommentInput>, UserUncheckedUpdateWithoutCommentInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput> | CommentCreateWithoutParentInput[] | CommentUncheckedCreateWithoutParentInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutParentInput | CommentCreateOrConnectWithoutParentInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutParentInput | CommentUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: CommentCreateManyParentInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutParentInput | CommentUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutParentInput | CommentUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type CommentCreateNestedManyWithoutPostInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutPostsInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutBlockedPostsInput = {
    create?: XOR<UserCreateWithoutBlockedPostsInput, UserUncheckedCreateWithoutBlockedPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBlockedPostsInput
    connect?: UserWhereUniqueInput
  }

  export type CategoryCreateNestedOneWithoutPostInput = {
    create?: XOR<CategoryCreateWithoutPostInput, CategoryUncheckedCreateWithoutPostInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutPostInput
    connect?: CategoryWhereUniqueInput
  }

  export type SeriesCreateNestedOneWithoutPostInput = {
    create?: XOR<SeriesCreateWithoutPostInput, SeriesUncheckedCreateWithoutPostInput>
    connectOrCreate?: SeriesCreateOrConnectWithoutPostInput
    connect?: SeriesWhereUniqueInput
  }

  export type PostLikeCreateNestedManyWithoutPostInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type TagCreateNestedManyWithoutPostInput = {
    create?: XOR<TagCreateWithoutPostInput, TagUncheckedCreateWithoutPostInput> | TagCreateWithoutPostInput[] | TagUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TagCreateOrConnectWithoutPostInput | TagCreateOrConnectWithoutPostInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type PostLikeUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type TagUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<TagCreateWithoutPostInput, TagUncheckedCreateWithoutPostInput> | TagCreateWithoutPostInput[] | TagUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TagCreateOrConnectWithoutPostInput | TagCreateOrConnectWithoutPostInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CommentUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutPostInput | CommentUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutPostInput | CommentUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutPostInput | CommentUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type UserUpdateOneWithoutPostsNestedInput = {
    create?: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput
    upsert?: UserUpsertWithoutPostsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostsInput, UserUpdateWithoutPostsInput>, UserUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateOneWithoutBlockedPostsNestedInput = {
    create?: XOR<UserCreateWithoutBlockedPostsInput, UserUncheckedCreateWithoutBlockedPostsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBlockedPostsInput
    upsert?: UserUpsertWithoutBlockedPostsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBlockedPostsInput, UserUpdateWithoutBlockedPostsInput>, UserUncheckedUpdateWithoutBlockedPostsInput>
  }

  export type CategoryUpdateOneWithoutPostNestedInput = {
    create?: XOR<CategoryCreateWithoutPostInput, CategoryUncheckedCreateWithoutPostInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutPostInput
    upsert?: CategoryUpsertWithoutPostInput
    disconnect?: CategoryWhereInput | boolean
    delete?: CategoryWhereInput | boolean
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutPostInput, CategoryUpdateWithoutPostInput>, CategoryUncheckedUpdateWithoutPostInput>
  }

  export type SeriesUpdateOneWithoutPostNestedInput = {
    create?: XOR<SeriesCreateWithoutPostInput, SeriesUncheckedCreateWithoutPostInput>
    connectOrCreate?: SeriesCreateOrConnectWithoutPostInput
    upsert?: SeriesUpsertWithoutPostInput
    disconnect?: SeriesWhereInput | boolean
    delete?: SeriesWhereInput | boolean
    connect?: SeriesWhereUniqueInput
    update?: XOR<XOR<SeriesUpdateToOneWithWhereWithoutPostInput, SeriesUpdateWithoutPostInput>, SeriesUncheckedUpdateWithoutPostInput>
  }

  export type PostLikeUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutPostInput | PostLikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutPostInput | PostLikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutPostInput | PostLikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type TagUpdateManyWithoutPostNestedInput = {
    create?: XOR<TagCreateWithoutPostInput, TagUncheckedCreateWithoutPostInput> | TagCreateWithoutPostInput[] | TagUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TagCreateOrConnectWithoutPostInput | TagCreateOrConnectWithoutPostInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutPostInput | TagUpsertWithWhereUniqueWithoutPostInput[]
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutPostInput | TagUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: TagUpdateManyWithWhereWithoutPostInput | TagUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput> | CommentCreateWithoutPostInput[] | CommentUncheckedCreateWithoutPostInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutPostInput | CommentCreateOrConnectWithoutPostInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutPostInput | CommentUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: CommentCreateManyPostInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutPostInput | CommentUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutPostInput | CommentUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type PostLikeUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput> | PostLikeCreateWithoutPostInput[] | PostLikeUncheckedCreateWithoutPostInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutPostInput | PostLikeCreateOrConnectWithoutPostInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutPostInput | PostLikeUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: PostLikeCreateManyPostInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutPostInput | PostLikeUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutPostInput | PostLikeUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type TagUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<TagCreateWithoutPostInput, TagUncheckedCreateWithoutPostInput> | TagCreateWithoutPostInput[] | TagUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TagCreateOrConnectWithoutPostInput | TagCreateOrConnectWithoutPostInput[]
    upsert?: TagUpsertWithWhereUniqueWithoutPostInput | TagUpsertWithWhereUniqueWithoutPostInput[]
    set?: TagWhereUniqueInput | TagWhereUniqueInput[]
    disconnect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    delete?: TagWhereUniqueInput | TagWhereUniqueInput[]
    connect?: TagWhereUniqueInput | TagWhereUniqueInput[]
    update?: TagUpdateWithWhereUniqueWithoutPostInput | TagUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: TagUpdateManyWithWhereWithoutPostInput | TagUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: TagScalarWhereInput | TagScalarWhereInput[]
  }

  export type PostCreateNestedOneWithoutPostLikeInput = {
    create?: XOR<PostCreateWithoutPostLikeInput, PostUncheckedCreateWithoutPostLikeInput>
    connectOrCreate?: PostCreateOrConnectWithoutPostLikeInput
    connect?: PostWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPostLikeInput = {
    create?: XOR<UserCreateWithoutPostLikeInput, UserUncheckedCreateWithoutPostLikeInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostLikeInput
    connect?: UserWhereUniqueInput
  }

  export type PostUpdateOneRequiredWithoutPostLikeNestedInput = {
    create?: XOR<PostCreateWithoutPostLikeInput, PostUncheckedCreateWithoutPostLikeInput>
    connectOrCreate?: PostCreateOrConnectWithoutPostLikeInput
    upsert?: PostUpsertWithoutPostLikeInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutPostLikeInput, PostUpdateWithoutPostLikeInput>, PostUncheckedUpdateWithoutPostLikeInput>
  }

  export type UserUpdateOneRequiredWithoutPostLikeNestedInput = {
    create?: XOR<UserCreateWithoutPostLikeInput, UserUncheckedCreateWithoutPostLikeInput>
    connectOrCreate?: UserCreateOrConnectWithoutPostLikeInput
    upsert?: UserUpsertWithoutPostLikeInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPostLikeInput, UserUpdateWithoutPostLikeInput>, UserUncheckedUpdateWithoutPostLikeInput>
  }

  export type PostCreateNestedManyWithoutTagInput = {
    create?: XOR<PostCreateWithoutTagInput, PostUncheckedCreateWithoutTagInput> | PostCreateWithoutTagInput[] | PostUncheckedCreateWithoutTagInput[]
    connectOrCreate?: PostCreateOrConnectWithoutTagInput | PostCreateOrConnectWithoutTagInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<PostCreateWithoutTagInput, PostUncheckedCreateWithoutTagInput> | PostCreateWithoutTagInput[] | PostUncheckedCreateWithoutTagInput[]
    connectOrCreate?: PostCreateOrConnectWithoutTagInput | PostCreateOrConnectWithoutTagInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUpdateManyWithoutTagNestedInput = {
    create?: XOR<PostCreateWithoutTagInput, PostUncheckedCreateWithoutTagInput> | PostCreateWithoutTagInput[] | PostUncheckedCreateWithoutTagInput[]
    connectOrCreate?: PostCreateOrConnectWithoutTagInput | PostCreateOrConnectWithoutTagInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutTagInput | PostUpsertWithWhereUniqueWithoutTagInput[]
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutTagInput | PostUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: PostUpdateManyWithWhereWithoutTagInput | PostUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<PostCreateWithoutTagInput, PostUncheckedCreateWithoutTagInput> | PostCreateWithoutTagInput[] | PostUncheckedCreateWithoutTagInput[]
    connectOrCreate?: PostCreateOrConnectWithoutTagInput | PostCreateOrConnectWithoutTagInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutTagInput | PostUpsertWithWhereUniqueWithoutTagInput[]
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutTagInput | PostUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: PostUpdateManyWithWhereWithoutTagInput | PostUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type CommentCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutRecipientInput = {
    create?: XOR<NotificationCreateWithoutRecipientInput, NotificationUncheckedCreateWithoutRecipientInput> | NotificationCreateWithoutRecipientInput[] | NotificationUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRecipientInput | NotificationCreateOrConnectWithoutRecipientInput[]
    createMany?: NotificationCreateManyRecipientInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PostCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostCreateNestedManyWithoutBlockedByInput = {
    create?: XOR<PostCreateWithoutBlockedByInput, PostUncheckedCreateWithoutBlockedByInput> | PostCreateWithoutBlockedByInput[] | PostUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutBlockedByInput | PostCreateOrConnectWithoutBlockedByInput[]
    createMany?: PostCreateManyBlockedByInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutSenderInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PostLikeCreateNestedManyWithoutUserInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutRecipientInput = {
    create?: XOR<NotificationCreateWithoutRecipientInput, NotificationUncheckedCreateWithoutRecipientInput> | NotificationCreateWithoutRecipientInput[] | NotificationUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRecipientInput | NotificationCreateOrConnectWithoutRecipientInput[]
    createMany?: NotificationCreateManyRecipientInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutBlockedByInput = {
    create?: XOR<PostCreateWithoutBlockedByInput, PostUncheckedCreateWithoutBlockedByInput> | PostCreateWithoutBlockedByInput[] | PostUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutBlockedByInput | PostCreateOrConnectWithoutBlockedByInput[]
    createMany?: PostCreateManyBlockedByInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type PostLikeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CommentUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutRecipientNestedInput = {
    create?: XOR<NotificationCreateWithoutRecipientInput, NotificationUncheckedCreateWithoutRecipientInput> | NotificationCreateWithoutRecipientInput[] | NotificationUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRecipientInput | NotificationCreateOrConnectWithoutRecipientInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRecipientInput | NotificationUpsertWithWhereUniqueWithoutRecipientInput[]
    createMany?: NotificationCreateManyRecipientInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRecipientInput | NotificationUpdateWithWhereUniqueWithoutRecipientInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRecipientInput | NotificationUpdateManyWithWhereWithoutRecipientInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PostUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUpdateManyWithoutBlockedByNestedInput = {
    create?: XOR<PostCreateWithoutBlockedByInput, PostUncheckedCreateWithoutBlockedByInput> | PostCreateWithoutBlockedByInput[] | PostUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutBlockedByInput | PostCreateOrConnectWithoutBlockedByInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutBlockedByInput | PostUpsertWithWhereUniqueWithoutBlockedByInput[]
    createMany?: PostCreateManyBlockedByInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutBlockedByInput | PostUpdateWithWhereUniqueWithoutBlockedByInput[]
    updateMany?: PostUpdateManyWithWhereWithoutBlockedByInput | PostUpdateManyWithWhereWithoutBlockedByInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutSenderNestedInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutSenderInput | NotificationUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutSenderInput | NotificationUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutSenderInput | NotificationUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PostLikeUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutUserInput | PostLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutUserInput | PostLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutUserInput | PostLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput> | CommentCreateWithoutUserInput[] | CommentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutUserInput | CommentCreateOrConnectWithoutUserInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutUserInput | CommentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CommentCreateManyUserInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutUserInput | CommentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutUserInput | CommentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutRecipientNestedInput = {
    create?: XOR<NotificationCreateWithoutRecipientInput, NotificationUncheckedCreateWithoutRecipientInput> | NotificationCreateWithoutRecipientInput[] | NotificationUncheckedCreateWithoutRecipientInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutRecipientInput | NotificationCreateOrConnectWithoutRecipientInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutRecipientInput | NotificationUpsertWithWhereUniqueWithoutRecipientInput[]
    createMany?: NotificationCreateManyRecipientInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutRecipientInput | NotificationUpdateWithWhereUniqueWithoutRecipientInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutRecipientInput | NotificationUpdateManyWithWhereWithoutRecipientInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput> | PostCreateWithoutAuthorInput[] | PostUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: PostCreateOrConnectWithoutAuthorInput | PostCreateOrConnectWithoutAuthorInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutAuthorInput | PostUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: PostCreateManyAuthorInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutAuthorInput | PostUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: PostUpdateManyWithWhereWithoutAuthorInput | PostUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutBlockedByNestedInput = {
    create?: XOR<PostCreateWithoutBlockedByInput, PostUncheckedCreateWithoutBlockedByInput> | PostCreateWithoutBlockedByInput[] | PostUncheckedCreateWithoutBlockedByInput[]
    connectOrCreate?: PostCreateOrConnectWithoutBlockedByInput | PostCreateOrConnectWithoutBlockedByInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutBlockedByInput | PostUpsertWithWhereUniqueWithoutBlockedByInput[]
    createMany?: PostCreateManyBlockedByInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutBlockedByInput | PostUpdateWithWhereUniqueWithoutBlockedByInput[]
    updateMany?: PostUpdateManyWithWhereWithoutBlockedByInput | PostUpdateManyWithWhereWithoutBlockedByInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput> | NotificationCreateWithoutSenderInput[] | NotificationUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutSenderInput | NotificationCreateOrConnectWithoutSenderInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutSenderInput | NotificationUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: NotificationCreateManySenderInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutSenderInput | NotificationUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutSenderInput | NotificationUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type PostLikeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput> | PostLikeCreateWithoutUserInput[] | PostLikeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PostLikeCreateOrConnectWithoutUserInput | PostLikeCreateOrConnectWithoutUserInput[]
    upsert?: PostLikeUpsertWithWhereUniqueWithoutUserInput | PostLikeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PostLikeCreateManyUserInputEnvelope
    set?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    disconnect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    delete?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    connect?: PostLikeWhereUniqueInput | PostLikeWhereUniqueInput[]
    update?: PostLikeUpdateWithWhereUniqueWithoutUserInput | PostLikeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PostLikeUpdateManyWithWhereWithoutUserInput | PostLikeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutNotificationInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutSentNotificationInput = {
    create?: XOR<UserCreateWithoutSentNotificationInput, UserUncheckedCreateWithoutSentNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentNotificationInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationNestedInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    upsert?: UserUpsertWithoutNotificationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationInput, UserUpdateWithoutNotificationInput>, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type UserUpdateOneWithoutSentNotificationNestedInput = {
    create?: XOR<UserCreateWithoutSentNotificationInput, UserUncheckedCreateWithoutSentNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentNotificationInput
    upsert?: UserUpsertWithoutSentNotificationInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentNotificationInput, UserUpdateWithoutSentNotificationInput>, UserUncheckedUpdateWithoutSentNotificationInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PostCreateWithoutCategoryInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentCreateNestedManyWithoutPostInput
    Author?: UserCreateNestedOneWithoutPostsInput
    BlockedBy?: UserCreateNestedOneWithoutBlockedPostsInput
    Series?: SeriesCreateNestedOneWithoutPostInput
    PostLike?: PostLikeCreateNestedManyWithoutPostInput
    Tag?: TagCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutCategoryInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutPostInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutPostInput
    Tag?: TagUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutCategoryInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutCategoryInput, PostUncheckedCreateWithoutCategoryInput>
  }

  export type PostCreateManyCategoryInputEnvelope = {
    data: PostCreateManyCategoryInput | PostCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type PostUpsertWithWhereUniqueWithoutCategoryInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutCategoryInput, PostUncheckedUpdateWithoutCategoryInput>
    create: XOR<PostCreateWithoutCategoryInput, PostUncheckedCreateWithoutCategoryInput>
  }

  export type PostUpdateWithWhereUniqueWithoutCategoryInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutCategoryInput, PostUncheckedUpdateWithoutCategoryInput>
  }

  export type PostUpdateManyWithWhereWithoutCategoryInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutCategoryInput>
  }

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[]
    OR?: PostScalarWhereInput[]
    NOT?: PostScalarWhereInput | PostScalarWhereInput[]
    id?: IntFilter<"Post"> | number
    title?: StringFilter<"Post"> | string
    slug?: StringFilter<"Post"> | string
    content?: StringNullableFilter<"Post"> | string | null
    series_id?: IntNullableFilter<"Post"> | number | null
    series_order?: IntNullableFilter<"Post"> | number | null
    cover_image?: StringNullableFilter<"Post"> | string | null
    is_pinned?: BoolFilter<"Post"> | boolean
    is_published?: BoolFilter<"Post"> | boolean
    views?: IntFilter<"Post"> | number
    likes?: IntFilter<"Post"> | number
    created_at?: DateTimeFilter<"Post"> | Date | string
    updated_at?: DateTimeFilter<"Post"> | Date | string
    category_id?: IntNullableFilter<"Post"> | number | null
    author_id?: IntNullableFilter<"Post"> | number | null
    is_blocked?: BoolFilter<"Post"> | boolean
    blocked_by_id?: IntNullableFilter<"Post"> | number | null
    blocked_reason?: StringNullableFilter<"Post"> | string | null
  }

  export type PostCreateWithoutSeriesInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentCreateNestedManyWithoutPostInput
    Author?: UserCreateNestedOneWithoutPostsInput
    BlockedBy?: UserCreateNestedOneWithoutBlockedPostsInput
    Category?: CategoryCreateNestedOneWithoutPostInput
    PostLike?: PostLikeCreateNestedManyWithoutPostInput
    Tag?: TagCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutSeriesInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutPostInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutPostInput
    Tag?: TagUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutSeriesInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutSeriesInput, PostUncheckedCreateWithoutSeriesInput>
  }

  export type PostCreateManySeriesInputEnvelope = {
    data: PostCreateManySeriesInput | PostCreateManySeriesInput[]
    skipDuplicates?: boolean
  }

  export type PostUpsertWithWhereUniqueWithoutSeriesInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutSeriesInput, PostUncheckedUpdateWithoutSeriesInput>
    create: XOR<PostCreateWithoutSeriesInput, PostUncheckedCreateWithoutSeriesInput>
  }

  export type PostUpdateWithWhereUniqueWithoutSeriesInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutSeriesInput, PostUncheckedUpdateWithoutSeriesInput>
  }

  export type PostUpdateManyWithWhereWithoutSeriesInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutSeriesInput>
  }

  export type CommentCreateWithoutRepliesInput = {
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    Parent?: CommentCreateNestedOneWithoutRepliesInput
    Post?: PostCreateNestedOneWithoutCommentInput
    User?: UserCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateWithoutRepliesInput = {
    id?: number
    post_id?: number | null
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    user_id?: number | null
    parent_id?: number | null
  }

  export type CommentCreateOrConnectWithoutRepliesInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
  }

  export type CommentCreateWithoutParentInput = {
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    Replies?: CommentCreateNestedManyWithoutParentInput
    Post?: PostCreateNestedOneWithoutCommentInput
    User?: UserCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateWithoutParentInput = {
    id?: number
    post_id?: number | null
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    user_id?: number | null
    Replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentCreateOrConnectWithoutParentInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput>
  }

  export type CommentCreateManyParentInputEnvelope = {
    data: CommentCreateManyParentInput | CommentCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type PostCreateWithoutCommentInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Author?: UserCreateNestedOneWithoutPostsInput
    BlockedBy?: UserCreateNestedOneWithoutBlockedPostsInput
    Category?: CategoryCreateNestedOneWithoutPostInput
    Series?: SeriesCreateNestedOneWithoutPostInput
    PostLike?: PostLikeCreateNestedManyWithoutPostInput
    Tag?: TagCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutCommentInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutPostInput
    Tag?: TagUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutCommentInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutCommentInput, PostUncheckedCreateWithoutCommentInput>
  }

  export type UserCreateWithoutCommentInput = {
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Notification?: NotificationCreateNestedManyWithoutRecipientInput
    Posts?: PostCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCommentInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Notification?: NotificationUncheckedCreateNestedManyWithoutRecipientInput
    Posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostUncheckedCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCommentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
  }

  export type CommentUpsertWithoutRepliesInput = {
    update: XOR<CommentUpdateWithoutRepliesInput, CommentUncheckedUpdateWithoutRepliesInput>
    create: XOR<CommentCreateWithoutRepliesInput, CommentUncheckedCreateWithoutRepliesInput>
    where?: CommentWhereInput
  }

  export type CommentUpdateToOneWithWhereWithoutRepliesInput = {
    where?: CommentWhereInput
    data: XOR<CommentUpdateWithoutRepliesInput, CommentUncheckedUpdateWithoutRepliesInput>
  }

  export type CommentUpdateWithoutRepliesInput = {
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Parent?: CommentUpdateOneWithoutRepliesNestedInput
    Post?: PostUpdateOneWithoutCommentNestedInput
    User?: UserUpdateOneWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateWithoutRepliesInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CommentUpsertWithWhereUniqueWithoutParentInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutParentInput, CommentUncheckedUpdateWithoutParentInput>
    create: XOR<CommentCreateWithoutParentInput, CommentUncheckedCreateWithoutParentInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutParentInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutParentInput, CommentUncheckedUpdateWithoutParentInput>
  }

  export type CommentUpdateManyWithWhereWithoutParentInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutParentInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: IntFilter<"Comment"> | number
    post_id?: IntNullableFilter<"Comment"> | number | null
    author_name?: StringNullableFilter<"Comment"> | string | null
    author_email?: StringNullableFilter<"Comment"> | string | null
    content?: StringNullableFilter<"Comment"> | string | null
    created_at?: DateTimeFilter<"Comment"> | Date | string
    user_id?: IntNullableFilter<"Comment"> | number | null
    parent_id?: IntNullableFilter<"Comment"> | number | null
  }

  export type PostUpsertWithoutCommentInput = {
    update: XOR<PostUpdateWithoutCommentInput, PostUncheckedUpdateWithoutCommentInput>
    create: XOR<PostCreateWithoutCommentInput, PostUncheckedCreateWithoutCommentInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutCommentInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutCommentInput, PostUncheckedUpdateWithoutCommentInput>
  }

  export type PostUpdateWithoutCommentInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Author?: UserUpdateOneWithoutPostsNestedInput
    BlockedBy?: UserUpdateOneWithoutBlockedPostsNestedInput
    Category?: CategoryUpdateOneWithoutPostNestedInput
    Series?: SeriesUpdateOneWithoutPostNestedInput
    PostLike?: PostLikeUpdateManyWithoutPostNestedInput
    Tag?: TagUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutCommentInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    PostLike?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
    Tag?: TagUncheckedUpdateManyWithoutPostNestedInput
  }

  export type UserUpsertWithoutCommentInput = {
    update: XOR<UserUpdateWithoutCommentInput, UserUncheckedUpdateWithoutCommentInput>
    create: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentInput, UserUncheckedUpdateWithoutCommentInput>
  }

  export type UserUpdateWithoutCommentInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Notification?: NotificationUpdateManyWithoutRecipientNestedInput
    Posts?: PostUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Notification?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput
    Posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUncheckedUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CommentCreateWithoutPostInput = {
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    Parent?: CommentCreateNestedOneWithoutRepliesInput
    Replies?: CommentCreateNestedManyWithoutParentInput
    User?: UserCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateWithoutPostInput = {
    id?: number
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    user_id?: number | null
    parent_id?: number | null
    Replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentCreateOrConnectWithoutPostInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput>
  }

  export type CommentCreateManyPostInputEnvelope = {
    data: CommentCreateManyPostInput | CommentCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutPostsInput = {
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutRecipientInput
    BlockedPosts?: PostCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPostsInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutRecipientInput
    BlockedPosts?: PostUncheckedCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
  }

  export type UserCreateWithoutBlockedPostsInput = {
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutRecipientInput
    Posts?: PostCreateNestedManyWithoutAuthorInput
    SentNotification?: NotificationCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBlockedPostsInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutRecipientInput
    Posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    SentNotification?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBlockedPostsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBlockedPostsInput, UserUncheckedCreateWithoutBlockedPostsInput>
  }

  export type CategoryCreateWithoutPostInput = {
    name: string
    slug?: string
    created_at?: Date | string
  }

  export type CategoryUncheckedCreateWithoutPostInput = {
    id?: number
    name: string
    slug?: string
    created_at?: Date | string
  }

  export type CategoryCreateOrConnectWithoutPostInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutPostInput, CategoryUncheckedCreateWithoutPostInput>
  }

  export type SeriesCreateWithoutPostInput = {
    name: string
    slug: string
    description?: string | null
    created_at?: Date | string
  }

  export type SeriesUncheckedCreateWithoutPostInput = {
    id?: number
    name: string
    slug: string
    description?: string | null
    created_at?: Date | string
  }

  export type SeriesCreateOrConnectWithoutPostInput = {
    where: SeriesWhereUniqueInput
    create: XOR<SeriesCreateWithoutPostInput, SeriesUncheckedCreateWithoutPostInput>
  }

  export type PostLikeCreateWithoutPostInput = {
    created_at?: Date | string
    User: UserCreateNestedOneWithoutPostLikeInput
  }

  export type PostLikeUncheckedCreateWithoutPostInput = {
    id?: number
    user_id: number
    created_at?: Date | string
  }

  export type PostLikeCreateOrConnectWithoutPostInput = {
    where: PostLikeWhereUniqueInput
    create: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput>
  }

  export type PostLikeCreateManyPostInputEnvelope = {
    data: PostLikeCreateManyPostInput | PostLikeCreateManyPostInput[]
    skipDuplicates?: boolean
  }

  export type TagCreateWithoutPostInput = {
    name: string
    created_at?: Date | string
  }

  export type TagUncheckedCreateWithoutPostInput = {
    id?: number
    name: string
    created_at?: Date | string
  }

  export type TagCreateOrConnectWithoutPostInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutPostInput, TagUncheckedCreateWithoutPostInput>
  }

  export type CommentUpsertWithWhereUniqueWithoutPostInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutPostInput, CommentUncheckedUpdateWithoutPostInput>
    create: XOR<CommentCreateWithoutPostInput, CommentUncheckedCreateWithoutPostInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutPostInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutPostInput, CommentUncheckedUpdateWithoutPostInput>
  }

  export type CommentUpdateManyWithWhereWithoutPostInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutPostInput>
  }

  export type UserUpsertWithoutPostsInput = {
    update: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
    create: XOR<UserCreateWithoutPostsInput, UserUncheckedCreateWithoutPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostsInput, UserUncheckedUpdateWithoutPostsInput>
  }

  export type UserUpdateWithoutPostsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutRecipientNestedInput
    BlockedPosts?: PostUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPostsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput
    BlockedPosts?: PostUncheckedUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutBlockedPostsInput = {
    update: XOR<UserUpdateWithoutBlockedPostsInput, UserUncheckedUpdateWithoutBlockedPostsInput>
    create: XOR<UserCreateWithoutBlockedPostsInput, UserUncheckedCreateWithoutBlockedPostsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBlockedPostsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBlockedPostsInput, UserUncheckedUpdateWithoutBlockedPostsInput>
  }

  export type UserUpdateWithoutBlockedPostsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutRecipientNestedInput
    Posts?: PostUpdateManyWithoutAuthorNestedInput
    SentNotification?: NotificationUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBlockedPostsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput
    Posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    SentNotification?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CategoryUpsertWithoutPostInput = {
    update: XOR<CategoryUpdateWithoutPostInput, CategoryUncheckedUpdateWithoutPostInput>
    create: XOR<CategoryCreateWithoutPostInput, CategoryUncheckedCreateWithoutPostInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutPostInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutPostInput, CategoryUncheckedUpdateWithoutPostInput>
  }

  export type CategoryUpdateWithoutPostInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesUpsertWithoutPostInput = {
    update: XOR<SeriesUpdateWithoutPostInput, SeriesUncheckedUpdateWithoutPostInput>
    create: XOR<SeriesCreateWithoutPostInput, SeriesUncheckedCreateWithoutPostInput>
    where?: SeriesWhereInput
  }

  export type SeriesUpdateToOneWithWhereWithoutPostInput = {
    where?: SeriesWhereInput
    data: XOR<SeriesUpdateWithoutPostInput, SeriesUncheckedUpdateWithoutPostInput>
  }

  export type SeriesUpdateWithoutPostInput = {
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SeriesUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUpsertWithWhereUniqueWithoutPostInput = {
    where: PostLikeWhereUniqueInput
    update: XOR<PostLikeUpdateWithoutPostInput, PostLikeUncheckedUpdateWithoutPostInput>
    create: XOR<PostLikeCreateWithoutPostInput, PostLikeUncheckedCreateWithoutPostInput>
  }

  export type PostLikeUpdateWithWhereUniqueWithoutPostInput = {
    where: PostLikeWhereUniqueInput
    data: XOR<PostLikeUpdateWithoutPostInput, PostLikeUncheckedUpdateWithoutPostInput>
  }

  export type PostLikeUpdateManyWithWhereWithoutPostInput = {
    where: PostLikeScalarWhereInput
    data: XOR<PostLikeUpdateManyMutationInput, PostLikeUncheckedUpdateManyWithoutPostInput>
  }

  export type PostLikeScalarWhereInput = {
    AND?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
    OR?: PostLikeScalarWhereInput[]
    NOT?: PostLikeScalarWhereInput | PostLikeScalarWhereInput[]
    id?: IntFilter<"PostLike"> | number
    post_id?: IntFilter<"PostLike"> | number
    user_id?: IntFilter<"PostLike"> | number
    created_at?: DateTimeFilter<"PostLike"> | Date | string
  }

  export type TagUpsertWithWhereUniqueWithoutPostInput = {
    where: TagWhereUniqueInput
    update: XOR<TagUpdateWithoutPostInput, TagUncheckedUpdateWithoutPostInput>
    create: XOR<TagCreateWithoutPostInput, TagUncheckedCreateWithoutPostInput>
  }

  export type TagUpdateWithWhereUniqueWithoutPostInput = {
    where: TagWhereUniqueInput
    data: XOR<TagUpdateWithoutPostInput, TagUncheckedUpdateWithoutPostInput>
  }

  export type TagUpdateManyWithWhereWithoutPostInput = {
    where: TagScalarWhereInput
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyWithoutPostInput>
  }

  export type TagScalarWhereInput = {
    AND?: TagScalarWhereInput | TagScalarWhereInput[]
    OR?: TagScalarWhereInput[]
    NOT?: TagScalarWhereInput | TagScalarWhereInput[]
    id?: IntFilter<"Tag"> | number
    name?: StringFilter<"Tag"> | string
    created_at?: DateTimeFilter<"Tag"> | Date | string
  }

  export type PostCreateWithoutPostLikeInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentCreateNestedManyWithoutPostInput
    Author?: UserCreateNestedOneWithoutPostsInput
    BlockedBy?: UserCreateNestedOneWithoutBlockedPostsInput
    Category?: CategoryCreateNestedOneWithoutPostInput
    Series?: SeriesCreateNestedOneWithoutPostInput
    Tag?: TagCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutPostLikeInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutPostInput
    Tag?: TagUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutPostLikeInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutPostLikeInput, PostUncheckedCreateWithoutPostLikeInput>
  }

  export type UserCreateWithoutPostLikeInput = {
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutRecipientInput
    Posts?: PostCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationCreateNestedManyWithoutSenderInput
  }

  export type UserUncheckedCreateWithoutPostLikeInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutRecipientInput
    Posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostUncheckedCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationUncheckedCreateNestedManyWithoutSenderInput
  }

  export type UserCreateOrConnectWithoutPostLikeInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPostLikeInput, UserUncheckedCreateWithoutPostLikeInput>
  }

  export type PostUpsertWithoutPostLikeInput = {
    update: XOR<PostUpdateWithoutPostLikeInput, PostUncheckedUpdateWithoutPostLikeInput>
    create: XOR<PostCreateWithoutPostLikeInput, PostUncheckedCreateWithoutPostLikeInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutPostLikeInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutPostLikeInput, PostUncheckedUpdateWithoutPostLikeInput>
  }

  export type PostUpdateWithoutPostLikeInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUpdateManyWithoutPostNestedInput
    Author?: UserUpdateOneWithoutPostsNestedInput
    BlockedBy?: UserUpdateOneWithoutBlockedPostsNestedInput
    Category?: CategoryUpdateOneWithoutPostNestedInput
    Series?: SeriesUpdateOneWithoutPostNestedInput
    Tag?: TagUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutPostLikeInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutPostNestedInput
    Tag?: TagUncheckedUpdateManyWithoutPostNestedInput
  }

  export type UserUpsertWithoutPostLikeInput = {
    update: XOR<UserUpdateWithoutPostLikeInput, UserUncheckedUpdateWithoutPostLikeInput>
    create: XOR<UserCreateWithoutPostLikeInput, UserUncheckedCreateWithoutPostLikeInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPostLikeInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPostLikeInput, UserUncheckedUpdateWithoutPostLikeInput>
  }

  export type UserUpdateWithoutPostLikeInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutRecipientNestedInput
    Posts?: PostUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUpdateManyWithoutSenderNestedInput
  }

  export type UserUncheckedUpdateWithoutPostLikeInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput
    Posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUncheckedUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
  }

  export type PostCreateWithoutTagInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentCreateNestedManyWithoutPostInput
    Author?: UserCreateNestedOneWithoutPostsInput
    BlockedBy?: UserCreateNestedOneWithoutBlockedPostsInput
    Category?: CategoryCreateNestedOneWithoutPostInput
    Series?: SeriesCreateNestedOneWithoutPostInput
    PostLike?: PostLikeCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutTagInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutPostInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutTagInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutTagInput, PostUncheckedCreateWithoutTagInput>
  }

  export type PostUpsertWithWhereUniqueWithoutTagInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutTagInput, PostUncheckedUpdateWithoutTagInput>
    create: XOR<PostCreateWithoutTagInput, PostUncheckedCreateWithoutTagInput>
  }

  export type PostUpdateWithWhereUniqueWithoutTagInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutTagInput, PostUncheckedUpdateWithoutTagInput>
  }

  export type PostUpdateManyWithWhereWithoutTagInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutTagInput>
  }

  export type CommentCreateWithoutUserInput = {
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    Parent?: CommentCreateNestedOneWithoutRepliesInput
    Replies?: CommentCreateNestedManyWithoutParentInput
    Post?: PostCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateWithoutUserInput = {
    id?: number
    post_id?: number | null
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    parent_id?: number | null
    Replies?: CommentUncheckedCreateNestedManyWithoutParentInput
  }

  export type CommentCreateOrConnectWithoutUserInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentCreateManyUserInputEnvelope = {
    data: CommentCreateManyUserInput | CommentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutRecipientInput = {
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
    Sender?: UserCreateNestedOneWithoutSentNotificationInput
  }

  export type NotificationUncheckedCreateWithoutRecipientInput = {
    id?: number
    sender_id?: number | null
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationCreateOrConnectWithoutRecipientInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutRecipientInput, NotificationUncheckedCreateWithoutRecipientInput>
  }

  export type NotificationCreateManyRecipientInputEnvelope = {
    data: NotificationCreateManyRecipientInput | NotificationCreateManyRecipientInput[]
    skipDuplicates?: boolean
  }

  export type PostCreateWithoutAuthorInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentCreateNestedManyWithoutPostInput
    BlockedBy?: UserCreateNestedOneWithoutBlockedPostsInput
    Category?: CategoryCreateNestedOneWithoutPostInput
    Series?: SeriesCreateNestedOneWithoutPostInput
    PostLike?: PostLikeCreateNestedManyWithoutPostInput
    Tag?: TagCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutAuthorInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutPostInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutPostInput
    Tag?: TagUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutAuthorInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostCreateManyAuthorInputEnvelope = {
    data: PostCreateManyAuthorInput | PostCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type PostCreateWithoutBlockedByInput = {
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentCreateNestedManyWithoutPostInput
    Author?: UserCreateNestedOneWithoutPostsInput
    Category?: CategoryCreateNestedOneWithoutPostInput
    Series?: SeriesCreateNestedOneWithoutPostInput
    PostLike?: PostLikeCreateNestedManyWithoutPostInput
    Tag?: TagCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateWithoutBlockedByInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_reason?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutPostInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutPostInput
    Tag?: TagUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostCreateOrConnectWithoutBlockedByInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutBlockedByInput, PostUncheckedCreateWithoutBlockedByInput>
  }

  export type PostCreateManyBlockedByInputEnvelope = {
    data: PostCreateManyBlockedByInput | PostCreateManyBlockedByInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutSenderInput = {
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
    Recipient: UserCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateWithoutSenderInput = {
    id?: number
    recipient_id: number
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
  }

  export type NotificationCreateOrConnectWithoutSenderInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput>
  }

  export type NotificationCreateManySenderInputEnvelope = {
    data: NotificationCreateManySenderInput | NotificationCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type PostLikeCreateWithoutUserInput = {
    created_at?: Date | string
    Post: PostCreateNestedOneWithoutPostLikeInput
  }

  export type PostLikeUncheckedCreateWithoutUserInput = {
    id?: number
    post_id: number
    created_at?: Date | string
  }

  export type PostLikeCreateOrConnectWithoutUserInput = {
    where: PostLikeWhereUniqueInput
    create: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput>
  }

  export type PostLikeCreateManyUserInputEnvelope = {
    data: PostLikeCreateManyUserInput | PostLikeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
    create: XOR<CommentCreateWithoutUserInput, CommentUncheckedCreateWithoutUserInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutUserInput, CommentUncheckedUpdateWithoutUserInput>
  }

  export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutRecipientInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutRecipientInput, NotificationUncheckedUpdateWithoutRecipientInput>
    create: XOR<NotificationCreateWithoutRecipientInput, NotificationUncheckedCreateWithoutRecipientInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutRecipientInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutRecipientInput, NotificationUncheckedUpdateWithoutRecipientInput>
  }

  export type NotificationUpdateManyWithWhereWithoutRecipientInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutRecipientInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: IntFilter<"Notification"> | number
    recipient_id?: IntFilter<"Notification"> | number
    sender_id?: IntNullableFilter<"Notification"> | number | null
    type?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    link?: StringNullableFilter<"Notification"> | string | null
    is_read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
  }

  export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
    create: XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
  }

  export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutAuthorInput, PostUncheckedUpdateWithoutAuthorInput>
  }

  export type PostUpdateManyWithWhereWithoutAuthorInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutAuthorInput>
  }

  export type PostUpsertWithWhereUniqueWithoutBlockedByInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutBlockedByInput, PostUncheckedUpdateWithoutBlockedByInput>
    create: XOR<PostCreateWithoutBlockedByInput, PostUncheckedCreateWithoutBlockedByInput>
  }

  export type PostUpdateWithWhereUniqueWithoutBlockedByInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutBlockedByInput, PostUncheckedUpdateWithoutBlockedByInput>
  }

  export type PostUpdateManyWithWhereWithoutBlockedByInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutBlockedByInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutSenderInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutSenderInput, NotificationUncheckedUpdateWithoutSenderInput>
    create: XOR<NotificationCreateWithoutSenderInput, NotificationUncheckedCreateWithoutSenderInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutSenderInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutSenderInput, NotificationUncheckedUpdateWithoutSenderInput>
  }

  export type NotificationUpdateManyWithWhereWithoutSenderInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutSenderInput>
  }

  export type PostLikeUpsertWithWhereUniqueWithoutUserInput = {
    where: PostLikeWhereUniqueInput
    update: XOR<PostLikeUpdateWithoutUserInput, PostLikeUncheckedUpdateWithoutUserInput>
    create: XOR<PostLikeCreateWithoutUserInput, PostLikeUncheckedCreateWithoutUserInput>
  }

  export type PostLikeUpdateWithWhereUniqueWithoutUserInput = {
    where: PostLikeWhereUniqueInput
    data: XOR<PostLikeUpdateWithoutUserInput, PostLikeUncheckedUpdateWithoutUserInput>
  }

  export type PostLikeUpdateManyWithWhereWithoutUserInput = {
    where: PostLikeScalarWhereInput
    data: XOR<PostLikeUpdateManyMutationInput, PostLikeUncheckedUpdateManyWithoutUserInput>
  }

  export type UserCreateWithoutNotificationInput = {
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentCreateNestedManyWithoutUserInput
    Posts?: PostCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostUncheckedCreateNestedManyWithoutBlockedByInput
    SentNotification?: NotificationUncheckedCreateNestedManyWithoutSenderInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
  }

  export type UserCreateWithoutSentNotificationInput = {
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentCreateNestedManyWithoutUserInput
    Notification?: NotificationCreateNestedManyWithoutRecipientInput
    Posts?: PostCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostCreateNestedManyWithoutBlockedByInput
    PostLike?: PostLikeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSentNotificationInput = {
    id?: number
    username: string
    email?: string | null
    fullname?: string | null
    avatar?: string | null
    profession?: string | null
    password: string
    role?: string | null
    phone?: string | null
    birthday?: string | null
    address?: string | null
    google_id?: string | null
    facebook_id?: string | null
    apple_id?: string | null
    reset_token?: string | null
    reset_token_expiry?: Date | string | null
    is_active?: boolean
    created_at?: Date | string
    can_comment?: boolean
    can_post?: boolean
    Comment?: CommentUncheckedCreateNestedManyWithoutUserInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutRecipientInput
    Posts?: PostUncheckedCreateNestedManyWithoutAuthorInput
    BlockedPosts?: PostUncheckedCreateNestedManyWithoutBlockedByInput
    PostLike?: PostLikeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSentNotificationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentNotificationInput, UserUncheckedCreateWithoutSentNotificationInput>
  }

  export type UserUpsertWithoutNotificationInput = {
    update: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type UserUpdateWithoutNotificationInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Posts?: PostUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUncheckedUpdateManyWithoutBlockedByNestedInput
    SentNotification?: NotificationUncheckedUpdateManyWithoutSenderNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutSentNotificationInput = {
    update: XOR<UserUpdateWithoutSentNotificationInput, UserUncheckedUpdateWithoutSentNotificationInput>
    create: XOR<UserCreateWithoutSentNotificationInput, UserUncheckedCreateWithoutSentNotificationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentNotificationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentNotificationInput, UserUncheckedUpdateWithoutSentNotificationInput>
  }

  export type UserUpdateWithoutSentNotificationInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUpdateManyWithoutUserNestedInput
    Notification?: NotificationUpdateManyWithoutRecipientNestedInput
    Posts?: PostUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUpdateManyWithoutBlockedByNestedInput
    PostLike?: PostLikeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSentNotificationInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    profession?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    birthday?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    google_id?: NullableStringFieldUpdateOperationsInput | string | null
    facebook_id?: NullableStringFieldUpdateOperationsInput | string | null
    apple_id?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token?: NullableStringFieldUpdateOperationsInput | string | null
    reset_token_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    can_comment?: BoolFieldUpdateOperationsInput | boolean
    can_post?: BoolFieldUpdateOperationsInput | boolean
    Comment?: CommentUncheckedUpdateManyWithoutUserNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput
    Posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput
    BlockedPosts?: PostUncheckedUpdateManyWithoutBlockedByNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PostCreateManyCategoryInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
  }

  export type PostUpdateWithoutCategoryInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUpdateManyWithoutPostNestedInput
    Author?: UserUpdateOneWithoutPostsNestedInput
    BlockedBy?: UserUpdateOneWithoutBlockedPostsNestedInput
    Series?: SeriesUpdateOneWithoutPostNestedInput
    PostLike?: PostLikeUpdateManyWithoutPostNestedInput
    Tag?: TagUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutPostNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
    Tag?: TagUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutCategoryInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostCreateManySeriesInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
  }

  export type PostUpdateWithoutSeriesInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUpdateManyWithoutPostNestedInput
    Author?: UserUpdateOneWithoutPostsNestedInput
    BlockedBy?: UserUpdateOneWithoutBlockedPostsNestedInput
    Category?: CategoryUpdateOneWithoutPostNestedInput
    PostLike?: PostLikeUpdateManyWithoutPostNestedInput
    Tag?: TagUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutSeriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutPostNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
    Tag?: TagUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutSeriesInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyParentInput = {
    id?: number
    post_id?: number | null
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    user_id?: number | null
  }

  export type CommentUpdateWithoutParentInput = {
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Replies?: CommentUpdateManyWithoutParentNestedInput
    Post?: PostUpdateOneWithoutCommentNestedInput
    User?: UserUpdateOneWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    Replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateManyWithoutParentInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CommentCreateManyPostInput = {
    id?: number
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    user_id?: number | null
    parent_id?: number | null
  }

  export type PostLikeCreateManyPostInput = {
    id?: number
    user_id: number
    created_at?: Date | string
  }

  export type CommentUpdateWithoutPostInput = {
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Parent?: CommentUpdateOneWithoutRepliesNestedInput
    Replies?: CommentUpdateManyWithoutParentNestedInput
    User?: UserUpdateOneWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    Replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateManyWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: NullableIntFieldUpdateOperationsInput | number | null
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PostLikeUpdateWithoutPostInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    User?: UserUpdateOneRequiredWithoutPostLikeNestedInput
  }

  export type PostLikeUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUncheckedUpdateManyWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    user_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUpdateWithoutPostInput = {
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TagUncheckedUpdateManyWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpdateWithoutTagInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUpdateManyWithoutPostNestedInput
    Author?: UserUpdateOneWithoutPostsNestedInput
    BlockedBy?: UserUpdateOneWithoutBlockedPostsNestedInput
    Category?: CategoryUpdateOneWithoutPostNestedInput
    Series?: SeriesUpdateOneWithoutPostNestedInput
    PostLike?: PostLikeUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutTagInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutPostNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutTagInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyUserInput = {
    id?: number
    post_id?: number | null
    author_name?: string | null
    author_email?: string | null
    content?: string | null
    created_at?: Date | string
    parent_id?: number | null
  }

  export type NotificationCreateManyRecipientInput = {
    id?: number
    sender_id?: number | null
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
  }

  export type PostCreateManyAuthorInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    is_blocked?: boolean
    blocked_by_id?: number | null
    blocked_reason?: string | null
  }

  export type PostCreateManyBlockedByInput = {
    id?: number
    title: string
    slug?: string
    content?: string | null
    series_id?: number | null
    series_order?: number | null
    cover_image?: string | null
    is_pinned?: boolean
    is_published?: boolean
    views?: number
    likes?: number
    created_at?: Date | string
    updated_at?: Date | string
    category_id?: number | null
    author_id?: number | null
    is_blocked?: boolean
    blocked_reason?: string | null
  }

  export type NotificationCreateManySenderInput = {
    id?: number
    recipient_id: number
    type: string
    title: string
    content: string
    link?: string | null
    is_read?: boolean
    created_at?: Date | string
  }

  export type PostLikeCreateManyUserInput = {
    id?: number
    post_id: number
    created_at?: Date | string
  }

  export type CommentUpdateWithoutUserInput = {
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Parent?: CommentUpdateOneWithoutRepliesNestedInput
    Replies?: CommentUpdateManyWithoutParentNestedInput
    Post?: PostUpdateOneWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
    Replies?: CommentUncheckedUpdateManyWithoutParentNestedInput
  }

  export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_email?: NullableStringFieldUpdateOperationsInput | string | null
    content?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    parent_id?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type NotificationUpdateWithoutRecipientInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Sender?: UserUpdateOneWithoutSentNotificationNestedInput
  }

  export type NotificationUncheckedUpdateWithoutRecipientInput = {
    id?: IntFieldUpdateOperationsInput | number
    sender_id?: NullableIntFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutRecipientInput = {
    id?: IntFieldUpdateOperationsInput | number
    sender_id?: NullableIntFieldUpdateOperationsInput | number | null
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUpdateWithoutAuthorInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUpdateManyWithoutPostNestedInput
    BlockedBy?: UserUpdateOneWithoutBlockedPostsNestedInput
    Category?: CategoryUpdateOneWithoutPostNestedInput
    Series?: SeriesUpdateOneWithoutPostNestedInput
    PostLike?: PostLikeUpdateManyWithoutPostNestedInput
    Tag?: TagUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutPostNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
    Tag?: TagUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutAuthorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_by_id?: NullableIntFieldUpdateOperationsInput | number | null
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PostUpdateWithoutBlockedByInput = {
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUpdateManyWithoutPostNestedInput
    Author?: UserUpdateOneWithoutPostsNestedInput
    Category?: CategoryUpdateOneWithoutPostNestedInput
    Series?: SeriesUpdateOneWithoutPostNestedInput
    PostLike?: PostLikeUpdateManyWithoutPostNestedInput
    Tag?: TagUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateWithoutBlockedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutPostNestedInput
    PostLike?: PostLikeUncheckedUpdateManyWithoutPostNestedInput
    Tag?: TagUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateManyWithoutBlockedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    series_id?: NullableIntFieldUpdateOperationsInput | number | null
    series_order?: NullableIntFieldUpdateOperationsInput | number | null
    cover_image?: NullableStringFieldUpdateOperationsInput | string | null
    is_pinned?: BoolFieldUpdateOperationsInput | boolean
    is_published?: BoolFieldUpdateOperationsInput | boolean
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    category_id?: NullableIntFieldUpdateOperationsInput | number | null
    author_id?: NullableIntFieldUpdateOperationsInput | number | null
    is_blocked?: BoolFieldUpdateOperationsInput | boolean
    blocked_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationUpdateWithoutSenderInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Recipient?: UserUpdateOneRequiredWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateWithoutSenderInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipient_id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutSenderInput = {
    id?: IntFieldUpdateOperationsInput | number
    recipient_id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    link?: NullableStringFieldUpdateOperationsInput | string | null
    is_read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUpdateWithoutUserInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Post?: PostUpdateOneRequiredWithoutPostLikeNestedInput
  }

  export type PostLikeUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostLikeUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    post_id?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
