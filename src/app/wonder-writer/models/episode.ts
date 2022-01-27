import {HierarchyDerived} from './hierarchy-item';

export interface Episode extends HierarchyDerived {
  // Episode id.
  id: string;
  // Episode content.
  content: string;
}
