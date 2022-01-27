import {OptionItem} from '@tk-ui/models/option-item';

export class ProjectSettingsUtil {
  // Available fonts
  static readonly availableFonts = [
    'NotoSans',
    'NotoSerif',
    'NanumGothic',
    'NanumMyeongjo',
  ];

  /**
   * Get available font options
   */
  static get fontOptions(): OptionItem<string>[] {
    return this.availableFonts.map(item => {
      return new OptionItem<string>(item, item);
    });
  }
}
