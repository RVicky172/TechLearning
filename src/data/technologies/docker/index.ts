import type { Technology } from "@/data/types";
import { dockerFundamentals } from "@/data/technologies/docker/fundamentals";
import { dockerImages } from "@/data/technologies/docker/images";
import { dockerCompose } from "@/data/technologies/docker/compose";
import { dockerVolumesNetworking } from "@/data/technologies/docker/networking";

const docker: Technology = {
  id: "docker",
  name: "Docker",
  description:
    "Containerise applications for consistent, portable deployment — images, Compose, volumes, and networking.",
  color: "bg-blue-500",
  iconName: "Container",
  deviconClass: "devicon-docker-plain colored",
  tree: [dockerFundamentals, dockerImages, dockerCompose, dockerVolumesNetworking],
};

export default docker;
