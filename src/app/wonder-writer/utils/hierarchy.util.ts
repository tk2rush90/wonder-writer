import {HierarchyItem, HierarchyType} from '../models/hierarchy-item';
import {DroppableEvent} from '../services/common/hierarchy.service';

export class HierarchyUtil {
  /**
   * Return type label.
   * Directory type is not allowed by default.
   * @param type type
   * @param allowDirectory set `true` to allow directory type
   */
  static getTypeLabel(type: HierarchyType, allowDirectory = false): string {
    switch (type) {
      case 'manuscript': {
        return '원고';
      }

      case 'character': {
        return '인물';
      }

      case 'place': {
        return '장소';
      }

      case 'episode': {
        return '사건';
      }

      default: {
        if (allowDirectory && type === 'directory') {
          return '폴더';
        } else {
          throw new Error(`Invalid hierarchy type: ${type}`);
        }
      }
    }
  }

  /**
   * Return create success message.
   * Directory type is not allowed.
   * @param type type
   */
  static getCreateSuccessMessage(type: HierarchyType): string {
    switch (type) {
      case 'manuscript': {
        return '원고가 생성되었습니다';
      }

      case 'character': {
        return '인물이 생성되었습니다';
      }

      case 'place': {
        return '장소가 생성되었습니다';
      }

      case 'episode': {
        return '사건이 생성되었습니다';
      }

      default: {
        throw new Error(`Invalid hierarchy type: ${type}`);
      }
    }
  }

  /**
   * Return create failure message.
   * Directory type is not allowed.
   * @param type type
   */
  static getCreateFailureMessage(type: HierarchyType): string {
    switch (type) {
      case 'manuscript': {
        return '원고를 생성하지 못했습니다';
      }

      case 'character': {
        return '인물을 생성하지 못했습니다';
      }

      case 'place': {
        return '장소를 생성하지 못했습니다';
      }

      case 'episode': {
        return '사건을 생성하지 못했습니다';
      }

      default: {
        throw new Error(`Invalid hierarchy type: ${type}`);
      }
    }
  }

  /**
   * Return delete confirm message.
   * Directory type is not allowed.
   * @param type
   */
  static getDeleteConfirmMessage(type: HierarchyType): string {
    switch (type) {
      case 'manuscript': {
        return '원고를 삭제하시겠습니까?';
      }

      case 'character': {
        return '인물을 삭제하시겠습니까?';
      }

      case 'place': {
        return '장소를 삭제하시겠습니까?';
      }

      case 'episode': {
        return '사건을 삭제하시겠습니까?';
      }

      default: {
        throw new Error(`Invalid hierarchy type: ${type}`);
      }
    }
  }

  /**
   * Return delete success message.
   * Directory type is not allowed.
   * @param type
   */
  static getDeleteSuccessMessage(type: HierarchyType): string {
    switch (type) {
      case 'manuscript': {
        return '원고가 삭제 되었습니다';
      }

      case 'character': {
        return '인물이 삭제 되었습니다';
      }

      case 'place': {
        return '장소가 삭제 되었습니다';
      }

      case 'episode': {
        return '사건이 삭제 되었습니다';
      }

      default: {
        throw new Error(`Invalid hierarchy type: ${type}`);
      }
    }
  }

  /**
   * Return delete failure message.
   * Directory type is not allowed.
   * @param type
   */
  static getDeleteFailureMessage(type: HierarchyType): string {
    switch (type) {
      case 'manuscript': {
        return '원고를 삭제하지 못했습니다';
      }

      case 'character': {
        return '인물을 삭제하지 못했습니다';
      }

      case 'place': {
        return '장소를 삭제하지 못했습니다';
      }

      case 'episode': {
        return '사건을 삭제하지 못했습니다';
      }

      default: {
        throw new Error(`Invalid hierarchy type: ${type}`);
      }
    }
  }

  /**
   * Return edit success message.
   * Directory type is not allowed.
   * @param type type
   */
  static getEditSuccessMessage(type: HierarchyType): string {
    switch (type) {
      case 'directory': {
        return '폴더가 수정되었습니다';
      }

      case 'manuscript': {
        return '원고가 수정되었습니다';
      }

      case 'character': {
        return '인물이 수정되었습니다';
      }

      case 'place': {
        return '장소가 수정되었습니다';
      }

      case 'episode': {
        return '사건이 수정되었습니다';
      }
    }
  }

  /**
   * Return edit failure message.
   * Directory type is not allowed.
   * @param type type
   */
  static getEditFailureMessage(type: HierarchyType): string {
    switch (type) {
      case 'directory': {
        return '폴더를 수정하지 못했습니다';
      }

      case 'manuscript': {
        return '원고를 수정하지 못했습니다';
      }

      case 'character': {
        return '인물을 수정하지 못했습니다';
      }

      case 'place': {
        return '장소를 수정하지 못했습니다';
      }

      case 'episode': {
        return '사건을 수정하지 못했습니다';
      }
    }
  }

  /**
   * find hierarchy by id from hierarchy tree
   * @param hierarchies hierarchy tree
   * @param id id
   */
  static findHierarchyById(hierarchies: HierarchyItem[], id: string): HierarchyItem | undefined {
    let searched: HierarchyItem | undefined;

    hierarchies.some(hierarchy => {
      if (hierarchy.id === id) {
        searched = hierarchy;
      } else {
        searched = this.findHierarchyById(hierarchy.children || [], id);
      }

      return searched;
    });

    return searched;
  }

  /**
   * Find and update drop target hierarchy
   * @param hierarchies root hierarchies with children
   * @param draggingHierarchy dragging hierarchy
   * @param droppableEvent droppable event
   */
  static findAndUpdateDropTargetHierarchy(
    hierarchies: HierarchyItem[],
    draggingHierarchy: HierarchyItem,
    droppableEvent: DroppableEvent,
  ): HierarchyItem | undefined {
    const parent = HierarchyUtil.findHierarchyById(hierarchies, droppableEvent.parentId);

    if (parent) {
      const cloneParent = {
        ...parent,
        children: [
          ...(parent.children || []),
        ],
      };

      const cloneDraggingHierarchy = {
        ...draggingHierarchy,
        parentId: cloneParent.id,
      };

      // When moving to same directory, remove existing one
      if (cloneParent.id === droppableEvent.parentId) {
        cloneParent.children = cloneParent.children.filter(child => child.id !== draggingHierarchy.id);
      }

      const index = cloneParent.children.findIndex(child => child.id === droppableEvent.nextId);

      if (index === -1) {
        cloneParent.children.push(cloneDraggingHierarchy);
      } else {
        cloneParent.children.splice(index, 0, cloneDraggingHierarchy);
      }

      cloneParent.children.forEach((child, index) => child.order = index);

      return cloneParent;
    }

    return;
  }

  /**
   * Find and update drop origin hierarchy
   * @param hierarchies root hierarchies with children
   * @param draggingHierarchy dragging hierarchy
   * @param droppableEvent droppable event
   */
  static findAndUpdateDropOriginHierarchy(
    hierarchies: HierarchyItem[],
    draggingHierarchy: HierarchyItem,
    droppableEvent: DroppableEvent,
  ): HierarchyItem | undefined {
    if (draggingHierarchy.parentId !== droppableEvent.parentId) {
      const parent = HierarchyUtil.findHierarchyById(hierarchies, draggingHierarchy.parentId as string);

      if (parent) {
        const cloneParent = {
          ...parent,
          children: [
            ...(parent.children || []).filter(child => child.id !== draggingHierarchy.id),
          ],
        };

        cloneParent.children.forEach((child, index) => child.order = index);

        return cloneParent;
      }
    }

    return;
  }
}
