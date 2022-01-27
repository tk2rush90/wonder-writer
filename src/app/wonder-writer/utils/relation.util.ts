export class RelationUtil {
  /**
   * Return relation target label
   * @param type type
   */
  static getTargetLabel(type: 'character' | 'place' | 'episode'): string {
    switch (type) {
      case 'character': {
        return '인물';
      }

      case 'place': {
        return '장소';
      }

      case 'episode': {
        return '사건';
      }
    }
  }

  /**
   * Return relation target invalid message
   * @param type type
   */
  static getTargetInvalidMessage(type: 'character' | 'place' | 'episode'): string {
    switch (type) {
      case 'character': {
        return '인물을 선택해주세요';
      }

      case 'place': {
        return '장소를 선택해주세요';
      }

      case 'episode': {
        return '사건을 선택해주세요';
      }
    }
  }
}
