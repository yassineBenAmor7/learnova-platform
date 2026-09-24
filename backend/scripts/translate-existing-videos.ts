import { getPrismaClient, closePrismaClient } from '../src/prisma/prisma-client.factory';

const prisma = getPrismaClient();

async function main() {
  console.log('🔄 Checking and translating any French video titles/descriptions in database to English...');

  const videos = await prisma.video.findMany({
    include: {
      session: {
        include: {
          course: true,
        },
      },
    },
  });

  let updatedCount = 0;

  for (const video of videos) {
    let newTitle = video.title;
    let newDescription = video.description;
    let newContent = video.content;
    let modified = false;

    // Title replacements
    if (newTitle.includes(': Principes Fondamentaux & Cadre Théorique')) {
      newTitle = newTitle.replace(': Principes Fondamentaux & Cadre Théorique', ': Fundamental Principles & Theoretical Framework');
      modified = true;
    }
    if (newTitle.includes(': Méthodologies, Frameworks & Analyse Approfondie')) {
      newTitle = newTitle.replace(': Méthodologies, Frameworks & Analyse Approfondie', ': Methodologies, Frameworks & In-Depth Analysis');
      modified = true;
    }
    if (newTitle.includes(': Atelier Pratique d\'Implémentation Étape par Étape') || newTitle.includes(": Atelier Pratique d'Implémentation Étape par Étape")) {
      newTitle = newTitle.replace(/: Atelier Pratique d['’]Implémentation Étape par Étape/, ': Practical Step-by-Step Implementation Workshop');
      modified = true;
    }
    if (newTitle.includes(': Études de Cas Réelles & Bonnes Pratiques Industrielles')) {
      newTitle = newTitle.replace(': Études de Cas Réelles & Bonnes Pratiques Industrielles', ': Real-World Case Studies & Industry Best Practices');
      modified = true;
    }

    // Check for any French descriptions
    if (newDescription && (newDescription.includes('Introduction théorique') || newDescription.includes('Décomposition méthodologique') || newDescription.includes('Mise en application guidée') || newDescription.includes('Étude de cas approfondie'))) {
      const cleanTitle = video.session?.title || 'this topic';
      const courseTitle = video.session?.course?.title || 'the course';

      if (video.orderNumber === 1 || newTitle.includes('Fundamental Principles')) {
        newDescription = `Theoretical and conceptual introduction to ${cleanTitle}. This module establishes foundational concepts, key terminologies, and governing models applied within "${courseTitle}".`;
      } else if (video.orderNumber === 2 || newTitle.includes('Methodologies')) {
        newDescription = `In-depth methodological breakdown of ${cleanTitle}. Explore industry-standard frameworks, implementation protocols, and comparative trade-off analysis.`;
      } else if (video.orderNumber === 3 || newTitle.includes('Workshop')) {
        newDescription = `Guided hands-on application of ${cleanTitle}. Follow step-by-step configuration, build, and deployment of production-grade solutions conforming to industry benchmarks.`;
      } else if (video.orderNumber === 4 || newTitle.includes('Case Studies')) {
        newDescription = `Deep-dive case study, edge case resilience, and advanced optimization for ${cleanTitle}. Synthesize your skills with real-world scenarios from ${courseTitle}.`;
      }
      modified = true;
    }

    // Check for French content headers
    if (newContent && (newContent.includes('### Objectifs Pédagogiques') || newContent.includes('### Objectifs du Module') || newContent.includes('### Étude de Cas Réelle'))) {
      const cleanTitle = video.session?.title || 'this topic';
      const courseTitle = video.session?.course?.title || 'the course';

      if (video.orderNumber === 1 || newTitle.includes('Fundamental Principles')) {
        newContent = `### Pedagogical Objectives of the Module
- Master the technical terminology, standard definitions, and cardinal concepts of **${cleanTitle}**.
- Understand the structural foundations governing this domain within the **${courseTitle}** curriculum.
- Identify primary use cases, architectural patterns, and initial operational constraints.

### Core Concepts & Theoretical Models
In this foundational lesson, we analyze the underlying core architecture. Mastering **${cleanTitle}** relies on three essential pillars:
1. **Conceptual Grounding**: Precise scope definition, identifying critical variables, and modeling logical workflows.
2. **Adherence to Industry Standards**: Alignment with modern engineering specifications, compliance frameworks, and ecosystem best practices.
3. **Systemic Interaction**: How this component integrates seamlessly within the overarching processes of *${courseTitle}*.

> **Guiding Principle:** Exceptional technical execution always stems from a rigorous understanding of first principles rather than mechanical memorization of recipes.

### Operational Architecture & Execution Lifecycle
The recommended execution and deployment lifecycle consists of:
- **Initialization Phase**: Requirements validation, parameter scoping, and rigorous input sanitation.
- **Processing Phase**: Domain business rule evaluation and strict isolation of single responsibilities.
- **Verification Phase**: Integrity assurance, end-to-end traceability, and observability monitoring.

### Professional Recommendations & Common Pitfalls to Avoid
- **Classic Pitfall**: Overlooking boundary constraints and edge cases during preliminary modeling.
- **Best Practice**: Systematically document architectural decisions and validate hypotheses using concrete baseline metrics from milestone one.

### Summary & Next Step
You now possess the foundational theoretical groundwork for **${cleanTitle}**. The next lesson delves into advanced methodologies, frameworks, and practical execution models.`;
      } else if (video.orderNumber === 2 || newTitle.includes('Methodologies')) {
        newContent = `### Pedagogical Objectives of the Module
- Deeply evaluate proven engineering frameworks and professional methodologies for **${cleanTitle}**.
- Rationally assess engineering trade-offs (cost, velocity, maintainability, robustness) within **${courseTitle}**.
- Structure a repeatable, evidence-based decision protocol for real-world production environments.

### Methodological Breakdown
The systematic workflow applied to challenges in **${cleanTitle}** unfolds across three structured phases:
- **Phase 1: Diagnosis & Baseline Audit** — Comprehensive mapping of current state, gathering critical specifications, and eliminating potential bottlenecks.
- **Phase 2: Framework Selection** — Choosing the optimal paradigm based on scalability targets, SLAs, and development timelines.
- **Phase 3: Modular Structuring** — Decomposing complex problems into loosely coupled, highly cohesive subsystems.

> **Engineering Maxim:** *"Simplicity is a prerequisite for reliability."* — An elegant architecture minimizes accidental complexity in favor of long-term maintainability.

### Comparative Analysis & Decision Matrix
Throughout **${courseTitle}**, practitioners must navigate trade-offs:
- **Speed vs. Precision**: Agile prototyping for discovery versus verified, battle-tested pipelines for mission-critical deployments.
- **Generality vs. Specialization**: Reusable generic abstractions versus domain-optimized high-performance components.

### Professional Recommendations
- Establish explicit conventions and standards across the engineering team before starting implementation.
- Automate continuous validation so methodological compliance does not depend on sporadic manual discipline.

### Summary & Next Step
With this methodological mastery, you are fully prepared to transition into hands-on implementation in the following workshop.`;
      } else if (video.orderNumber === 3 || newTitle.includes('Workshop')) {
        newContent = `### Workshop Learning Objectives
- Execute an end-to-end implementation of **${cleanTitle}** ready for enterprise deployment.
- Hands-on application of recommended tools, syntax, and configurations within **${courseTitle}**.
- Diagnose, profile, and troubleshoot execution anomalies in real time.

### Step-by-Step Implementation Protocol
Carefully follow these execution steps to deploy the technical solution:

1. **Environment Preparation**:
   - Verify software prerequisites, credentials, and contextual runtime variables.
   - Initialize isolated workspace and manage dependency lifecycles cleanly.

2. **Construction & Assembly**:
   - Assemble primary architectural components according to specifications.
   - Inject defensive control parameters and robust exception handling.

3. **Validation & Quality Assurance**:
   - Execute unit test suites and logical regression verifications.
   - Validate performance output against defined acceptance criteria.

> **Hands-On Tip:** Always test each building block in isolation before full end-to-end integration to localize regressions immediately.

### Common Troubleshooting Scenarios
- **Configuration & Typing Discrepancies**: Always enforce schema contracts and parameter type validation.
- **Dependency Conflicts**: Maintain strict version locks and isolated environments to avoid unintended side effects.

### Technical Synthesis
You have successfully translated the concepts of **${cleanTitle}** into a functional, validated implementation. The final lesson explores real-world case studies and advanced scenarios.`;
      } else if (video.orderNumber === 4 || newTitle.includes('Case Studies')) {
        newContent = `### Advanced Module Objectives
- Analyze a real-world enterprise case study illustrating pivotal challenges in **${cleanTitle}**.
- Anticipate and resolve edge cases, peak concurrency spikes, and system failure modes.
- Formalize a sustainable governance and resilience strategy compliant with **${courseTitle}** standards.

### Real-World Case Study: Analysis & Resolution
Let us examine an industry benchmark scenario encountered by a high-scale enterprise:
- **Initial Challenge**: Facing hyper-growth, the engineering team experienced severe bottlenecks in the operational pipeline of **${cleanTitle}**.
- **Root-Cause Diagnosis**: Tight coupling, lack of automated circuit breakers, and over-reliance on manual interventions.
- **Deployed Solution**: Complete architectural refactoring based on principles covered in this course, introducing automated health checks and comprehensive telemetry.
- **Measurable Outcomes**: 65% reduction in operational incidents, drastic improvement in delivery throughput, and full regulatory audit compliance.

> **Hallmark of Excellence:** In mission-critical environments, system resilience is measured by the ability to gracefully degrade under adverse conditions without downtime.

### Governance Matrix & Risk Management
To ensure enduring stability throughout **${courseTitle}**, adhere to the following core tenets:
- **Auditability**: Maintain immutable, structured audit logs and end-to-end telemetry.
- **Security by Design**: Enforce zero-trust principles across all internal and external data boundaries.
- **Continuous Improvement**: Review operational efficiency metrics and error budgets on a regular cadence.

### Chapter Completion Summary
Congratulations on completing this chapter on **${cleanTitle}** ! You are now fully prepared to take the associated Practice Quiz with high confidence and mastery.`;
      }
      modified = true;
    }

    if (modified) {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          title: newTitle,
          description: newDescription,
          content: newContent,
        },
      });
      updatedCount++;
    }
  }

  console.log(`✅ Successfully updated ${updatedCount} videos to professional English in the database.`);
}

main()
  .catch((err) => {
    console.error('Translation script failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await closePrismaClient();
  });
