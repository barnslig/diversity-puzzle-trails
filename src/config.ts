interface Config {
  /**
   * API endpoints
   */
  apiEndpoints: {
    code: (codeId: string, gameId: string) => string;
    parameters: (gameId: string) => string;
  };

  /**
   * Allowed URL origins for QR codes that are recognized by the scanner
   */
  allowedCodeOrigins: string[];
}

const config: Config = {
  apiEndpoints: {
    code: (codeId: string, gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/codes/${codeId}`,
    parameters: (gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/parameters`,
  },
  allowedCodeOrigins: [window.location.origin],
};

export default config;
