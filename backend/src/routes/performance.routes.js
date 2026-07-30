import { Router } from "express";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const data = [
  { method: "Traditional", latency: 90, throughput: 720, scalability: 68, securityScore: 58 },
  { method: "AES", latency: 140, throughput: 610, scalability: 76, securityScore: 82 },
  { method: "AES + ZKP", latency: 230, throughput: 470, scalability: 91, securityScore: 96 }
];

router.get("/", authenticate, (_req, res) => {
  res.json({
    data,
    units: {
      latency: "ms/transaction",
      throughput: "transactions/min",
      scalability: "score/100",
      securityScore: "score/100"
    },
    decision:
      "Traditional is fastest because it only hashes the file. AES adds encryption overhead but protects confidentiality. AES + ZKP is slowest because proof generation/verification adds computation, but it gives the strongest privacy and trust model.",
    notes: "Project benchmark baseline derived from relative computational cost: hash-only < encryption < encryption plus proof verification."
  });
});

export default router;
