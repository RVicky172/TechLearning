export type TheoryDetail = {
  keyConcepts?: string[];
  whyItMatters?: string;
  commonPitfalls?: string[];
};

export type TopicNode = {
  id: string;
  title: string;
  iconName?: string;
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
