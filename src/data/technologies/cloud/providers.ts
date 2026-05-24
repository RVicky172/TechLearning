import type { TopicNode } from "@/data/types";

export const cloudProviders: TopicNode = {
  id: "cloud-providers",
  title: "GCP & Azure — Core Services",
  iconName: "Globe",
  link: "https://cloud.google.com/docs",
  theory:
    "Google Cloud Platform (GCP) and Microsoft Azure are the second and third largest cloud providers. GCP is known for data analytics (BigQuery), container infrastructure (Kubernetes was born at Google), and AI/ML services. Azure is dominant in enterprises that use Microsoft products (Active Directory, Teams, Office 365). Both offer equivalent services to AWS, just with different names and strengths.",
  theoryDetail: {
    keyConcepts: [
      "GCP Cloud Run: the easiest way to run containers on GCP — fully managed, auto-scales to zero, HTTP-triggered; perfect for API services and Next.js apps without managing clusters",
      "GCP GKE (Google Kubernetes Engine): managed Kubernetes — more control than Cloud Run; Autopilot mode manages nodes for you; used when you need fine-grained scheduling, custom operators, or stateful workloads",
      "GCP Cloud SQL: managed PostgreSQL and MySQL; Cloud Spanner for globally distributed SQL with horizontal scaling; AlloyDB for high-performance PostgreSQL-compatible workloads",
      "GCP BigQuery: serverless analytics data warehouse — query petabytes of data with SQL; pay per query (5 USD/TB scanned); used for BI, analytics, and ML feature pipelines",
      "GCP Cloud Storage: object storage equivalent to AWS S3 — identical pricing tier structure; Pub/Sub is the managed message queue / event bus (equivalent to AWS SNS+SQS)",
      "GCP Vertex AI: unified ML platform — model training, fine-tuning, hosting, and the Gemini API; integrates with BigQuery for ML on warehouse data",
      "Azure App Service: PaaS for web apps — deploy Node.js, .NET, Python, Java directly from code or Docker; built-in scaling, deployment slots for blue/green, and GitHub Actions integration",
      "Azure Container Apps: serverless containers on Azure (equivalent to GCP Cloud Run / AWS App Runner) — built on Kubernetes but abstracts it away",
      "Azure AKS (Azure Kubernetes Service): managed Kubernetes on Azure — tight integration with Azure AD (Entra ID) for RBAC, good for enterprise teams on Microsoft stack",
      "Azure Active Directory (Entra ID): enterprise identity provider — OAuth 2.0 / OIDC provider; if your company uses Microsoft 365, AD is likely already your SSO provider",
      "Equivalent services cheat sheet: EC2 ≈ GCE ≈ Azure VMs | S3 ≈ Cloud Storage ≈ Azure Blob | Lambda ≈ Cloud Functions ≈ Azure Functions | RDS ≈ Cloud SQL ≈ Azure SQL | EKS ≈ GKE ≈ AKS",
    ],
    whyItMatters:
      "GCP is the preferred cloud for data-heavy and AI workloads. Azure is required knowledge for enterprise and government roles. Many teams use multi-cloud (e.g. AWS primary + GCP BigQuery for analytics). Knowing how to deploy a containerised app on each provider without needing DevOps help is a strong differentiator.",
    commonPitfalls: [
      "Treating IAM across providers as identical — GCP uses service accounts + roles differently from AWS IAM roles; Azure uses Managed Identities and role assignments at resource scope",
      "Forgetting Cloud Run cold starts — Cloud Run scales to zero by default, causing cold starts; set min-instances=1 for latency-sensitive services (and pay for always-on idle time)",
      "Ignoring network egress costs — data leaving a cloud region to the internet or to another provider is charged; design systems to keep data within a single region where possible",
    ],
    examples: [
      {
        title: "Deploy a Next.js app on GCP Cloud Run",
        description:
          "Build a Docker image, push to Artifact Registry, and deploy to Cloud Run with a custom domain and Cloud SQL connection.",
        code: `# ── Authenticate and set project ──────────────────────────
gcloud auth login
gcloud config set project my-project-id

# ── Build and push image to Artifact Registry ─────────────
gcloud artifacts repositories create my-repo \
  --repository-format=docker \
  --location=us-central1

# Configure Docker credential helper
gcloud auth configure-docker us-central1-docker.pkg.dev

docker build -t my-app .
docker tag  my-app us-central1-docker.pkg.dev/my-project-id/my-repo/my-app:latest
docker push us-central1-docker.pkg.dev/my-project-id/my-repo/my-app:latest

# ── Deploy to Cloud Run ────────────────────────────────────
gcloud run deploy my-app \
  --image  us-central1-docker.pkg.dev/my-project-id/my-repo/my-app:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \        # public traffic
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 1 \              # avoid cold starts in prod
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets  "DATABASE_URL=db-url:latest"  # from Secret Manager

# ── Map custom domain ──────────────────────────────────────
gcloud run domain-mappings create \
  --service my-app \
  --domain app.example.com \
  --region us-central1
# Then add the DNS records shown in the output to your registrar

# ── Connect to Cloud SQL (private IP via VPC connector) ────
gcloud run services update my-app \
  --region us-central1 \
  --vpc-connector my-vpc-connector \
  --vpc-egress all-traffic

# ── Azure equivalent (Azure Container Apps) ───────────────
az containerapp create \
  --name my-app \
  --resource-group my-rg \
  --environment my-env \
  --image myregistry.azurecr.io/my-app:latest \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 10 \
  --secrets "db-url=postgresql://..." \
  --env-vars "DATABASE_URL=secretref:db-url"`,
        language: "bash",
      },
    ],
  },
};
