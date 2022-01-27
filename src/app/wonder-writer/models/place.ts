import {HierarchyDerived} from './hierarchy-item';

export interface Place extends HierarchyDerived {
  // Place id.
  id: string;
  // Place content.
  content: string;
}
