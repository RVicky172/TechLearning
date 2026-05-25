import type { TopicNode } from "@/data/types";

export function buildTopicParentMap(nodes: TopicNode[]): Map<string, string> {
  const topicToRoot = new Map<string, string>();

  for (const root of nodes) {
    const walk = (node: TopicNode) => {
      topicToRoot.set(node.id, root.id);
      for (const child of node.children ?? []) {
        walk(child);
      }
    };

    walk(root);
  }

  return topicToRoot;
}
