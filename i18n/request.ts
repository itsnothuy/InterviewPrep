// i18n configuration for next-intl
import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async () => {
  // Get locale from cookie, header, or use default
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // Try to get locale from cookie first
  let locale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;
  
  // Fall back to Accept-Language header
  if (!locale) {
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferred = acceptLanguage.split(',')[0]?.split('-')[0];
      if (locales.includes(preferred as Locale)) {
        locale = preferred as Locale;
      }
    }
  }
  
  // Fall back to default
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
