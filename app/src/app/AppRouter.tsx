import { Redirect, Route, Router, Switch, useRouter } from "wouter";
import * as React from "react";
import ProgressBar from "@badrap/bar-of-progress";
import useLocation, { BaseLocationHook } from "wouter/use-location";

import useGameId from "../common/hooks/useGameId";
import config from "../config";

/**
 * Wrap `React.lazy()` and return the factory as well for preloading the component
 */
const lazyWithPreload = <T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) => ({
  Component: React.lazy(factory),
  factory,
});

const CodePage = lazyWithPreload(
  () => import(/* webpackChunkName: "CodePage" */ "./pages/CodePage")
);
const IndexPage = lazyWithPreload(
  () => import(/* webpackChunkName: "IndexPage" */ "./pages/IndexPage")
);
const MessagesPage = lazyWithPreload(
  () => import(/* webpackChunkName: "MessagesPage" */ "./pages/MessagesPage")
);
const ScannerPage = lazyWithPreload(
  () => import(/* webpackChunkName: "ScannerPage" */ "./pages/ScannerPage")
);
const StartPage = lazyWithPreload(
  () => import(/* webpackChunkName: "StartPage" */ "./pages/StartPage")
);

const routeFactories = [
  {
    path: "/",
    factory: IndexPage.factory,
  },
  {
    path: "/scan",
    factory: ScannerPage.factory,
  },
  {
    path: "/code/:codeId",
    factory: CodePage.factory,
  },
  {
    path: "/start/:gameId?",
    factory: StartPage.factory,
  },
  {
    path: "/messages",
    factory: MessagesPage.factory,
  },
];

/**
 * A custom wouter useLocation hook that preloads the route component before navigating
 * See https://github.com/molefrog/wouter/issues/39
 */
const useLazyLocation: BaseLocationHook = () => {
  const [location, setLocation] = useLocation();
  const { matcher } = useRouter();
  const progress = new ProgressBar();

  const lazySetLocation: typeof setLocation = async (to: string, ...args) => {
    const route = routeFactories.find(({ path }) => matcher(path, to)[0]);
    progress.start();
    await route?.factory();
    progress.finish();
    setLocation(to, ...args);
  };

  return [location, lazySetLocation];
};

/**
 * The app's router
 */
const AppRouter = () => {
  const [gameId] = useGameId();
  return (
    <Router hook={useLazyLocation}>
      <React.Suspense fallback={null}>
        <Switch>
          <Route path="/">
            {gameId ? <IndexPage.Component /> : <Redirect to="/start" />}
          </Route>
          <Route path="/scan">
            {gameId ? <ScannerPage.Component /> : <Redirect to="/start" />}
          </Route>
          <Route path="/code/:codeId">
            {gameId ? (
              ({ codeId }) => <CodePage.Component codeId={codeId} />
            ) : (
              <Redirect to="/start" />
            )}
          </Route>
          <Route path="/start/:gameId?">
            {({ gameId }) => <StartPage.Component gameId={gameId} />}
          </Route>
          {config.featureMessages ? (
            <Route path="/messages">
              {gameId ? <MessagesPage.Component /> : <Redirect to="/start" />}
            </Route>
          ) : (
            <></>
          )}
          {/* Redirect to index page on 404 */}
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </React.Suspense>
    </Router>
  );
};

export default AppRouter;
