// Deep per-lab guides for the PM track. Each expands the matching lab card
// into a full "Start the lab" panel.

export const labGuides = {
  "pm-lab-operating-principles": {
    quickStart:
      "Open a blank Notion page. Write 5 product decisions you've watched go wrong. The principles are the inverse of what failed.",
    prerequisites: [
      { label: "30 minutes of uninterrupted thinking time" },
      { label: "Memory of 3-5 product decisions you witnessed (good or bad)" },
      { label: "A public-facing place to host one page (Notion / Super / GitHub Pages)" },
    ],
    starter: {
      description:
        "Start with a blank page and a list of 'mistakes I've watched'. The principles emerge from the mistakes — that's the whole exercise. Don't start with platitudes.",
      commands: [
        "# pick one of these to host:",
        "# - Notion → Share → Publish to web",
        "# - GitHub → new public repo with index.md",
        "# - Personal site → /principles",
      ],
    },
    walkthrough: [
      {
        title: "1. Inventory the mistakes",
        body:
          "List 5-7 product decisions you've watched go wrong. Be specific: 'Team built X without talking to Y, and Z happened'. Vague entries produce vague principles.",
      },
      {
        title: "2. Convert each mistake into a principle",
        body:
          "For each mistake, write the rule that would have prevented it. The principle should be opinionated and falsifiable. 'Be customer-centric' is not a principle. 'Every spec includes a non-goals section' is.",
      },
      {
        title: "3. Cut to 5-7 principles",
        body:
          "More than 7 and nothing is a principle. Less than 5 and you haven't done the work. Order them by how often they'd come up in your week.",
        checkpoint: "If a peer can't predict your decision in a hypothetical from your principles, they're too vague.",
      },
      {
        title: "4. Add the earned story",
        body:
          "Under each principle, write 1-2 lines about the situation that taught it to you. This is what makes the page yours instead of a remix of Cagan and Doshi.",
      },
      {
        title: "5. Publish",
        body:
          "Make it public. Share with one PM you respect for feedback. Don't wait for it to feel done.",
      },
    ],
    gotchas: [
      "Generic principles ('listen to the customer') are noise. If 90% of PMs would write the same thing, cut it.",
      "Don't list more than 7. The point is to constrain you when you're tired.",
      "Resist the urge to make it long. Senior PMs read 1 page. Recruiters read 5 lines.",
    ],
    verifyBy: [
      "A peer reads the page in under 2 minutes and can predict how you'd handle a hypothetical.",
      "Each principle is opinionated enough that some PMs would disagree with it.",
      "Every principle ties to a specific lived situation.",
    ],
    linkedResourceIds: [
      "horowitz-good-bad-pm",
      "ravi-mehta-top-1",
      "doshi-the-pm-stack",
    ],
  },

  "pm-lab-discovery-interviews": {
    quickStart:
      "Pick a real product (yours or one you use daily). Recruit 5 users from Reddit / your network. Schedule 30 min each. Use the Mom Test rules. Done in two weeks.",
    prerequisites: [
      { label: "A product to interview about (yours, your employer's, or one you use)" },
      { label: "Recording + transcription tool", note: "Otter, Granola, Fireflies, or Zoom built-in" },
      { label: "A target customer segment you can plausibly reach" },
    ],
    starter: {
      description:
        "Avoid the 'I'll write the questions first' trap — write the goals and let the questions follow. Use Teresa Torres' opportunity solution tree as your synthesis target.",
      commands: [
        "# recruiting cheat-sheet:",
        "# - Reddit DMs (be specific to a niche subreddit, not /r/productmanagement)",
        "# - LinkedIn posts in your network",
        "# - Existing customers (highest signal — ask CS team)",
        "# offer: 30 min, you ask, they talk; nothing to sell",
      ],
    },
    walkthrough: [
      {
        title: "1. Define the question your interviews must answer",
        body:
          "Not 'do users like our product' — that's untestable. Try: 'When users hire X, what other tools do they hire it alongside, and where does our flow break the chain?' One sharp question.",
      },
      {
        title: "2. Recruit 5 real users",
        body:
          "Niche subreddit DMs work better than generic LinkedIn. Existing customers are gold — ask your CS team. Promise 30 min, no sales pitch, recording with their consent.",
      },
      {
        title: "3. Run the interviews — Mom Test rules",
        body:
          "Ask about specific past behavior, not opinions or hypotheticals. 'Tell me about the last time you tried to X' beats 'Would you use a feature that does Y'. When they generalize, ask for the most recent specific example.",
        checkpoint: "If you wrote down a 'great idea for the product' during an interview, you talked too much.",
      },
      {
        title: "4. Transcribe + tag",
        body:
          "Get verbatim transcripts. Highlight quotes by theme. Don't paraphrase — paraphrasing is where bias enters.",
        code: "# Otter / Granola / Fireflies all do this; Zoom's built-in transcript is fine.\n# Tag with simple labels: PAIN, WORKAROUND, JOB, BLOCKER, EMOTION.",
        language: "bash",
      },
      {
        title: "5. Build the opportunity solution tree",
        body:
          "Outcome at the top. Opportunities (the user pains you saw) below. Solutions (your hypotheses) below those. Pick exactly ONE bet to validate next. The 'pick one' is the hardest and most important step.",
      },
    ],
    gotchas: [
      "Leading questions ('would you pay for X?') invalidate the interview. Watch for them in the transcript.",
      "Don't pitch. The moment you pitch, the user becomes polite, and politeness is noise.",
      "Five interviews is the floor for pattern detection. Two is anecdote.",
    ],
    verifyBy: [
      "Every opportunity in your tree cites a verbatim quote from a transcript.",
      "You picked exactly one bet to validate next (not three, not zero).",
      "A peer reading your synthesis can name the user pain in their own words.",
    ],
    linkedResourceIds: [
      "torres-product-talk",
      "mom-test",
      "torres-opportunity-tree",
      "moesta-jtbd",
    ],
  },

  "pm-lab-strategy-narrative": {
    quickStart:
      "Pick one product you know cold (yours or a famous one). Write the Andy Raskin five-act narrative on one page. Test it on a non-PM friend.",
    prerequisites: [
      { label: "A product you understand deeply enough to argue about" },
      { label: "1-2 hours of focus" },
      { label: "Read Aggregation Theory and Sequoia's business plan template first" },
    ],
    starter: {
      description:
        "The five acts: shift in the world → enemy → promised land → magic capability → evidence. Write each in 1-3 sentences. The 'name the enemy' move is the hardest and the most clarifying.",
    },
    walkthrough: [
      {
        title: "1. Pick the product and the audience",
        body:
          "Strategy without an audience is wishful thinking. Are you pitching to a CEO, to engineering, to investors? Each gets a slightly different cut.",
      },
      {
        title: "2. Name the shift",
        body:
          "What changed in the world that makes this product newly possible? AI, distribution, regulation, demographics — pick one. Be specific to a year.",
      },
      {
        title: "3. Name the enemy",
        body:
          "What old way of doing things is your product against? 'Spreadsheets', 'agencies', 'the old workflow'. Make it specific enough that supporters of the enemy would push back.",
        checkpoint: "If your enemy is 'inefficiency' or 'manual work', go again. Vague enemies = vague strategy.",
      },
      {
        title: "4. Describe the promised land",
        body:
          "What does the world look like once your product wins? Not features — outcomes. The team a customer can run, the work they no longer do.",
      },
      {
        title: "5. Magic + evidence",
        body:
          "What's the unfair capability that makes the promised land reachable? What evidence (early users, data, demos) proves you're not lying? Cut every adverb.",
      },
    ],
    gotchas: [
      "If your strategy works for any company in your category, it's not a strategy.",
      "If the 'enemy' is everyone-else, the doc is marketing fluff. Pick a specific old way.",
      "1 page or it doesn't count. People will read 1 page and skim 3.",
    ],
    verifyBy: [
      "A non-PM friend can summarize the strategy back in their words after one read.",
      "A peer playing skeptic can argue against your strategy with specifics, not handwaves.",
      "You can defend why this strategy isn't right for a different company in the same market.",
    ],
    linkedResourceIds: [
      "stratechery-aggregation",
      "sequoia-business-plan",
      "first-round-narrative",
      "cagan-product-strategy",
    ],
  },

  "pm-lab-now-next-later": {
    quickStart:
      "Open a doc. Three columns: Now / Next / Later. Add a fourth: 'Killed ideas'. The killed list is what you'll be judged on.",
    prerequisites: [
      { label: "Backlog or candidate ideas (50+ is normal)" },
      { label: "A North Star + 2-3 input metrics for your product" },
      { label: "A prioritization framework you've actually defended (RICE, LNO, ICE)" },
    ],
    starter: {
      description:
        "Now/Next/Later beats quarterly Gantt charts because it forces you to commit to sequence without committing to dates. The 'why not' list is where senior PMs separate from junior PMs.",
    },
    walkthrough: [
      {
        title: "1. Brain-dump every candidate idea",
        body:
          "Pull from CS tickets, sales asks, leadership wishes, your own theories. Don't filter yet. The list should embarrass you with how long it is.",
      },
      {
        title: "2. Score the top 20",
        body:
          "Pick a framework (RICE, LNO). Score honestly. Use the same framework consistently. Show your math.",
        code: "// example: RICE columns\nidea | reach | impact | confidence | effort | RICE",
        language: "text",
      },
      {
        title: "3. Cut to Now / Next / Later",
        body:
          "Now = this quarter, fully scoped. Next = next quarter, sketch only. Later = 'we believe but haven't sized'. If Now has more than 3 items, cut.",
        checkpoint: "If 'Now' has 5+ items, you're going to ship none of them well.",
      },
      {
        title: "4. Write the 'killed' list",
        body:
          "Pick the bottom 30% of your scored list. Write 1 sentence per killed item explaining why. Be specific. 'Low impact' is not a reason; 'expected reach <500 users this year' is.",
      },
      {
        title: "5. Defend it in front of a skeptic",
        body:
          "Have a peer ask 'why not X' for 5 random items. If you can't answer in 30 seconds, your reasoning isn't durable.",
      },
    ],
    gotchas: [
      "Avoid timeline commitments inside Now/Next/Later — that's why this format exists.",
      "If your killed list is short or vague, you didn't do the work — you just hid the rejected ideas.",
      "Stakeholder asks should be on the list, not silently dismissed. Naming them is half the politics.",
    ],
    verifyBy: [
      "Now has ≤3 items.",
      "Every Now item has a metric, a customer evidence link, and an effort estimate.",
      "The killed list has at least 10 items, each with a one-sentence reason.",
    ],
    linkedResourceIds: [
      "intercom-rice",
      "doshi-eng-effort-trap",
      "cost-of-delay",
      "kano-model",
    ],
  },

  "pm-lab-real-prd": {
    quickStart:
      "Pick a feature. Open the Lenny PRD template collection. Use the Stripe one as a starting point. Cut whatever doesn't apply.",
    prerequisites: [
      { label: "A real feature (yours or pretend) to write about" },
      { label: "A doc tool (Notion / Coda / Google Docs) with comments" },
      { label: "An engineer or peer willing to redline the doc" },
    ],
    starter: {
      description:
        "PRDs are read by engineers, designers, and the future-you who picks this up after a vacation. Write for those three audiences. The 'non-goals' section is where most PRDs are weakest.",
    },
    walkthrough: [
      {
        title: "1. Problem, in two sentences",
        body:
          "Who has the problem, what specifically goes wrong, what does it cost. No solution language yet. If you can't write it in two sentences, the problem isn't sharp enough.",
      },
      {
        title: "2. Goals + non-goals",
        body:
          "Goals: 2-4 outcomes you're optimizing for. Non-goals: 3-5 things this PRD explicitly does NOT do. Non-goals prevent scope creep more than any other section.",
      },
      {
        title: "3. Design intent",
        body:
          "Embed wireframes or sketches. Describe the user flow in plain text. The intent is what designers riff on; pixel-perfection is their job, not yours.",
      },
      {
        title: "4. Risks + open questions",
        body:
          "Technical, UX, business. Add model risk if AI. Naming risks is what builds trust with engineers — the PMs who pretend there are no risks lose credibility within one cycle.",
        checkpoint: "If your risk list is empty, you haven't thought hard enough.",
      },
      {
        title: "5. Rollout + metrics + FAQ",
        body:
          "Define rollout gates (% of users, kill switch, rollback path). Define success metrics + 2 guardrails. Pre-write the FAQ — the questions you know will come up.",
      },
    ],
    gotchas: [
      "If the engineer redline reveals 'where does this data come from' — your PRD is weak. Add a data section.",
      "Non-goals must be specific. 'We're not redesigning everything' is vague; 'We're not changing the X flow this PRD' is non-vague.",
      "Don't write a 10-page PRD for a 2-day feature. Match weight to scope.",
    ],
    verifyBy: [
      "An engineer reviewer finds no critical ambiguity.",
      "A designer can sketch the flow without asking a single clarifying question.",
      "A future PM picking this up cold understands the goals and non-goals.",
    ],
    linkedResourceIds: [
      "shape-up",
      "lenny-prd-template",
      "cagan-product-spec",
      "lethain-engineering-pm",
    ],
  },

  "pm-lab-funnel-retention": {
    quickStart:
      "Use Amplitude's free sample dataset (or your own). Plot the activation funnel. Plot retention curves. One sharp recommendation. Done in a weekend.",
    prerequisites: [
      { label: "Access to data — Amplitude / Mixpanel / a CSV / your own product" },
      { label: "Comfort with pivot tables or SQL (one or the other)" },
      { label: "1-2 hours uninterrupted to do the actual analysis" },
    ],
    starter: {
      description:
        "Don't try to build a perfect dashboard. Build the smallest analysis that produces one defendable recommendation. That's the entire point.",
      commands: [
        "# Amplitude has a free sample dataset of an e-commerce app.",
        "# Mixpanel has a free demo project too.",
        "# If you have a real product, pull last 90 days, anonymize, work in a notebook.",
      ],
    },
    walkthrough: [
      {
        title: "1. Define the activation event",
        body:
          "What does it mean for a user to be 'activated' in your product? Specific event, specific window. (Example: 'creates and shares first project within 7 days of signup'.)",
      },
      {
        title: "2. Plot the funnel",
        body:
          "Steps from signup to activation. % drop at each step. Find the worst step. Note: the worst step is rarely the last step.",
      },
      {
        title: "3. Plot retention curves",
        body:
          "1-day, 7-day, 30-day retention by signup cohort. Look for the smile curve (the point where retention flattens). If it doesn't flatten, you don't have product-market fit yet.",
        checkpoint: "If retention drops to 0 by week 4, no growth tactic will save you. Fix retention first.",
      },
      {
        title: "4. Form one hypothesis",
        body:
          "Why is the worst funnel step the worst? Be specific. 'Users don't understand X', 'Users hit error Y', 'Users are wrong segment for Z'. The hypothesis must be testable.",
      },
      {
        title: "5. Specify the experiment",
        body:
          "What change would you A/B test to validate the hypothesis? Define the metric, the MDE, the sample size, and the kill condition.",
      },
    ],
    gotchas: [
      "Don't average across cohorts — early cohorts and late cohorts behave differently. Always look by cohort.",
      "Avoid 'survivorship retention' — looking only at users who came back. Always include the full denominator.",
      "If your activation event is too soft (e.g., 'visited the homepage'), retention will look great and mean nothing.",
    ],
    verifyBy: [
      "Funnel chart with absolute numbers and % at each step.",
      "Retention curve broken down by cohort, with the smile point identified.",
      "One specific hypothesis tied to one specific funnel/retention finding.",
    ],
    linkedResourceIds: [
      "amplitude-north-star",
      "andrew-chen-archive",
      "casey-winters-blog",
      "balfour-growth-loops",
    ],
  },

  "pm-lab-experiment-plan": {
    quickStart:
      "Use Evan Miller's sample size calculator. Pre-write the analysis template. Define guardrails BEFORE you launch.",
    prerequisites: [
      { label: "A feature change you're considering" },
      { label: "A primary metric and at least 2 guardrail metrics in mind" },
      { label: "Knowledge of your baseline conversion rate" },
    ],
    starter: {
      description:
        "The most common A/B test failure isn't statistics — it's running tests on changes that have no chance of moving the metric. Power analysis up front saves you from this.",
      commands: [
        "# Evan Miller's free calculator — bookmark it:",
        "# https://www.evanmiller.org/ab-testing/sample-size.html",
      ],
    },
    walkthrough: [
      {
        title: "1. Hypothesis statement",
        body:
          "Format: 'If we change X, we expect Y to move because Z'. The 'because Z' is the part most teams skip — and it's the part that tells you whether to run the test at all.",
      },
      {
        title: "2. Compute the MDE you can detect",
        body:
          "Given your traffic and baseline rate, what's the minimum lift you can detect with 80% power, 95% confidence? If your MDE is 10% but realistic features move metrics 1-2%, you can't run this test.",
        code: "# inputs to a sample size calculator:\n# - baseline rate (e.g., 8% conversion)\n# - desired MDE (e.g., 5% relative)\n# - significance (95%) and power (80%)\n# output: sample size per variant",
        language: "text",
      },
      {
        title: "3. Define metrics — primary, secondary, guardrails",
        body:
          "Primary: the one metric you're moving. Secondary: 2 metrics you'd love to see move but won't decide on. Guardrails: 2 metrics you do NOT want to break.",
      },
      {
        title: "4. Pre-write the kill condition",
        body:
          "Before you launch: 'If guardrail metric X drops more than Y%, we kill the test'. Write it. Get sign-off. Don't skip — this is the rule that makes A/B testing safe.",
        checkpoint: "If you can't define a kill condition, you don't understand your guardrails well enough.",
      },
      {
        title: "5. Pre-write the analysis template",
        body:
          "What charts will you produce? What table? What will count as a 'win', a 'flat', a 'kill'? Pre-writing this is what stops you p-hacking when results come in.",
      },
    ],
    gotchas: [
      "Peeking at results mid-test inflates false positives. Don't.",
      "Novelty effects are real — measure week-over-week to detect them.",
      "Sample size based on weekly traffic, not daily. Weekday/weekend mixes are different users.",
    ],
    verifyBy: [
      "Pre-launch doc has hypothesis, MDE, sample size, primary/secondary/guardrail metrics, kill condition.",
      "Template for post-test analysis is filled out (with placeholders).",
      "Engineering and stakeholder sign-off on the kill condition is in writing.",
    ],
    linkedResourceIds: [
      "kohavi-online-experiments",
      "lenny-ab-mistakes",
      "amplitude-north-star",
    ],
  },

  "pm-lab-ai-feature-spec": {
    quickStart:
      "Pick the smallest possible AI feature. Write the spec. Build the 30-case eval set in a CSV. The eval set is the artifact most PMs skip — that's why this is the lab.",
    prerequisites: [
      { label: "An AI feature you understand (or want to design)" },
      { label: "Read 'Building Effective Agents' from Anthropic first" },
      { label: "Familiarity with at least one model provider's API" },
    ],
    starter: {
      description:
        "AI features are different from CRUD features in two ways: outputs aren't deterministic, and risk surface is wider. The spec must address both. The eval set is your regression net.",
      commands: [
        "# repo skeleton suggestion:",
        "# /spec.md  -- the PRD",
        "# /evals/cases.csv  -- the 30 cases",
        "# /risks.md  -- model risk doc",
        "# /monitoring.md  -- production signals",
      ],
    },
    walkthrough: [
      {
        title: "1. Pick the smallest defensible scope",
        body:
          "Not 'an AI assistant'. Try 'rewrite a 3-sentence email reply in our brand voice'. Narrow scope makes evals possible. Wide scope makes the feature un-evaluable.",
      },
      {
        title: "2. Write the spec",
        body:
          "Same shape as a normal PRD: problem, goals, non-goals, design intent. Add an 'AI scope' section: prompt sketch, model choice rationale, fallback behavior, refusal rules.",
      },
      {
        title: "3. Build the eval set",
        body:
          "30 cases minimum. Cover happy path (15), edge cases (10), adversarial (5). For each: input, expected behavior, pass/fail rule. CSV is fine.",
        code: "# eval row schema:\n# id, category, input, expected_behavior, pass_rule, notes",
        language: "text",
      },
      {
        title: "4. Pick deterministic checks where possible",
        body:
          "Schema validation, format checks, refusal-when-needed checks — all deterministic. Use LLM-as-judge only where genuine judgment is required (tone, faithfulness, etc.). Calibrate the judge.",
        checkpoint: "If 100% of your evals are LLM-judged, your eval set is a vibe.",
      },
      {
        title: "5. Model risk + monitoring",
        body:
          "List the risks: prompt injection, hallucination, cost spike, latency. For each, define a mitigation and a monitoring signal. Add a kill switch the on-call engineer can flip.",
      },
    ],
    gotchas: [
      "Don't write the eval set after launch. Write it before you write the prompt.",
      "Adversarial cases matter more than they seem. 5 of them is a floor, not a ceiling.",
      "If your monitoring relies on user complaints, you'll find out about failures from your CEO instead.",
    ],
    verifyBy: [
      "30+ eval cases, mix of deterministic and judge-based.",
      "Risk doc covers prompt injection, hallucination, cost, and latency with mitigations.",
      "An engineer reviewer agrees the kill switch and monitoring plan are operable.",
    ],
    linkedResourceIds: [
      "anthropic-effective-agents",
      "applied-llms-pm",
      "aakash-ai-pm",
      "karpathy-software-3",
    ],
  },

  "pm-lab-portfolio": {
    quickStart:
      "Open a Notion site (or Super, or Cargo). Three case studies. Each follows: context → bet → outcome → reflection. Use Growth.design as the format model.",
    prerequisites: [
      { label: "Three artifacts to feature (real or from earlier labs)" },
      { label: "A simple hosting solution — Notion / Super / GitHub Pages / Webflow" },
      { label: "Optional but valuable: a domain name (yourname.com)" },
    ],
    starter: {
      description:
        "The portfolio site is the single highest-leverage interview asset for PM roles. Recruiters skim it before they ever read your resume. Make the first 5 seconds count.",
    },
    walkthrough: [
      {
        title: "1. Pick your three artifacts",
        body:
          "Mix of: a discovery artifact (interviews / opportunity tree), an execution artifact (PRD / case study), and a measurement artifact (funnel analysis / experiment plan).",
      },
      {
        title: "2. Write each as: context → role → bet → outcome → reflection",
        body:
          "Context (what was happening), role (what you did vs the team), bet (the risky decision), outcome (what happened, including failures), reflection (what you'd change). The reflection is what separates senior from junior.",
      },
      {
        title: "3. Use Growth.design's format as the visual model",
        body:
          "Their teardowns: short paragraphs, big visuals, callouts in the margin, plain language. Don't reinvent the format — borrow.",
        checkpoint: "If you can't summarize each case study in one tweet, the writing is too long.",
      },
      {
        title: "4. Build the index page",
        body:
          "Above the fold: name, role you want, link to each case study. Below: 1-line bio, 'currently doing', contact. That's it. No skills word cloud. No 'about me' essay.",
      },
      {
        title: "5. Distribute",
        body:
          "Add to LinkedIn 'featured' section. Add to email signature. Send to 3 PMs you respect for honest feedback. Iterate. Don't wait for it to feel done before sharing.",
      },
    ],
    gotchas: [
      "Don't write 5 case studies. Three sharp ones beats five mediocre ones.",
      "If you can't get permission for confidential work, fictionalize the company name and metrics — recruiters care about your thinking, not the brand.",
      "Avoid jargon. Recruiters are not PMs. The first 5 seconds determine whether you make the screen.",
    ],
    verifyBy: [
      "Three case studies, each readable in under 4 minutes.",
      "Each ends with a 'what I'd change' reflection.",
      "Three PMs you respect have read it and given feedback you've incorporated.",
    ],
    linkedResourceIds: [
      "apm-list",
      "cracking-pm-interview",
      "growth-design-cases",
      "ravi-mehta-top-1",
    ],
  },
};
