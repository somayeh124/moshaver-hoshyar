/* eslint-disable perfectionist/sort-imports */
import'./global.css'
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';





// ----------------------------------------------------------------------
// صفحه اصلی 
export default function App() {
  useScrollToTop();
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </CacheProvider>
  );
}
