import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const xml = require('./xml');

@Injectable()
export class TranslationService {

  private translations = {};

  constructor(private http: HttpClient) {
    this.setLanguage(navigator.language);
  }

  public setLanguage(locale) {
    const subscr = this.http
      .get('assets/i18n/' + locale + '.xlf', {responseType: 'text'})
      .subscribe(res => {
        if (res) {
          this.translations = this.parseXMLIntoJson(res);
          subscr.unsubscribe();
        } else {
          this.setLanguage('en');
        }
      });
  }

  public getLanguages() {
    return ['de', 'en'];
  }

  public i18n(id) {
    return this.translations[id] || id;
  }

  private parseXMLIntoJson(xmlString) {
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
