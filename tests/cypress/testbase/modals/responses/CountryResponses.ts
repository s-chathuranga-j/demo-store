export namespace CountryResponses {
  export interface Currency {
    code?: string;
    name: string;
    symbol: string;
  }

  export interface Language {
    iso639_1?: string;
    iso639_2?: string;
    name: string;
    nativeName?: string;
  }

  export interface NativeName {
    official: string;
    common: string;
  }

  export interface CountryName {
    common: string;
    official?: string;
    nativeName?: Record<string, NativeName>;
  }

  export interface Idd {
    root: string;
    suffixes: string[];
  }

  export interface Demonym {
    f: string;
    m: string;
  }

  export interface Translation {
    official: string;
    common: string;
  }

  export interface Maps {
    googleMaps: string;
    openStreetMaps: string;
  }

  export interface Car {
    signs: string[];
    side: string;
  }

  export interface Flags {
    png: string;
    svg: string;
    alt?: string;
  }

  export interface CoatOfArms {
    png: string;
    svg: string;
  }

  export interface CapitalInfo {
    latlng: number[];
  }

  export interface PostalCode {
    format: string | null;
    regex: string | null;
  }

  export interface Gini {
    [year: string]: number;
  }

  /**
   * Country interface for the getAllCountries endpoint
   */
  export interface Country {
    name: CountryName;
    tld?: string[];
    cca2?: string;
    ccn3?: string;
    cca3?: string;
    cioc?: string;
    independent?: boolean;
    status?: string;
    unMember?: boolean;
    capital: string | string[];
    altSpellings?: string[];
    region?: string;
    subregion?: string;
    languages: Language[] | Record<string, string>;
    latlng?: number[];
    landlocked?: boolean;
    borders?: string[];
    area?: number;
    demonyms?: Record<string, Demonym>;
    flag?: string;
    maps?: Maps;
    population: number;
    gini?: Gini;
    fifa?: string;
    car?: Car;
    timezones: string[];
    continents?: string[];
    flags?: Flags;
    coatOfArms?: CoatOfArms;
    startOfWeek?: string;
    capitalInfo?: CapitalInfo;
    postalCode?: PostalCode;
    currencies: Currency[] | Record<string, Currency>;
    idd?: Idd;
    translations?: Record<string, Translation>;
  }

  export type GetAllCountriesResponse = Country[];
}
