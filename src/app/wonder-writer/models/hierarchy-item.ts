export type HierarchyDirectoryType = 'manuscript' | 'character' | 'place' | 'episode';

export type HierarchyType = 'directory' | HierarchyDirectoryType;

export interface HierarchyItem {
  // Hierarchy id.
  id?: string;
  // Project id.
  projectId: string;
  // Parent hierarchy id.
  parentId?: string;
  // Hierarchy name.
  name: string;
  // Hierarchy type.
  type: HierarchyType;
  // Hierarchy order.
  order: number;
  // Directory type.
  directoryType?: HierarchyDirectoryType;
  // Child hierarchies for UI.
  // This should be created when getting data from the backend.
  children?: HierarchyItem[];
  // Opened state for directory type.
  // Only be used from UI.
  opened?: boolean;
}

export interface HierarchyDerived {
  // Hierarchy id.
  hierarchyId: string;
  // Hierarchy name.
  name: string;
}
