import { apiEndpoints } from '../../testbase/apiEndpoints';
import { HttpMethod, StatusCodes } from '../../support/Enums';
import { CountryResponses } from '../../testbase/modals/responses/CountryResponses';

describe('Country Information API Test Suite', () => {
  it('Get all independent countries', { tags: ['@get-countries', '@smoke'] }, () => {
    cy.sendApiRequestDef(apiEndpoints.getAllCountries, HttpMethod.GET, 'null', StatusCodes.OK).then(
      response => {
        expect(response).to.be.an('array');
        expect(response).to.have.length.greaterThan(0);
        const country = response[0] as CountryResponses.Country;
        expect(country).to.have.property('name');
        expect(country).to.have.property('capital');
        expect(country).to.have.property('population');
        expect(country).to.have.property('languages');
        expect(country).to.have.property('currencies');
        expect(country).to.have.property('timezones').that.is.an('array');

        if (Array.isArray(country.currencies) && country.currencies.length > 0) {
          const currency = country.currencies[0] as CountryResponses.Currency;
          expect(currency).to.have.property('name');
          expect(currency).to.have.property('symbol');
        } else if (typeof country.currencies === 'object') {
          const currencyCode = Object.keys(country.currencies)[0];
          const currency = country.currencies[currencyCode];
          expect(currency).to.have.property('name');
          expect(currency).to.have.property('symbol');
        }

        if (Array.isArray(country.languages) && country.languages.length > 0) {
          const language = country.languages[0] as CountryResponses.Language;
          expect(language).to.have.property('name');
        } else if (typeof country.languages === 'object') {
          const languageCode = Object.keys(country.languages)[0];
          expect(country.languages[languageCode]).to.be.a('string');
        }
      }
    );
  });

  it('Get country by name', { tags: ['@get-countries', '@smoke'] }, () => {
    const countryName = 'Sri Lanka';
    cy.sendApiRequest(
      apiEndpoints.getCountryByName(countryName),
      HttpMethod.GET,
      'null',
      StatusCodes.OK
    ).then(response => {
      const country = response[0] as CountryResponses.Country;
      expect(country).to.have.property('name');
      expect(country.name.common).to.eq(countryName);
      expect(country.name.common).to.eq(countryName);
    });
  });

  it('Get countries by language', { tags: ['@get-countries', '@smoke'] }, () => {
    const language = 'eng';
    cy.sendApiRequest(
      apiEndpoints.getCountryByLanguage(language),
      HttpMethod.GET,
      'null',
      StatusCodes.OK
    ).then(response => {
      expect(response).to.be.an('array');
      const country = response[0] as CountryResponses.Country;
      expect(country).to.have.property('name');
      expect(country).to.have.property('languages');

      if (Array.isArray(country.languages)) {
        const hasLanguage = country.languages.some(
          (lang: CountryResponses.Language) =>
            lang.iso639_1 === language || lang.iso639_2 === language
        );
        expect(hasLanguage).to.be.true;
      } else {
        expect(country.languages).to.have.property(language);
      }
    });
  });
});
