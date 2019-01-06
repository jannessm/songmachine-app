import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const xml = require('./xml');

@Injectable()
export class TranslationService {

  private translations = {};
  private currLanguage = 'en';

  constructor(private http: HttpClient) {
    this.setLanguage(navigator.language);
  }

  public setLanguage(locale: string): Promise<void> {
    this.currLanguage = locale;
    return this.http
      .get('assets/i18n/' + locale + '.xlf', {responseType: 'text'})
      .toPromise()
      .then(res => {
        return new Promise<void>(resolve => {
          this.translations = this.parseXMLIntoJson(res);
          resolve();
        });
      })
      .catch(() => this.setLanguage('en'));
  }

  public getLanguages(): Array<string> {
    return ['de', 'en'];
  }

  public getCurrentLanguage(): string {
    return this.currLanguage;
  }

  public i18n(id: string): string {
    return this.translations[id] || id;
  }

  private parseXMLIntoJson(xmlString: string): {[key: string]: string} {
    const nodes = xml.parse(xmlString);
    const map = {};
    const units = nodes.children[0].children[0].children[0].children;
    units.forEach(unit => {
      const target = unit.children.filter(child => child.tag === 'target')[0];
      let str = '';
      if (target) {
        target.children.forEach(child => {
          if (typeof child === 'string') {
            str += child.trim();
          }
        });
      }
      map[unit.attributes.id] = str;
    });
    return map;
  }
}
