import { IntlProvider, ReactIntlErrorCode } from "react-intl";
import { OnErrorFn } from "@formatjs/intl";
import { render } from "@testing-library/react";
import * as React from "react";

// https://github.com/formatjs/formatjs/issues/1776#issuecomment-653930959
const onError: OnErrorFn = (e) => {
  if (e.code === ReactIntlErrorCode.MISSING_DATA) {
    return;
  }
  console.error(e);
};

/**
 * Render a React component within a react-intl IntlProvider using @testing-library/react
 */
const renderWithIntl = (children: React.ReactNode) => {
  return render(
    <IntlProvider locale="de" defaultLocale="de" onError={onError}>
      {children}
    </IntlProvider>
  );
};

export default renderWithIntl;
