import type { Technology } from "@/data/types";
import { cloudFundamentals } from "./fundamentals";
import { cloudCompute } from "./compute";
import { cloudContainers } from "./containers";
import { cloudDelivery } from "./delivery";
import { cloudReliability } from "./reliability";

const cloud: Technology = {
  id: "cloud",
  name: "Cloud Infrastructure",
  description: "Cloud-native systems, deployment models, operations, and platform skills used to run modern software.",
  color: "bg-sky-600",
  iconName: "Cloud",
  deviconClass: "devicon-amazonwebservices-plain-wordmark colored",
  tree: [
    cloudFundamentals,
    cloudCompute,
    cloudContainers,
    cloudDelivery,
    cloudReliability,
  ],
};

export default cloud;