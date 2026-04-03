/**
 * AI Page Generator
 * Calls OpenRouter 3 times: idea → plan → code
 * Saves the result to src/generated/<date>/index.jsx
 * Updates manifest.json and registry.js automatically
 *
 * Usage: npm run generate
 * Requires: OPENROUTER_API_KEY in .env
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.join(ROOT, 'src', 'generated');
const MANIFEST_PATH = path.join(GENERATED_DIR, 'manifest.json');
const REGISTRY_PATH = path.join(GENERATED_DIR, 'registry.js');

// ─── Config ────────────────────────────────────────────────────────────────

const API_KEY = process.env.OPENROUTER_API_KEY;

// Primary model — paid, best results
const MODEL_PRIMARY = 'anthropic/claude-sonnet-4.6';
// Fallback — free tier, no billing required
const MODEL_FALLBACK = process.env.OPENROUTER_MODEL_FALLBACK || 'openrouter/free';

if (!API_KEY) {
  console.error('\n  ✗ Missing OPENROUTER_API_KEY\n');
  console.error('  1. Copy .env.example to .env');
  console.error('  2. Add your key from https://openrouter.ai/keys\n');
  process.exit(1);
}

// ─── OpenRouter client ─────────────────────────────────────────────────────

async function chatWithModel(model, systemPrompt, userPrompt, temperature) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/ai-sketchbook',
      'X-Title': 'AI Sketchbook',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${body}`);
  }

  const data = await res.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Empty response from model: ' + JSON.stringify(data));
  }

  return data.choices[0].message.content;
}

// Try primary model, fall back to free model on any error
async function chat(label, systemPrompt, userPrompt, temperature = 0.9) {
  try {
    const result = await chatWithModel(MODEL_PRIMARY, systemPrompt, userPrompt, temperature);
    process.stdout.write(` [claude-sonnet-4-6]`);
    return result;
  } catch (err) {
    process.stdout.write(` [sonnet failed: ${err.message.slice(0, 60)}... → fallback]`);
    const result = await chatWithModel(MODEL_FALLBACK, systemPrompt, userPrompt, temperature);
    process.stdout.write(` [${MODEL_FALLBACK}]`);
    return result;
  }
}

// ─── Step 1: Idea ──────────────────────────────────────────────────────────

async function generateIdea(manifest) {
  const historyText = manifest.length > 0
    ? `PREVIOUSLY GENERATED IDEAS — do not repeat these concepts:\n${manifest.map((p, i) =>
        `${i + 1}. [${p.date}] "${p.title}": ${p.idea}`
      ).join('\n')}`
    : 'No previous ideas yet. Go wild.';

  const system = `You are the head curator of the Museum of Digital Oddities — a deranged, inspired creative director who generates concepts for single-page web experiences that are weird, surreal, uncanny, funny, absurd, and mind-bending.

Each idea must be:
- A small, self-contained interactive or animated single-page experience
- Implementable in a single React component using only React hooks and inline styles
- Genuinely strange and surprising, not just "slightly quirky"
- Interactive where possible — give the user something to click, hover, type, or trigger

FORBIDDEN CONCEPTS:
- Dashboards, admin panels, CRUD interfaces, auth flows
- Productivity tools, timers, todo lists, note apps
- Startup landing pages, portfolios, e-commerce
- Anything "useful" in a conventional sense

ENCOURAGED TERRITORY:
- Broken/glitched UIs that have achieved sentience
- Absurdist simulations of mundane things taken too far
- Interactive nonsense toys with no purpose
- Strange generators (of text, shapes, experiences, feelings)
- Reality-warping mini-games with surreal rules
- Uncanny digital artifacts from alternate internet timelines
- Experiences that make the user question what they just did

Respond with ONLY a valid JSON object — no markdown, no explanation, no code fences:
{
  "title": "Short punchy title (max 6 words)",
  "description": "One sentence — what the user actually experiences on the page",
  "idea": "2-4 sentences describing the concept, what makes it weird, and why it works"
}`;

  const user = `${historyText}

Generate a new, completely unique page idea that is nothing like any of the previous ones.`;

  const raw = await chat('idea', system, user);

  const match = raw.match(/\{[\s\S]*}/);
  if (!match) {
    throw new Error('Could not extract JSON from idea response:\n' + raw);
  }

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    throw new Error('Invalid JSON in idea response:\n' + match[0]);
  }
}

// ─── Step 2: Plan ──────────────────────────────────────────────────────────

async function generatePlan(idea) {
  const system = `You are a minimal, pragmatic frontend architect. Given a weird web page concept, you produce a terse implementation plan for a single self-contained React component.

The component constraints:
- Imports ONLY from 'react' (useState, useEffect, useRef, useCallback, useMemo)
- Uses ONLY inline styles — no className with external CSS, no Tailwind, no styled-components
- No external libraries, no fetch calls, no localStorage (unless critical to the concept)
- Must be entirely self-contained

Respond with ONLY a valid JSON object — no markdown, no explanation:
{
  "title": "Same title as the idea",
  "state_variables": ["list of useState variables with brief description"],
  "effects": ["list of useEffect behaviors"],
  "key_interactions": ["user interactions to implement"],
  "visual_style": "Brief description — color palette, aesthetic, mood",
  "key_implementation_notes": "Critical technical decisions (2-4 sentences)"
}`;

  const user = `Create a minimal implementation plan for this page:

Title: ${idea.title}
Description: ${idea.description}
Concept: ${idea.idea}`;

  const raw = await chat('plan', system, user, 0.7);

  const match = raw.match(/\{[\s\S]*}/);
  if (!match) {
    throw new Error('Could not extract JSON from plan response:\n' + raw);
  }

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    throw new Error('Invalid JSON in plan response:\n' + match[0]);
  }
}

// ─── Step 3: Code ──────────────────────────────────────────────────────────

async function generateCode(idea, plan) {
  const system = `You are an expert React developer who specializes in building weird, experimental, creative single-page experiences.

STRICT RULES — violating any of these will cause a build failure:
1. The file must start with import statements
2. Only import from 'react' — e.g.: import { useState, useEffect, useRef } from 'react';
3. The default export must be: export default function Page() { ... }
4. Use ONLY inline styles (style={{ ... }}) — zero className attributes with external CSS
5. For CSS animations/keyframes, inject a <style> tag directly in JSX
6. No external API calls, no fetch, no libraries beyond react
7. The component must be genuinely interactive and visually interesting
8. Make the weirdness functional — it should actually DO the weird thing

OUTPUT FORMAT: raw JSX/JS code only. No markdown. No code fences (\`\`\`). No explanation. Start immediately with the import line.`;

  const user = `Generate the complete React component for this page.

IDEA:
Title: ${idea.title}
Description: ${idea.description}
Concept: ${idea.idea}

PLAN:
State: ${plan.state_variables?.join(', ') || 'as needed'}
Effects: ${plan.effects?.join('; ') || 'as needed'}
Interactions: ${plan.key_interactions?.join(', ') || 'as needed'}
Visual style: ${plan.visual_style || 'dark, strange'}
Notes: ${plan.key_implementation_notes || ''}

Remember: export default function Page() — imports from react only — inline styles only.`;

  return await chat('code', system, user, 0.85);
}

// ─── Code cleaning ─────────────────────────────────────────────────────────

function cleanCode(raw) {
  let code = raw.trim();

  // Strip markdown code fences
  code = code.replace(/^```(?:jsx?|tsx?|javascript|typescript|react)?\s*\n?/i, '');
  code = code.replace(/\n?```\s*$/i, '');

  // Strip leading explanation text before the first import/export
  const importStart = code.search(/^import\s/m);
  if (importStart > 0) {
    code = code.slice(importStart);
  }

  // Fix: remove any non-react imports (e.g. `import style from 'style'`)
  code = code.replace(/^import\s+.*from\s+['"](?!react['"/]).*['"];?\n?/gm, '');

  // Fix: `const Page = export default function Page()` → `export default function Page()`
  code = code.replace(/const\s+\w+\s*=\s*(export\s+default\s+function)/g, '$1');

  // Fix: `export const Page = function()` or `export default Page` at end without inline def
  // Normalize to a clean export default function Page
  code = code.replace(/export\s+default\s+function\s+\w+\s*\(/, 'export default function Page(');

  return code.trim();
}

function validateCode(code) {
  const errors = [];

  if (!code.includes('export default')) {
    errors.push('Missing "export default"');
  }
  if (!code.includes('function Page')) {
    errors.push('Missing "function Page"');
  }
  if (code.includes("from '") && !code.match(/from\s+['"]react['"]/)) {
    // Has non-react imports (might be fine if they're all from react subpaths, flag as warning)
    const nonReactImports = [...code.matchAll(/from\s+['"]([^'"]+)['"]/g)]
      .map(m => m[1])
      .filter(m => !m.startsWith('react'));
    if (nonReactImports.length > 0) {
      errors.push(`Non-react imports detected: ${nonReactImports.join(', ')} — these may fail to build`);
    }
  }

  return errors;
}

// ─── Registry regeneration ─────────────────────────────────────────────────

function regenerateRegistry(manifest) {
  if (manifest.length === 0) {
    return `// AUTO-GENERATED — do not edit by hand\n// Run: npm run generate\n\nexport const registry = {};\n`;
  }

  const lines = ['// AUTO-GENERATED — do not edit by hand', '// Run: npm run generate', ''];

  for (const page of manifest) {
    const varName = `Page_${page.date.replace(/-/g, '_')}`;
    lines.push(`import ${varName} from './${page.date}/index.jsx';`);
  }

  lines.push('');
  lines.push('export const registry = {');
  for (const page of manifest) {
    const varName = `Page_${page.date.replace(/-/g, '_')}`;
    lines.push(`  '${page.date}': ${varName},`);
  }
  lines.push('};');
  lines.push('');

  return lines.join('\n');
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  // Determine target date (today, or pass a date as argument)
  const targetDate = process.argv[2] || new Date().toISOString().split('T')[0];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
    console.error(`Invalid date format: ${targetDate}. Use YYYY-MM-DD.`);
    process.exit(1);
  }

  // Load manifest
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  // Check for existing page on this date
  const existing = manifest.find(p => p.date === targetDate);
  if (existing) {
    console.log(`\n  Page already exists for ${targetDate}: "${existing.title}"`);
    console.log('  To regenerate, remove its entry from src/generated/manifest.json\n');
    process.exit(0);
  }

  console.log(`\n  Generating page for ${targetDate}\n`);
  console.log(`  Primary: ${MODEL_PRIMARY}`);
  console.log(`  Fallback: ${MODEL_FALLBACK}\n`);

  // Step 1: Idea
  process.stdout.write('  [1/3] Generating idea... ');
  const idea = await generateIdea(manifest);
  console.log(`✓  "${idea.title}"`);
  console.log(`       ${idea.description}`);

  // Step 2: Plan
  process.stdout.write('  [2/3] Generating plan... ');
  const plan = await generatePlan(idea);
  console.log('✓');

  // Step 3: Code
  process.stdout.write('  [3/3] Generating code... ');
  const rawCode = await generateCode(idea, plan);
  const code = cleanCode(rawCode);
  console.log('✓');

  // Validate
  const errors = validateCode(code);
  if (errors.length > 0) {
    console.warn('\n  ⚠ Code validation warnings:');
    errors.forEach(e => console.warn(`    - ${e}`));
    console.warn('  Saving anyway — check the file if the build fails.\n');
  }

  // Save page file
  const pageDir = path.join(GENERATED_DIR, targetDate);
  fs.mkdirSync(pageDir, { recursive: true });
  const pagePath = path.join(pageDir, 'index.jsx');
  fs.writeFileSync(pagePath, code);

  // Update manifest
  manifest.push({
    date: targetDate,
    title: idea.title,
    description: idea.description,
    idea: idea.idea,
    plan,
  });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  // Regenerate registry
  fs.writeFileSync(REGISTRY_PATH, regenerateRegistry(manifest));

  console.log(`\n  ✓ Saved to src/generated/${targetDate}/index.jsx`);
  console.log(`  ✓ Updated manifest.json (${manifest.length} total pages)`);
  console.log(`  ✓ Regenerated registry.js`);
  console.log(`\n  View at: http://localhost:5173/#/${targetDate}`);
  console.log('  Run:     npm run dev\n');
}

main().catch(err => {
  console.error('\n  ✗ Generation failed:', err.message || err);
  process.exit(1);
});
