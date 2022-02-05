interface Config {
  /**
   * API endpoints
   */
  apiEndpoints: {
    clock: (gameId: string) => string;
    code: (codeId: string, gameId: string) => string;
    game: (gameId: string) => string;
    messages: (gameId: string) => string;
    parameters: (gameId: string) => string;
    players: (gameId: string) => string;
  };

  /**
   * Allowed URL origins for QR codes that are recognized by the scanner
   */
  allowedCodeOrigins: string[];

  /**
   * Whether the messages feature is enabled
   */
  featureMessages: boolean;
}

const config: Config = {
  apiEndpoints: {
    clock: (gameId: string) => `${process.env.API_ROOT}/games/${gameId}/clock`,
    code: (codeId: string, gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/codes/${codeId}`,
    game: (gameId: string) => `${process.env.API_ROOT}/games/${gameId}`,
    messages: (gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/messages`,
    parameters: (gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/parameters`,
    players: (gameId: string) =>
      `${process.env.API_ROOT}/games/${gameId}/players`,
  },
  allowedCodeOrigins: [window.location.origin, "https://abc-dpt.netlify.app"],
  featureMessages: true,
};

export default config;
