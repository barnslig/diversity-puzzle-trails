import { createGenerateClassName } from "@material-ui/core";
import { IntlProvider, ReactIntlErrorCode } from "react-intl";
import { OnErrorFn } from "@formatjs/intl";
import { render, RenderOptions } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import { StylesProvider } from "@material-ui/styles";
import { SWRConfig } from "swr";
import * as React from "react";

// https://github.com/formatjs/formatjs/issues/1776#issuecomment-653930959
const onError: OnErrorFn = (e) => {
  if (e.code === ReactIntlErrorCode.MISSING_DATA) {
    return;
  }
  console.error(e);
};

type TestWrapperProps = {
  children?: React.ReactNode;
};

export const TestWrapper = ({ children }: TestWrapperProps) => {
  /* Create a new class name generator on every render. This is required
   * to get deterministic classnames so jest snapshots work reliably. See:
   * - https://github.com/mui-org/material-ui/issues/9492
   * - https://material-ui.com/styles/advanced/#class-names
   * - https://material-ui.com/getting-started/faq/#react-class-name-hydration-mismatch
   */
  const generateClassName = createGenerateClassName();

  return (
    <StylesProvider generateClassName={generateClassName}>
      <IntlProvider locale="de" defaultLocale="de" onError={onError}>
        <SnackbarProvider>
          {/* Disable SWR deduping for isolated test behavior.
           * See https://github.com/vercel/swr/pull/231#issuecomment-591614747
           */}
          <SWRConfig value={{ dedupingInterval: 0, compare: (a, b) => false }}>
            {children}
          </SWRConfig>
        </SnackbarProvider>
      </IntlProvider>
    </StylesProvider>
  );
};

/**
 * Custom render function that wraps the component with providers
 *
 * @param children
 * @returns
 */
const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, {
    wrapper: TestWrapper,
    ...options,
  });

export default customRender;
