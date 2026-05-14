import type { Technology } from "@/data/types";
import { graphqlFundamentals } from "./fundamentals";
import { graphqlSchema } from "./schema";
import { graphqlResolvers } from "./resolvers";
import { graphqlLibraries } from "./libraries";

const graphql: Technology = {
  id: "graphql",
  name: "GraphQL",
  description: "Query language for APIs that allows clients to request exactly the data they need.",
  color: "bg-pink-600",
  iconName: "Network",
  deviconClass: "devicon-graphql-plain colored",
  tree: [
    graphqlFundamentals,
    graphqlSchema,
    graphqlResolvers,
    graphqlLibraries,
  ],
};

export default graphql;
