interface Config {
  /**
   * API endpoints
   */
  apiEndpoints: {
    clock: (gameId: string) => string;
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
    clock: (gameId: string) => `${process.env.API_ROOT}/games/${gameId}/clock`,
    code: (codeId: string, gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/codes/${codeId}`,
    parameters: (gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/parameters`,
  },
  allowedCodeOrigins: [window.location.origin, "https://abc-dpt.netlify.app"],
};

export default config;
