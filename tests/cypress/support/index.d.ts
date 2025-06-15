namespace Cypress {
  interface Chainable {
    sendApiRequest(
      endpoint: string,
      method: string,
      token: string,
      expectedStatus: number,
      body?: any
    ): Chainable<object>;

    /**
     * Custom command to send an API request using default cypress request
     * @param endpoint
     * @param method
     * @param token
     * @param expectedStatus
     * @param body
     * @returns {Chainable<object>}
     * @example
     * cy.sendApiRequest(apiEndpoints.accountMe, HttpMethod.GET, token, 200);
     */
    sendApiRequestDef(
      endpoint: string,
      method: string,
      token: string,
      expectedStatus: number | number[],
      body?: any
    ): Chainable<object>;
    sendApiRequestWithAttachment(
      endpoint: string,
      method: string,
      token: string,
      expectedStatus: number,
      resourceId: string,
      filePath: string
    ): Chainable<object>;
    getAccessToken(): Chainable<string>;
    fetchSwaggerSchema(): Chainable<object>;
    valueIsNotNull(): void;
    valueIsNull(): void;
    recurse: typeof recurse;
    sendApiRequestWithParams(
      endpoint: string,
      method: string,
      token: string,
      expectedStatus: number,
      params: Record<string, any>,
      body?: any
    ): Chainable<object>;
    sendApiRequestDefWithParams(
      endpoint: string,
      method: string,
      token: string,
      expectedStatus: number,
      params: Record<string, any>,
      body?: any
    ): Chainable<object>;
    slowDownType(text: string): void;
    recursiveType(text: string): void;
    seeOption(options: string[]): void;
    getCypressEnvVariable(key: string): Chainable<string>;
  }
}
