import { PipeTransform, Pipe } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  public transform(value: string) {
    return this.translationService.i18n(value);
  }
}
