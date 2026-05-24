import type { Technology } from "@/data/types";
import { linuxFundamentals } from "@/data/technologies/linux/fundamentals";
import { linuxScripting } from "@/data/technologies/linux/scripting";

const linux: Technology = {
  id: "linux",
  name: "Linux & Shell",
  description:
    "Essential Linux commands, file permissions, process management, and Bash scripting for server-side development.",
  color: "bg-yellow-600",
  iconName: "Terminal",
  deviconClass: "devicon-linux-plain colored",
  tree: [linuxFundamentals, linuxScripting],
};

export default linux;
