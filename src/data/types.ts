export type TheoryDetail = {
  keyConcepts?: string[];
  whyItMatters?: string;
  commonPitfalls?: string[];
  comparisons?: Array<{
    title: string;
    summary?: string;
    points: string[];
  }>;
  examples?: Array<{
    title: string;
    description: string;
    code: string;
    language?: string;
    preview?: {
      html?: string;
      css?: string;
      javascript?: string;
      height?: number;
    };
    /** Legacy fallback for text-only preview content. Prefer preview for CSS examples. */
    output?: string;
  }>;
};

export type TopicNode = {
  id: string;
  title: string;
  iconName?: string;
  demoComponentKey?: string;
  theory?: string;
  theoryDetail?: TheoryDetail;
  completed?: boolean;
  children?: TopicNode[];
  link?: string;
};

export type Technology = {
  id: string;
  name: string;
  description: string;
  color: string;
  iconName: string;
  deviconClass: string;
  tree: TopicNode[];
};
