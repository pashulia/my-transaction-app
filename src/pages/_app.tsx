import { useEffect } from 'react';

import { AppProps } from 'next/app';

import i18n from '../i18n';

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        i18n.changeLanguage('en');
    }, []);

    return <Component {...pageProps} />;
}

export default MyApp;
