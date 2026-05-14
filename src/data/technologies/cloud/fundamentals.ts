import type { TopicNode } from "@/data/types";

export const cloudFundamentals: TopicNode = {
  id: "cloud-fundamentals",
  title: "Cloud Fundamentals",
  iconName: "Cloud",
  theory:
    "Cloud infrastructure is about renting reliable building blocks instead of managing every server yourself. The foundation is understanding regions, availability zones, networking, identity, storage, and the shared-responsibility model.",
  theoryDetail: {
    keyConcepts: [
      "Regions and availability zones shape latency, resilience, and disaster recovery choices.",
      "Identity and access management is the real perimeter in cloud systems.",
      "Object storage, block storage, and managed databases solve different persistence needs.",
      "Managed services reduce operational work, but they do not remove architecture tradeoffs.",
    ],
    whyItMatters:
      "Most software teams now deploy on AWS, GCP, Azure, or platforms built on top of them. A working cloud model helps you reason about deployment, cost, security, and incident response without treating infrastructure as magic.",
    commonPitfalls: [
      "Granting broad admin permissions instead of least-privilege roles.",
      "Ignoring network boundaries and exposing internal services directly to the internet.",
      "Choosing managed services by brand familiarity rather than workload fit and cost profile.",
    ],
  },
  children: [
    {
      id: "cloud-major-providers",
      title: "AWS, GCP, and Azure Map",
      iconName: "Map",
      theory:
        "Learn the equivalent building blocks across providers: compute, storage, networking, IAM, managed databases, queues, and observability. The concepts transfer better than service names.",
      link: "https://cloud.google.com/docs/get-started/understanding-core-concepts",
    },
    {
      id: "cloud-networking-basics",
      title: "VPC, Subnets, and Load Balancers",
      iconName: "Network",
      theory:
        "Virtual networks, public and private subnets, ingress, and managed load balancing are the backbone of cloud deployment architecture.",
      link: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
    },
  ],
};