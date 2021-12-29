import { IntlProvider, ReactIntlErrorCode } from "react-intl";
import { OnErrorFn } from "@formatjs/intl";
import { render, RenderOptions } from "@testing-library/react";
import { SnackbarProvider } from "notistack";
import * as React from "react";

import SWRProvider from "../../app/SWRProvider";

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
  return (
    <IntlProvider locale="de" defaultLocale="de" onError={onError}>
      <SnackbarProvider>
        {/* Disable SWR deduping for isolated test behavior.
         * See https://github.com/vercel/swr/pull/231#issuecomment-591614747
         *
         * Reset cache between test cases
         * See https://swr.vercel.app/docs/advanced/cache#reset-cache-between-test-cases
         */}
        <SWRProvider
          value={{
            dedupingInterval: 0,
            compare: (a, b) => false,
            provider: () => new Map(),
          }}
        >
          {children}
        </SWRProvider>
      </SnackbarProvider>
    </IntlProvider>
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
