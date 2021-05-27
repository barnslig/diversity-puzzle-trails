import { IntlProvider } from "react-intl";
import { render } from "@testing-library/react";
import * as React from "react";

/**
 * Render a React component within a react-intl IntlProvider using @testing-library/react
 */
const renderWithIntl = (children: React.ReactNode) =>
  render(
    <IntlProvider locale="de" defaultLocale="de">
      {children}
    </IntlProvider>
  );

export default renderWithIntl;
