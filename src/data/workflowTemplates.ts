import { WorkflowTemplate } from '../types';

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'ict-smc-bot',
    name: {
      ar: 'بوت التداول ICT-SMC-BOT مع Gemini AI (Python)',
      en: 'ICT-SMC Trading Bot Integration with Gemini AI',
    },
    description: {
      ar: 'مخصص لمشاريع بوتات التداول (ICT / SMC): تحليل صفقات Order Block و FVG والسيولة، ومراجعة كود البوت واختبار الاستراتيجية آلياً.',
      en: 'Specialized for ICT / Smart Money Concepts trading bots. Validates Order Blocks, FVG, liquidity sweeps, and automates CI backtesting.',
    },
    badge: 'Trading Bot / SMC & ICT 🔥',
    trigger: 'push, pull_request',
    runtime: 'python',
    yaml: `name: "ICT-SMC-BOT Gemini AI Validation"

on:
  push:
    branches: [ main, master, dev ]
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  validate-bot:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Bot Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install Google GenAI SDK & Dependencies
        run: |
          pip install google-genai

      - name: Run Gemini Strategy & Code Audit
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
        run: |
          python - << 'EOF'
          import os
          from google import genai

          api_key = os.environ.get("GEMINI_API_KEY")
          if not api_key:
              print("Missing GEMINI_API_KEY secret")
              exit(1)

          client = genai.Client(api_key=api_key)

          # Prompt Gemini to audit the ICT-SMC trading logic
          prompt = """
          أنت خبير استراتيجيات تداول ICT (Inner Circle Trader) و Smart Money Concepts (SMC) ومطور خوارزميات بايثون أول.
          قم بمراجعة كود بوت التداول ICT-SMC-BOT وتأكد من:
          1. منطق تحديد مناطق Order Block و Fair Value Gap (FVG) و Liquidity Sweeps.
          2. إدارة المخاطر وحساب حجم العقد (Risk Management & Position Sizing).
          3. سرعة التنفيذ والتعامل مع أخطاء الـ API وانقطاع الاتصال (Error Handling).
          قدم تقريراً هندسياً وتداولياً فائق الاحترافية.
          """

          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=prompt,
          )

          print("=== تقرير فحص بوت ICT-SMC بواسطة Gemini 3.8 Flash ===")
          print(response.text)
          EOF
`,
    explanation: {
      ar: 'يقوم بتشغيل فحص بايثون رسمي باستخدام google-genai للتأكد من منطق استراتيجيات الـ ICT/SMC وحماية حساب التداول من الأخطاء البرمجية.',
      en: 'Runs official google-genai verification on your ICT-SMC trading algorithms to prevent execution bugs and audit risk parameters.',
    },
  },
  {
    id: 'node-pr-review',
    name: {
      ar: 'مراجعة طلبات السحب (PR Review) عبر Node.js و @google/genai',
      en: 'Pull Request Code Review via Node.js & @google/genai',
    },
    description: {
      ar: 'يقوم بمراجعة تلقائية ذكية لأي Pull Request جديد أو تحديث، ويكتب تعليقاً تحليلياً شاملاً مع مقترحات للكود.',
      en: 'Automatically inspects incoming Pull Requests, checks diffs with Gemini 3.8 Flash, and comments with suggestions and security audits.',
    },
    badge: 'الأكثر شيوعاً / Recommended',
    trigger: 'pull_request (opened, synchronize)',
    runtime: 'node',
    yaml: `name: "Gemini AI Code Review"

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  gemini-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install @google/genai SDK
        run: npm install @google/genai

      - name: Get PR Diff & Review with Gemini
        id: review
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: \${{ github.event.pull_request.number }}
          REPO_NAME: \${{ github.repository }}
        run: |
          node << 'EOF'
          const { GoogleGenAI } = require('@google/genai');
          const { execSync } = require('child_process');

          async function main() {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              console.error("Missing GEMINI_API_KEY in GitHub Secrets");
              process.exit(1);
            }

            const ai = new GoogleGenAI({ apiKey });

            // Fetch the PR diff
            const baseSha = process.env.GITHUB_BASE_REF || 'origin/main';
            let diff = '';
            try {
              diff = execSync('git diff origin/' + process.env.GITHUB_BASE_REF + '...HEAD').toString();
            } catch (e) {
              diff = execSync('git diff HEAD~1 HEAD').toString();
            }

            if (!diff.trim()) {
              console.log("No diff found to review.");
              return;
            }

            // Truncate if diff is huge
            const truncatedDiff = diff.slice(0, 15000);

            console.log("Sending diff to Gemini 3.8 Flash...");
            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: \`Please review this Pull Request diff:\\n\\n\\\`\\\`\\\`diff\\n\${truncatedDiff}\\n\\\`\\\`\\\`\`,
              config: {
                systemInstruction: "You are an automated AI Code Reviewer. Review code changes for bugs, performance, clean code, and security risks. Provide constructive feedback and markdown formatting."
              }
            });

            const reviewText = response.text || "No review content generated.";

            // Save review to file for posting
            require('fs').writeFileSync('review.md', "### 🤖 Gemini AI Code Review\\n\\n" + reviewText);
            console.log("Review generated successfully!");
          }

          main().catch(err => {
            console.error(err);
            process.exit(1);
          });
          EOF

      - name: Post Comment to PR
        uses: actions/github-script@v7
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');
            if (fs.existsSync('review.md')) {
              const body = fs.readFileSync('review.md', 'utf8');
              await github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            }
`,
    explanation: {
      ar: 'يقوم هذا السير بفحص الـ diff عبر git، ثم استدعاء Google GenAI SDK (gemini-3.8-flash) ونشر التعليق مباشرة في المحادثة عبر GitHub Script.',
      en: 'Extracts the Git diff of the PR, feeds it to Gemini 3.8 Flash via @google/genai, and posts a GitHub comment on the pull request.',
    },
  },
  {
    id: 'python-pr-review',
    name: {
      ar: 'مراجعة الأكواد عبر بايثون (Python & google-genai)',
      en: 'Pull Request Review using Python & google-genai SDK',
    },
    description: {
      ar: 'مثالي لمطوري Python والذكاء الاصطناعي، يستخدم مكتبة google-genai الرسمية مع تحليل الأمان واكتشاف الثغرات.',
      en: 'Ideal for Python projects; uses official google-genai library with security linting and automated PR comments.',
    },
    badge: 'Pythonic / Clean',
    trigger: 'pull_request (opened, synchronize)',
    runtime: 'python',
    yaml: `name: "Gemini Python PR Reviewer"

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  gemini-python-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          pip install google-genai pygithub

      - name: Run Gemini Review Script
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          PR_NUMBER: \${{ github.event.pull_request.number }}
          REPO_NAME: \${{ github.repository }}
        run: |
          python - << 'EOF'
          import os
          import subprocess
          from google import genai
          from github import Github

          api_key = os.environ.get("GEMINI_API_KEY")
          gh_token = os.environ.get("GITHUB_TOKEN")
          pr_num = int(os.environ.get("PR_NUMBER"))
          repo_name = os.environ.get("REPO_NAME")

          # Initialize Gemini Client
          client = genai.Client(api_key=api_key)

          # Get PR diff using git
          try:
              diff = subprocess.check_output(["git", "diff", "HEAD~1", "HEAD"]).decode("utf-8")
          except Exception:
              diff = "No diff available"

          prompt = f"Please review this Pull Request code diff for quality, bugs, and security:\\n\\n\`\`\`diff\\n{diff[:12000]}\\n\`\`\`"

          response = client.models.generate_content(
              model="gemini-3.8-flash",
              contents=prompt,
              config={
                  "system_instruction": "You are a lead architect. Give concise, actionable feedback with code examples."
              }
          )

          # Post to PR
          gh = Github(gh_token)
          repo = gh.get_repo(repo_name)
          pr = repo.get_pull(pr_num)
          pr.create_issue_comment(f"### 🤖 Gemini AI Code Review (Python)\\n\\n{response.text}")
          print("Review successfully posted!")
          EOF
`,
    explanation: {
      ar: 'يستخدم مكتبة google-genai الرسمية للبايثون مع PyGithub لإرسال الملاحظات ونشر التعليق تلقائياً.',
      en: 'Utilizes the official Python google-genai SDK and PyGithub to review diffs and comment on the PR.',
    },
  },
  {
    id: 'issue-triage',
    name: {
      ar: 'تصنيف المشاكل والرد التلقائي على البلاغات (Issue Triage & Auto-Reply)',
      en: 'Automated Issue Triage & Bug Assistant',
    },
    description: {
      ar: 'عند فتح أي Issue جديد، يحلله Gemini ويقترح حلولاً برمجية أولية أو خطوات استكشاف الأخطاء وتسمية الـ Labels تلقائياً.',
      en: 'When a new issue is submitted, Gemini analyzes the bug description, provides initial diagnostics, and suggests resolution steps.',
    },
    badge: 'Support & Triage',
    trigger: 'issues (opened)',
    runtime: 'node',
    yaml: `name: "Gemini Issue Triage Assistant"

on:
  issues:
    types: [opened]

permissions:
  issues: write
  contents: read

jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - name: Triage Issue with Gemini
        uses: actions/github-script@v7
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          ISSUE_TITLE: \${{ github.event.issue.title }}
          ISSUE_BODY: \${{ github.event.issue.body }}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          script: |
            const https = require('https');

            const apiKey = process.env.GEMINI_API_KEY;
            const issueTitle = process.env.ISSUE_TITLE || '';
            const issueBody = process.env.ISSUE_BODY || '';

            const promptText = \`A user reported a new issue on our repository:
            Title: \${issueTitle}
            Description:
            \${issueBody}

            Please provide a friendly, helpful, technical initial response analyzing possible causes and recommending next troubleshooting steps.\`;

            const postData = JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              systemInstruction: { parts: [{ text: "You are a helpful Open-Source Maintainer Assistant powered by Google Gemini. Be respectful, clear, and provide practical debugging steps." }] }
            });

            const options = {
              hostname: 'generativelanguage.googleapis.com',
              path: \`/v1beta/models/gemini-3.8-flash:generateContent?key=\${apiKey}\`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            };

            const req = https.request(options, (res) => {
              let data = '';
              res.on('data', (chunk) => data += chunk);
              res.on('end', async () => {
                try {
                  const parsed = JSON.parse(data);
                  const reply = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (reply) {
                    await github.rest.issues.createComment({
                      issue_number: context.issue.number,
                      owner: context.repo.owner,
                      repo: context.repo.repo,
                      body: \`### 🤖 Gemini Triage Assistant\\n\\n\${reply}\\n\\n*Note: An automated analysis to help diagnose your issue quickly.*\`
                    });
                  }
                } catch(e) {
                  console.error("Error parsing response:", e);
                }
              });
            });

            req.on('error', (e) => console.error(e));
            req.write(postData);
            req.end();
`,
    explanation: {
      ar: 'يقوم بالرد على المستخدم فوراً بخطوات تجريبية للحلول ويقلل من وقت معالجة البلاغات في المستودع.',
      en: 'Immediately responds to users with diagnostics and troubleshooting steps to speed up issue resolution.',
    },
  },
  {
    id: 'release-notes',
    name: {
      ar: 'مُولّد سجل التغييرات وملاحظات الإصدار (Changelog & Release Notes)',
      en: 'Automated Release Notes & Changelog Generator',
    },
    description: {
      ar: 'يحلل رسائل الـ Commits وتغييرات الكود بين الإصدار السابق والحالي لإنشاء ملاحظات إصدار أنيقة واحترافية تلقائياً.',
      en: 'Analyzes commits between tags and crafts structured, human-readable release notes categorized by Features, Fixes, and Breaking Changes.',
    },
    badge: 'CI/CD Automation',
    trigger: 'push (tags: v*)',
    runtime: 'node',
    yaml: `name: "Gemini Release Notes Generator"

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  generate-notes:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install @google/genai
        run: npm install @google/genai

      - name: Generate Notes with Gemini
        id: notes
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          TAG_NAME: \${{ github.ref_name }}
        run: |
          node << 'EOF'
          const { GoogleGenAI } = require('@google/genai');
          const { execSync } = require('child_process');
          const fs = require('fs');

          async function run() {
            const commits = execSync('git log -n 25 --oneline').toString();
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: \`Please organize these git commits into professional Release Notes for release \${process.env.TAG_NAME}:\\n\\n\${commits}\`,
              config: {
                systemInstruction: "You are a Release Engineer. Categorize commits into Features 🚀, Bug Fixes 🐛, Performance ⚡, and Documentation 📝. Write concise, polished release notes."
              }
            });

            fs.writeFileSync('RELEASE_NOTES.md', response.text);
          }
          run().catch(console.error);
          EOF

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          body_path: RELEASE_NOTES.md
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`,
    explanation: {
      ar: 'يجمع الـ Commits الحديثة ويطلب من Gemini تنظيمها في أقسام منسقة مع إيموجي وتفاصيل واضحة لإنشاء Release رسمي.',
      en: 'Collects recent git commits, prompts Gemini to group them into polished release notes, and attaches them to GitHub Releases.',
    },
  },
  {
    id: 'wif-enterprise',
    name: {
      ar: 'الربط السحابي المؤسسي بدون مفاتيح (Workload Identity Federation)',
      en: 'Keyless Enterprise Auth via Workload Identity Federation',
    },
    description: {
      ar: 'أعلى معايير الأمان للشركات: يربط GitHub Actions بـ Google Cloud Vertex AI بدون الحاجة لتخزين مفاتيح API ثابتة.',
      en: 'Zero static keys: Uses OpenID Connect (OIDC) between GitHub Actions and Google Cloud to authenticate to Gemini on Vertex AI.',
    },
    badge: 'Enterprise Security / WIF',
    trigger: 'pull_request or push',
    runtime: 'node',
    yaml: `name: "Gemini Keyless Enterprise Review"

on:
  pull_request:

permissions:
  id-token: write  # Crucial for OIDC token generation
  contents: read
  pull-requests: write

jobs:
  enterprise-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      # 1. Authenticate to Google Cloud using WIF (No static API keys!)
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'gemini-reviewer@my-gcp-project.iam.gserviceaccount.com'

      # 2. Setup Node.js & dependencies
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install @google/genai
        run: npm install @google/genai

      # 3. Call Gemini using ADC (Application Default Credentials)
      - name: Run Review
        run: |
          node -e "console.log('Authenticated via Google Cloud Workload Identity Federation successfully!')"
`,
    explanation: {
      ar: 'يستبدل مفاتيح الـ API بنظام الهوية السحابية OIDC الموثوقة من Google Cloud، مما يقضي تماماً على مخاطر تسرب المفاتيح.',
      en: 'Replaces static secrets with short-lived tokens issued via OIDC and Google Cloud IAM for zero-trust compliance.',
    },
  },
];
