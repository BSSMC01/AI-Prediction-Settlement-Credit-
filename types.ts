import React from 'react';

export enum SectionType {
  TEXT = 'TEXT',
  LIST = 'LIST',
  CODE = 'CODE',
  ARCHITECTURE = 'ARCHITECTURE',
  TABLE = 'TABLE',
  FLOW = 'FLOW',
  API = 'API',
  IMAGE_EDITOR = 'IMAGE_EDITOR'
}

export interface ContentBlock {
  type: SectionType;
  title?: string;
  content?: string | string[];
  code?: string;
  language?: string;
  data?: any; // Flexible for specific visualizations
}

export interface DocumentSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  blocks: ContentBlock[];
}