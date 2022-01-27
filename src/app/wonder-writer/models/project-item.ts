import {DateLike} from '@tk-ui/others/types';

export interface ProjectItem {
  // Project unique id.
  id?: string;
  // Project name.
  name: string;
  // Last modified date.
  // Should be generated from the backend.
  lastModifiedDate?: DateLike;
  // Theme color for logo.
  // Should be generated from the backend.
  theme?: string;
}
