export interface Root {
  hits: Hit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  facets: Facets;
  facets_stats: FacetsStats;
  exhaustiveFacetsCount: boolean;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: Exhaustive;
  query: string;
  params: string;
  processingTimeMS: number;
  processingTimingsMS: ProcessingTimingsMs;
  serverTimeMS: number;
}

export interface Hit {
  name: string;
  meta: Meta;
  editorial_content: any[];
  structured_content: any[];
  tags: number[];
  card_data: CardData;
  objectID: string;
  _highlightResult: HighlightResult;
}

export interface Meta {
  type: string;
  id: number;
  site_id: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  language: string;
  url: string;
  thumbnail: any;
}

export interface CardData {
  organization_id?: number;
  address: string;
  include_in_favourite_selection: boolean;
}

export interface HighlightResult {
  name: Name;
}

export interface Name {
  value: string;
  matchLevel: string;
  matchedWords: any[];
}

export interface Facets {
  tags: Tags;
}

export interface Tags {
  "492": number;
  "502": number;
  "528": number;
  "866": number;
  "282": number;
  "284": number;
  "911": number;
  "923": number;
  "927": number;
  "510": number;
  "873": number;
  "871": number;
  "538": number;
  "504": number;
  "512": number;
  "518": number;
  "526": number;
  "506": number;
  "532": number;
  "536": number;
  "540": number;
}

export interface FacetsStats {
  tags: Tags2;
}

export interface Tags2 {
  min: number;
  max: number;
  avg: number;
  sum: number;
}

export interface Exhaustive {
  facetsCount: boolean;
  nbHits: boolean;
  typo: boolean;
}

export interface ProcessingTimingsMs {
  _request: Request;
  total: number;
}

export interface Request {
  queue: number;
  roundTrip: number;
}
