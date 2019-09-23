import { PipeTransform, Pipe } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { SortType } from '../models/sort';

@Pipe({
  name: 'sortTypeTranslation'
})
export class SortTypePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  public transform(value: SortType, reload: number = 0) {
    let translation = '';
    switch (value) {
      case SortType.DATE:
        translation = this.translationService.i18n('sortType.date');
        break;
      case SortType.LEXICAL:
        translation = this.translationService.i18n('sortType.lexical');
        break;
      default:
        translation = <string>value;
    }

    return translation;
  }
}
