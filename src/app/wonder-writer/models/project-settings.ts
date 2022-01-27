export type ProjectFont = 'NotoSans' | 'NotoSerif' | 'NanumGothic' | 'NanumMyeongjo';
export type ProjectTheme = 'dark' | 'white';

export interface ProjectSettings {
  // Id
  id: string;

  // Project id
  projectId: string;

  // Font family
  contentFont: ProjectFont;

  // Content width
  contentWidth: number;

  // Project color theme
  theme: ProjectTheme;
}
