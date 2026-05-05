export type TheoryDetail = {
  keyConcepts?: string[];
  whyItMatters?: string;
  commonPitfalls?: string[];
  examples?: Array<{
    title: string;
    description: string;
    code: string;
    language?: string;
    /** Visual output block shown below the code — ASCII/text preview of the rendered result */
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
