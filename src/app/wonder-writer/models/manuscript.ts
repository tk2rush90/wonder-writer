import {HierarchyDerived} from './hierarchy-item';
import Quill from 'quill';

const Delta = Quill.import('delta');

export interface Manuscript extends HierarchyDerived {
  // Manuscript id.
  id: string;
  // Manuscript content.
  // It should be Delta of Quill instance.
  content?: typeof Delta;
}
