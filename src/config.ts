interface Config {
  /**
   * Allowed URL origins for QR codes that are recognized by the scanner
   */
  allowedCodeOrigins: string[];
}

const config: Config = {
  allowedCodeOrigins: [window.location.origin],
};

export default config;
