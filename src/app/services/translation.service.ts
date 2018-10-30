import { Injectable } from '@angular/core';

@Injectable()
export class TranslationService {

  translations = {};

  constructor() {

  }

  i18n(id) {
    return this.translations[id] || id;
  }
}
