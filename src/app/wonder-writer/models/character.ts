import {HierarchyDerived} from './hierarchy-item';

export interface Character extends HierarchyDerived {
  // Character id.
  id: string;
  // Character content.
  content: string;
}
