import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: {
            translation: {
                transactionHistory: 'Transaction History',
                date: 'Date',
                amount: 'Amount',
                type: 'Type',
                details: 'Details',
            },
        },
    },
});

export default i18n;
