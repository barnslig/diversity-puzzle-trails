interface Config {
  apiRoot: string;
}

const config: Config = {
  apiRoot: process.env.API_ROOT || "/",
};

export default config;
