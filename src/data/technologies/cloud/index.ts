import type { Technology } from "@/data/types";
import { cloudFundamentals } from "./fundamentals";
import { cloudCompute } from "./compute";
import { cloudContainers } from "./containers";
import { cloudDelivery } from "./delivery";
import { cloudReliability } from "./reliability";
import { cloudAWS } from "./aws";
import { cloudProviders } from "./providers";
import { cloudPlatformDeploy } from "./platformDeploy";
import { cloudServerless } from "./serverless";
import { cloudIaC } from "./iac";

const cloud: Technology = {
  id: "cloud",
  name: "Cloud Infrastructure",
  description: "AWS, GCP, Azure, serverless, IaC (Terraform/Pulumi), and end-to-end deployment guides for fullstack apps.",
  color: "bg-sky-600",
  iconName: "Cloud",
  deviconClass: "devicon-amazonwebservices-plain-wordmark colored",
  tree: [
    cloudFundamentals,
    cloudCompute,
    cloudContainers,
    cloudAWS,
    cloudProviders,
    cloudServerless,
    cloudIaC,
    cloudPlatformDeploy,
    cloudDelivery,
    cloudReliability,
  ],
};

export default cloud;