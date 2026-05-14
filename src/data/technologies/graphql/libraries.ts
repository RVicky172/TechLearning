import type { TopicNode } from "@/data/types";

export const graphqlLibraries: TopicNode = {
  id: "graphql-libraries",
  title: "Popular Libraries & Tools",
  iconName: "Package",
  theoryDetail: {
    keyConcepts: [
      "Apollo Server: full-featured GraphQL server with plugins and directives",
      "Apollo Client: GraphQL client with caching, state management, and subscriptions",
      "Relay: Facebook's GraphQL client with strict conventions and excellent DX",
      "urql: lightweight GraphQL client with extensibility",
      "GraphQL Yoga: simple, spec-compliant GraphQL server",
      "Code generators: graphql-code-generator for type-safe client/server code",
    ],
    whyItMatters:
      "Choosing the right tools can save months of development time. Popular libraries have large communities, better documentation, and solve common problems.",
    commonPitfalls: [
      "Over-engineering with Apollo when a simple urql setup would work",
      "Not using code generation; manually maintaining types causes bugs",
      "Mixing server and client libraries poorly; they need to work together",
    ],
  },
};
