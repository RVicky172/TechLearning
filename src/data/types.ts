export type TopicNode = {
  id: string;
  title: string;
  iconName?: string;
  theory?: string;
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
  tree: TopicNode[];
};
