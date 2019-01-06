import { PipeTransform, Pipe } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private translationService: TranslationService) {}

  public transform(value: string, reload: number = 0) {
    return this.translationService.i18n(value);
  }
}
