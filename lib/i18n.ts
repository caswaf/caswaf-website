import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'zh'],
  parser: 'dir',
});

export type Lang = (typeof i18n.languages)[number];
