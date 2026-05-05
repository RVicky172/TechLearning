import type { Technology } from "@/data/types";
import { dsaBigO } from "@/data/technologies/dsa/bigO";
import { dsaBitwise } from "@/data/technologies/dsa/bitwise";
import { dsaDataStructures } from "@/data/technologies/dsa/dataStructures";
import { dsaAlgorithms } from "@/data/technologies/dsa/algorithms";

const dsa: Technology = {
  id: "dsa",
  name: "Data Structures & Algorithms",
  description:
    "Master the fundamentals of computer science: Big O notation, bitwise operations, core data structures, and essential algorithms — the building blocks of every technical interview and scalable system.",
  color: "bg-emerald-600",
  iconName: "Binary",
  deviconClass: "devicon-cplusplus-plain colored",
  tree: [dsaBigO, dsaBitwise, dsaDataStructures, dsaAlgorithms],
};

export default dsa;
