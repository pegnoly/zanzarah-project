/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type BookModel = {
  __typename?: 'BookModel';
  available: Scalars['Boolean']['output'];
  directory: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  initialized: Scalars['Boolean']['output'];
  majorVersion: Scalars['Int']['output'];
  minorVersion: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  patchVersion: Scalars['Int']['output'];
};

export type ElementModel = {
  __typename?: 'ElementModel';
  bookId: Scalars['ID']['output'];
  element: WizformElementType;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type InsertWizformsResponse = {
  __typename?: 'InsertWizformsResponse';
  message: Scalars['String']['output'];
};

export type Magic = {
  __typename?: 'Magic';
  firstActiveSlot: MagicSlotModel;
  firstPassiveSlot: MagicSlotModel;
  level: Scalars['Int']['output'];
  secondActiveSlot: MagicSlotModel;
  secondPassiveSlot: MagicSlotModel;
};

export enum MagicElementType {
  Air = 'AIR',
  Chaos = 'CHAOS',
  Dark = 'DARK',
  Energy = 'ENERGY',
  Error = 'ERROR',
  Fire = 'FIRE',
  Ice = 'ICE',
  Joker = 'JOKER',
  Light = 'LIGHT',
  Metall = 'METALL',
  Nature = 'NATURE',
  None = 'NONE',
  Psi = 'PSI',
  Stone = 'STONE',
  Water = 'WATER'
}

export type MagicInputModel = {
  firstActiveSlot: MagicSlotInputModel;
  firstPassiveSlot: MagicSlotInputModel;
  level: Scalars['Int']['input'];
  secondActiveSlot: MagicSlotInputModel;
  secondPassiveSlot: MagicSlotInputModel;
};

export type MagicSlotInputModel = {
  firstElement: MagicElementType;
  secondElement: MagicElementType;
  thirdElement: MagicElementType;
};

export type MagicSlotModel = {
  __typename?: 'MagicSlotModel';
  firstElement: MagicElementType;
  secondElement: MagicElementType;
  thirdElement: MagicElementType;
};

export type Magics = {
  __typename?: 'Magics';
  types: Array<Magic>;
};

export type MagicsInputModel = {
  types: Array<MagicInputModel>;
};

export type Mutation = {
  __typename?: 'Mutation';
  insertWizformsBulk: InsertWizformsResponse;
};


export type MutationInsertWizformsBulkArgs = {
  wizforms: Array<WizformInputModel>;
};

export type Query = {
  __typename?: 'Query';
  books: Array<BookModel>;
  elements: Array<ElementModel>;
  wizform?: Maybe<WizformModel>;
  wizforms: Array<WizformModel>;
};


export type QueryBooksArgs = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryElementsArgs = {
  bookId: Scalars['ID']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryWizformArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWizformsArgs = {
  bookId: Scalars['ID']['input'];
  elementFilter?: InputMaybe<WizformElementType>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  nameFilter?: InputMaybe<Scalars['String']['input']>;
};

export enum WizformElementType {
  Air = 'AIR',
  Chaos = 'CHAOS',
  Custom_1 = 'CUSTOM_1',
  Custom_2 = 'CUSTOM_2',
  Custom_3 = 'CUSTOM_3',
  Custom_4 = 'CUSTOM_4',
  Custom_5 = 'CUSTOM_5',
  Dark = 'DARK',
  Energy = 'ENERGY',
  Fire = 'FIRE',
  Ice = 'ICE',
  Light = 'LIGHT',
  Metall = 'METALL',
  Nature = 'NATURE',
  NeutralOne = 'NEUTRAL_ONE',
  NeutralTwo = 'NEUTRAL_TWO',
  None = 'NONE',
  Psi = 'PSI',
  Stone = 'STONE',
  Water = 'WATER'
}

export type WizformInputModel = {
  agility: Scalars['Int']['input'];
  bookId: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  element: WizformElementType;
  enabled: Scalars['Boolean']['input'];
  evolutionForm: Scalars['Int']['input'];
  evolutionLevel: Scalars['Int']['input'];
  evolutionName?: InputMaybe<Scalars['String']['input']>;
  expModifier: Scalars['Int']['input'];
  gameId: Scalars['String']['input'];
  hitpoints: Scalars['Int']['input'];
  icon64: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  jumpAbility: Scalars['Int']['input'];
  magics: MagicsInputModel;
  name: Scalars['String']['input'];
  number: Scalars['Int']['input'];
  precision: Scalars['Int']['input'];
  previousForm?: InputMaybe<Scalars['Int']['input']>;
  previousFormName?: InputMaybe<Scalars['String']['input']>;
};

export type WizformModel = {
  __typename?: 'WizformModel';
  agility: Scalars['Int']['output'];
  bookId: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  element: WizformElementType;
  enabled: Scalars['Boolean']['output'];
  evolutionForm: Scalars['Int']['output'];
  evolutionLevel: Scalars['Int']['output'];
  evolutionName?: Maybe<Scalars['String']['output']>;
  expModifier: Scalars['Int']['output'];
  gameId: Scalars['String']['output'];
  hitpoints: Scalars['Int']['output'];
  icon64: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  jumpAbility: Scalars['Int']['output'];
  magics: Magics;
  name: Scalars['String']['output'];
  number: Scalars['Int']['output'];
  precision: Scalars['Int']['output'];
  previousForm?: Maybe<Scalars['Int']['output']>;
  previousFormName?: Maybe<Scalars['String']['output']>;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
