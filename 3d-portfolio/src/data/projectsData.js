export const projectCategories = [
  {
    id: "cloud-architecture",
    name: "Cloud Database Architecture",
    tagline: "Scalable Serverless Infrastructure & Real-Time Syncing",
    description: "High-performance backend systems engineered for zero downtime, strict relational integrity, and secure cloud operations.",
    stats: "99.9% Uptime // Zero-Downtime Schema Migrations",
    projects: [
      {
        title: "Philam Database Core",
        subtitle: "Supabase & PostgreSQL Cloud Infrastructure",
        summary: "Supabase-powered backend infrastructure managing scalable migrations, serverless data structures, and secure cloud tables.",
        details: "Engineered robust PostgreSQL schemas and managed real-time database syncing through Supabase. Designed automated migration pipelines to ensure zero downtime during high-concurrency state updates and secure data handling.",
        tech: ["Supabase", "PostgreSQL", "Row-Level Security", "Database Triggers", "Node.js"],
        image: "/PhilamDB.png",
        highlights: [
          "Automated migration pipelines preventing schema drift",
          "Fine-grained Row Level Security (RLS) policies",
          "Real-time event subscriptions with WebSocket connection pooling"
        ],
        metrics: "Sub-50ms query response time",
        status: "Production // Active"
      }
    ]
  },
  {
    id: "systems-platforms",
    name: "Systems & Platforms",
    tagline: "Enterprise Management & Association Portals",
    description: "Comprehensive administration suites built for secure audit logging, role-based governance, and operational automation.",
    stats: "Multi-tenant portal // Complete Audit Trails",
    projects: [
      {
        title: "Philam Life Home Owner's Association System",
        subtitle: "Association Operation & Security Governance Portal",
        summary: "Comprehensive management system built for streamlined operations, tracking system status and secure database logs.",
        details: "Developed a full-stack architecture for the Philam Life Home Owner's Association system. Integrated automated administrative workflows, member credential tracking, monthly dues processing, and secure audit logging.",
        tech: ["Full-Stack Architecture", "Node.js", "Express", "PostgreSQL", "RBAC Auth"],
        image: "/PhilamLife.png",
        highlights: [
          "Complete member ledger and automated billing computation",
          "Tamper-evident audit logging for financial transactions",
          "Resident credential verification and access control"
        ],
        metrics: "Over 500+ active household records managed",
        status: "Production // Deployed"
      }
    ]
  },
  {
    id: "fullstack-apps",
    name: "Full-Stack Web Applications",
    tagline: "Interactive Dashboards & Inventory Subsystems",
    description: "Dynamic business dashboards tracking real-time sales performance, debtor records, and instant asset auditing.",
    stats: "Live POS & Inventory // Instant Reconciliation",
    projects: [
      {
        title: "Joram's Wholesale and Retail Store System",
        subtitle: "Commercial Sales & Debt Tracking Dashboard",
        summary: "Interactive business management dashboard tracking real-time sales performance, inventory, debtor records, and schedules.",
        details: "Built as a full-stack commercial solution for Joram's Wholesale and Retail Store System. Features dynamic data rendering, optimized local caching, and responsive metric cards calculating real-time profit and sales performance.",
        tech: ["React", "JavaScript", "REST APIs", "Data Visualization", "Local Caching"],
        image: "/Jorams.png",
        highlights: [
          "Real-time ledger for customer credit and payment schedules",
          "Daily profit/loss and inventory margin analytics",
          "Responsive, keyboard-first point of sale interface"
        ],
        metrics: "Processed 10,000+ commercial transactions",
        status: "Deployed // Daily Use"
      },
      {
        title: "Jorams Inventory Management Subsystem",
        subtitle: "Instantaneous Asset Auditing Module",
        summary: "Dedicated asset tracking and inventory management module designed for real-time performance optimization.",
        details: "A specialized inventory subsystem focused on instantaneous stock auditing, warning alerts for low inventory stock, barcode lookups, and streamlined categorization matrices.",
        tech: ["Frontend State Management", "UI/UX Architecture", "Tailwind CSS", "Auditing Algorithms"],
        image: "/joramsim.png",
        highlights: [
          "Predictive stock depletion notifications",
          "SKU-level categorization matrix and multi-warehouse sorting",
          "Optimistic UI updates with offline resilience"
        ],
        metrics: "Audited 1,200+ unique inventory SKUs",
        status: "Live Module"
      }
    ]
  }
];
