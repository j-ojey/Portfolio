const traitButtons = document.querySelectorAll(".trait-button");
const traitOutput = document.querySelector("#trait-output");
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector(".theme-toggle-label");
const terminalLauncher = document.querySelector("#terminal-launcher");
const terminal = document.querySelector("#developer-terminal");
const terminalClose = document.querySelector("#terminal-close");
const terminalMinimize = document.querySelector("#terminal-minimize");
const terminalMaximize = document.querySelector("#terminal-maximize");
const terminalForm = document.querySelector("#terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const terminalScreen = document.querySelector("#terminal-screen");
const terminalPrompt = document.querySelector("#terminal-prompt");
const dnaSignal = document.querySelector("#dna-signal");
const dnaSignature = document.querySelector("#dna-signature");
const navigationLinks = [...document.querySelectorAll("nav a")];
const mobileMenuToggle = document.querySelector("#mobile-menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
const contactRequestForm = document.querySelector("#contact-request-form");
const numberLabTrigger = document.querySelector("#number-lab-trigger");
const numberLabModal = document.querySelector("#number-lab-modal");
const numberLabClose = document.querySelector("#number-lab-close");
const numberLabContent = document.querySelector("#number-lab-content");

if (!traitButtons.length || !traitOutput || !themeToggle || !themeLabel || !terminalLauncher || !terminal || !terminalClose || !terminalMinimize || !terminalMaximize || !terminalForm || !terminalInput || !terminalScreen || !terminalPrompt || !dnaSignal || !dnaSignature || !mobileMenuToggle || !primaryNavigation || !contactRequestForm || !numberLabTrigger || !numberLabModal || !numberLabClose || !numberLabContent) {
  throw new Error("Portfolio interactive controls are missing from the page.");
}

const traitNotes = {
  curiosity: { signal: "SIGNAL: CURIOUS", title: "The Investigator", note: "Ask one more question before choosing a solution.", signature: "Questions → useful systems → better routes" },
  clarity: { signal: "SIGNAL: CLEAR", title: "The Simplifier", note: "Make the complicated part visible, then give people one useful next step.", signature: "Less noise → clearer decisions → calmer systems" },
  momentum: { signal: "SIGNAL: MOVING", title: "The Rider", note: "Keep moving: a long ride, a small commit, and a clear head can all change the route.", signature: "Small commits → steady motion → distance covered" },
};

traitButtons.forEach((button) => {
  button.addEventListener("click", () => {
    traitButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const trait = traitNotes[button.dataset.trait];
    dnaSignal.textContent = trait.signal;
    traitOutput.innerHTML = `<strong>${trait.title}</strong><span>${trait.note}</span>`;
    dnaSignature.textContent = trait.signature;
  });
});

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
}

setTheme(localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("portfolio-theme", nextTheme);
  setTheme(nextTheme);
});

function closeMobileNavigation() {
  document.body.classList.remove("mobile-menu-open");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
}

mobileMenuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("mobile-menu-open");
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMobileNavigation));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileNavigation();
});

const { links, files, projectNames } = window.portfolioData;
contactRequestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactRequestForm);
  const topic = String(formData.get("topic"));
  const customSubject = String(formData.get("message") || "").trim();
  const subject = customSubject || `Portfolio collaboration — ${topic}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Email: ${formData.get("email") || "(not provided)"}`,
    `Topic: ${topic}`,
    "",
    `Message: ${formData.get("details")}`,
  ].join("\n");
  window.location.href = `mailto:${links.email}?${new URLSearchParams({ subject, body }).toString()}`;
});
const directories = new Set(["/", "/home", "/home/george", ...Object.keys(files).map((path) => path.slice(0, path.lastIndexOf("/"))).filter(Boolean)]);

const commands = ["pwd", "ls", "cd", "tree", "find", "cat", "less", "head", "tail", "file", "stat", "grep", "help", "clear", "history", "whoami", "hostname", "uname", "date", "echo", "man", "search", "github", "linkedin", "resume", "website", "mail", "projects", "project", "skills", "experience", "education", "certifications", "contact", "exit"];
const helpLines = [
  "NAVIGATION",
  "pwd       — show the current virtual directory",
  "ls        — list files and folders here",
  "cd        — move into a virtual directory",
  "tree      — map the portfolio filesystem",
  "find      — search for matching portfolio files",
  "",
  "FILES",
  "cat       — read a complete Markdown portfolio note",
  "less      — read a long note with scrolling",
  "head      — read the first lines of a note",
  "tail      — read the last lines of a note",
  "file      — identify a virtual file",
  "stat      — inspect file metadata",
  "grep      — search inside a file",
  "",
  "PORTFOLIO",
  "whoami    — show George's professional identity",
  "skills    — inspect technical skills",
  "projects  — list the projects shown on the portfolio",
  "project   — inspect one project",
  "search    — search across portfolio information",
  "experience — read workplace experience",
  "education — read academic background",
  "certifications — inspect certification status",
  "",
  "CONTACT",
  "contact   — show ways to connect",
  "github    — open GitHub",
  "linkedin  — open LinkedIn",
  "resume    — open the CV",
  "mail      — compose or preview an email",
  "",
  "UTILITIES",
  "history   — show commands you have used",
  "hostname  — show this workstation's name",
  "uname     — show simulated system information",
  "date      — show the current date",
  "echo      — print text",
  "man       — read a command note",
  "clear     — clear the terminal",
  "exit      — return to the workstation welcome prompt",
];
const helpSections = {
  NAVIGATION: "navigation",
  FILES: "files",
  PORTFOLIO: "portfolio",
  CONTACT: "contact",
  UTILITIES: "utilities",
};
const state = { cwd: "/home/george", history: [], historyIndex: 0, mail: { name: "", email: "", subject: "", message: "" } };

const numberLabQuestionCount = 5;
const recentNumberLabQuestions = new Set();
let numberLabQuestions = [];
let numberLabIndex = 0;
let numberLabScore = 0;

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choose(items) {
  return items[randomInteger(0, items.length - 1)];
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInteger(0, index);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function numberLabOptions(correct, distractors) {
  const values = [...new Set([correct, ...distractors])].map(String);
  if (values.length !== 4) return null;
  const options = shuffled(values);
  return { options, answer: options.indexOf(String(correct)) };
}

function createNumberLabQuestion(prompt, correct, distractors, feedback, key) {
  const choices = numberLabOptions(correct, distractors);
  if (!choices) return null;
  return { prompt, ...choices, feedback, key };
}

function generateArithmeticQuestion() {
  const operation = choose(["+", "-", "×", "÷"]);
  let first = randomInteger(8, 48);
  let second = randomInteger(2, 18);
  if (operation === "÷") {
    const quotient = randomInteger(3, 12);
    first = second * quotient;
    return createNumberLabQuestion(`Warm-up: what is ${first} ÷ ${second}?`, quotient, [quotient + 2, quotient - 1, quotient + 4], `${first} ÷ ${second} = ${quotient}.`, `arithmetic-${first}-${second}-divide`);
  }
  const answer = operation === "+" ? first + second : operation === "-" ? first - second : first * second;
  return createNumberLabQuestion(`Warm-up: what is ${first} ${operation} ${second}?`, answer, [answer + 3, answer - 2, answer + 7], `${first} ${operation} ${second} = ${answer}.`, `arithmetic-${first}-${operation}-${second}`);
}

function generateSequenceQuestion() {
  const type = choose(["arithmetic", "geometric", "square", "triangular"]);
  if (type === "arithmetic") {
    const start = randomInteger(3, 16);
    const step = randomInteger(3, 11);
    const values = Array.from({ length: 5 }, (_, index) => start + index * step);
    const answer = start + 5 * step;
    return createNumberLabQuestion(`Pattern check: what comes next? ${values.join(", ")}, ...`, answer, [answer + step, answer - step, answer + 2], `The sequence adds ${step} each time, so the next number is ${answer}.`, `sequence-add-${start}-${step}`);
  }
  if (type === "geometric") {
    const start = randomInteger(2, 5);
    const ratio = randomInteger(2, 4);
    const values = Array.from({ length: 5 }, (_, index) => start * ratio ** index);
    const answer = start * ratio ** 5;
    return createNumberLabQuestion(`Pattern check: what comes next? ${values.join(", ")}, ...`, answer, [answer + ratio, answer / ratio, answer * 2], `Each term is multiplied by ${ratio}, so the next number is ${answer}.`, `sequence-multiply-${start}-${ratio}`);
  }
  if (type === "square") {
    const start = randomInteger(2, 8);
    const values = Array.from({ length: 5 }, (_, index) => (start + index) ** 2);
    const answer = (start + 5) ** 2;
    return createNumberLabQuestion(`Pattern check: what comes next? ${values.join(", ")}, ...`, answer, [answer - 1, answer + 2 * start, (start + 4) ** 2], `These are consecutive square numbers. The next is ${start + 5}² = ${answer}.`, `sequence-square-${start}`);
  }
  const start = randomInteger(2, 7);
  const triangular = (value) => (value * (value + 1)) / 2;
  const values = Array.from({ length: 5 }, (_, index) => triangular(start + index));
  const answer = triangular(start + 5);
  return createNumberLabQuestion(`Pattern check: what comes next? ${values.join(", ")}, ...`, answer, [answer + start, answer - 1, answer + 5], `These are triangular numbers. T${start + 5} = ${answer}.`, `sequence-triangular-${start}`);
}

function generateLogicQuestion() {
  const names = shuffled(["Noris", "Vexas", "Palis", "Rumas", "Tovas", "Kelis"]);
  const [groupA, groupB, groupC] = names;
  return createNumberLabQuestion(`Logic check: every ${groupA} is a ${groupB}. No ${groupB} is a ${groupC}. Can a ${groupA} be a ${groupC}?`, "No, never", ["Yes, always", "Only sometimes", "There is not enough information"], `Because every ${groupA} belongs to ${groupB}, and no ${groupB} can be ${groupC}, no ${groupA} can be ${groupC}.`, `logic-${groupA}-${groupB}-${groupC}`);
}

function generateAlgebraQuestion() {
  const coefficient = randomInteger(2, 9);
  const solution = randomInteger(-6, 12);
  const constant = randomInteger(-14, 16);
  const result = coefficient * solution + constant;
  const equationConstant = constant < 0 ? ` - ${Math.abs(constant)}` : ` + ${constant}`;
  const distractors = [solution + 1, solution - 2, -solution].filter((value) => value !== solution);
  while (distractors.length < 3) distractors.push(solution + distractors.length + 3);
  return createNumberLabQuestion(`Solve for x: ${coefficient}x${equationConstant} = ${result}`, solution, distractors, `Undo the constant, then divide by ${coefficient}: x = ${solution}.`, `algebra-${coefficient}-${constant}-${solution}`);
}

function generateBrainTeaserQuestion() {
  const first = randomInteger(3, 12);
  let second = randomInteger(4, 15);
  while (second === first) second = randomInteger(4, 15);
  const greatestCommonDivisor = (a, b) => b === 0 ? a : greatestCommonDivisor(b, a % b);
  const leastCommonMultiple = (a, b) => (a * b) / greatestCommonDivisor(a, b);
  const answer = leastCommonMultiple(first, second);
  return createNumberLabQuestion(`Challenge: what is the smallest positive number that is a multiple of both ${first} and ${second}?`, answer, [first * second, answer + first, answer + second], `${answer} is the least common multiple of ${first} and ${second}.`, `teaser-lcm-${first}-${second}`);
}

const numberLabGenerators = [generateArithmeticQuestion, generateSequenceQuestion, generateLogicQuestion, generateAlgebraQuestion, generateBrainTeaserQuestion];

function generateFreshNumberLabQuestion(generator) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const question = generator();
    if (question && !recentNumberLabQuestions.has(question.key)) {
      recentNumberLabQuestions.add(question.key);
      return question;
    }
  }
  throw new Error("Unable to generate a fresh Number Lab question.");
}

function generateNumberLabSet() {
  return numberLabGenerators.map(generateFreshNumberLabQuestion);
}

function renderNumberLab() {
  const question = numberLabQuestions[numberLabIndex];
  numberLabContent.innerHTML = `
    <div class="number-lab-heading"><span class="number-lab-kicker">/usr/bin/curiosity</span><span class="number-lab-equation" aria-hidden="true">∫ ∑ √ π</span><h2 id="number-lab-title">The Number <em>Lab</em></h2><p>Five questions. One very small experiment in problem-solving.</p></div>
    <div class="number-lab-progress"><span>Question ${numberLabIndex + 1} of ${numberLabQuestions.length}</span><span>${numberLabScore} correct</span></div>
    <div class="number-lab-progress-bar" aria-hidden="true"><span style="width: ${((numberLabIndex + 1) / numberLabQuestions.length) * 100}%"></span></div>
    <fieldset class="number-lab-question"><legend>${question.prompt}</legend><div class="number-lab-options">${question.options.map((option, index) => `<button type="button" class="number-lab-option" data-answer="${index}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join("")}</div></fieldset>
    <p class="number-lab-feedback" id="number-lab-feedback" aria-live="polite"></p>
    <button class="number-lab-next" id="number-lab-next" type="button" disabled>Check answer <span aria-hidden="true">↗</span></button>
  `;
  numberLabContent.querySelectorAll(".number-lab-option").forEach((option) => option.addEventListener("click", selectNumberLabAnswer));
}

function showNumberLabResults() {
  const percentage = numberLabScore * 20;
  const level = numberLabScore === 5 ? "Mathematical curiosity: MAX" : numberLabScore >= 3 ? "Problem-solving mode: ACTIVATED" : "Curiosity engine: WARMING UP";
  const message = numberLabScore === 5 ? "You and numbers are clearly on speaking terms." : numberLabScore >= 3 ? "A strong run. The numbers noticed your persistence." : "Every great solution starts with a question. Run it again and keep exploring.";
  numberLabContent.innerHTML = `<div class="number-lab-result"><span class="number-lab-kicker">experiment complete</span><div class="number-lab-score"><strong>${numberLabScore}</strong><span>/ 5</span></div><p class="number-lab-percentage">${percentage}% accuracy</p><h2>${level}</h2><div class="number-lab-readout"><span>Love for numbers</span><strong>∞</strong><span>Problem-solving mode</span><strong>${numberLabScore >= 3 ? "ON" : "READY"}</strong></div><p>${message}</p><div class="number-lab-result-actions"><button class="number-lab-next" id="number-lab-replay" type="button">Run it again <span aria-hidden="true">↻</span></button><button class="number-lab-text-button" id="number-lab-finish" type="button">Close lab</button></div></div>`;
  numberLabContent.querySelector("#number-lab-replay").addEventListener("click", startNumberLab);
  numberLabContent.querySelector("#number-lab-finish").addEventListener("click", closeNumberLab);
}

function selectNumberLabAnswer(event) {
  const selected = Number(event.currentTarget.dataset.answer);
  const question = numberLabQuestions[numberLabIndex];
  const options = numberLabContent.querySelectorAll(".number-lab-option");
  options.forEach((option, index) => {
    option.disabled = true;
    if (index === question.answer) option.classList.add("is-correct");
    if (index === selected && selected !== question.answer) option.classList.add("is-wrong");
  });
  if (selected === question.answer) numberLabScore += 1;
  numberLabContent.querySelector("#number-lab-feedback").textContent = selected === question.answer ? `Correct — ${question.feedback}` : `Not quite — ${question.feedback}`;
  const next = numberLabContent.querySelector("#number-lab-next");
  next.disabled = false;
  next.textContent = numberLabIndex === numberLabQuestions.length - 1 ? "See your result ↗" : "Next question ↗";
  next.addEventListener("click", () => {
    numberLabIndex += 1;
    if (numberLabIndex === numberLabQuestions.length) showNumberLabResults();
    else renderNumberLab();
  }, { once: true });
}

function startNumberLab() {
  numberLabIndex = 0;
  numberLabScore = 0;
  numberLabQuestions = generateNumberLabSet();
  numberLabModal.hidden = false;
  document.body.classList.add("number-lab-open");
  renderNumberLab();
}

function closeNumberLab() {
  numberLabModal.hidden = true;
  document.body.classList.remove("number-lab-open");
}

numberLabTrigger.addEventListener("click", startNumberLab);
numberLabClose.addEventListener("click", closeNumberLab);
numberLabModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-number-lab-close]")) closeNumberLab();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !numberLabModal.hidden) closeNumberLab();
});

function normalizePath(input, base = state.cwd) {
  const raw = input.startsWith("/") ? input : `${base}/${input}`;
  const parts = raw.split("/").filter(Boolean);
  const result = [];
  parts.forEach((part) => {
    if (part === "..") result.pop();
    else if (part !== ".") result.push(part);
  });
  return `/${result.join("/")}` || "/";
}

function displayPath(path = state.cwd) {
  return path === "/home/george" ? "~" : path.replace("/home/george", "~");
}

function childrenOf(path) {
  const prefix = path === "/" ? "/" : `${path}/`;
  const children = new Set();
  directories.forEach((directory) => {
    if (!directory.startsWith(prefix) || directory === path) return;
    const rest = directory.slice(prefix.length);
    if (rest && !rest.includes("/")) children.add({ name: rest, type: "dir" });
  });
  Object.keys(files).forEach((file) => {
    if (!file.startsWith(prefix)) return;
    const rest = file.slice(prefix.length);
    if (rest && !rest.includes("/")) children.add({ name: rest, type: "file" });
  });
  return [...children].sort((a, b) => a.name.localeCompare(b.name));
}

function resolveEntry(input) {
  const path = normalizePath(input);
  if (directories.has(path)) return { path, type: "dir" };
  if (files[path]) return { path, type: "file", ...files[path] };
  return null;
}

function parseArgs(input) {
  return [...input.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((match) => match[1] ?? match[2] ?? match[3]);
}

function similarity(input, options) {
  const first = input.toLowerCase();
  return options.map((option) => ({ option, score: [...first].reduce((score, char, index) => score + (option[index] === char ? 1 : 0), 0) })).sort((a, b) => b.score - a.score)[0]?.option;
}

function treeLines(path = "/home/george", prefix = "") {
  const entries = childrenOf(path);
  return entries.flatMap((entry, index) => {
    const last = index === entries.length - 1;
    const branch = `${prefix}${last ? "└── " : "├── "}${entry.name}${entry.type === "dir" ? "/" : ""}`;
    return entry.type === "dir" ? [branch, ...treeLines(`${path}/${entry.name}`, `${prefix}${last ? "    " : "│   "}`)] : [branch];
  });
}

function searchFiles(term) {
  const needle = term.toLowerCase();
  return Object.entries(files).filter(([path, file]) => `${path} ${file.description} ${file.content}`.toLowerCase().includes(needle)).map(([path, file]) => `${path} — ${file.description}`);
}

function printLines(lines, command = "") {
  if (command) {
    const prompt = document.createElement("p");
    prompt.className = "terminal-command";
    prompt.textContent = `george@build-lab:${displayPath()}$ ${command}`;
    terminalScreen.append(prompt);
  }
  lines.forEach((line) => {
    const output = document.createElement("p");
    const section = helpSections[line];
    output.className = section ? `terminal-help-header terminal-help-${section}` : line.endsWith("/") || line.startsWith("dir ") ? "terminal-folder" : line.includes(".md") || line.startsWith("file ") ? "terminal-file" : "terminal-output";
    output.textContent = line;
    terminalScreen.append(output);
  });
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function printWelcome() {
  terminalScreen.replaceChildren();
  printLines(["Welcome to my development workstation.", "I am George Wainaina Kihoro.", "Software Engineering | Cloud Computing | Problem Solving", "The .md files are readable portfolio notes. Use ls, then cat <file> to inspect one.", "Type help to see available commands.", "Try: whoami · ls · tree · projects · skills · contact"]);
}

function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function execute(commandLine) {
  const args = parseArgs(commandLine);
  const command = (args.shift() || "").toLowerCase();
  const argument = args.join(" ");
  if (!command) return;
  state.history.push(commandLine);
  state.historyIndex = state.history.length;
  if (command === "clear") {
    terminalScreen.replaceChildren();
    return;
  }
  if (command === "exit") {
    state.cwd = "/home/george";
    closeTerminal();
    return;
  }
  if (command === "pwd") return printLines([state.cwd], commandLine);
  if (command === "whoami") return printLines(["george — software engineering, cloud computing, problem solving."], commandLine);
  if (command === "hostname") return printLines(["build-lab"], commandLine);
  if (command === "uname") return printLines(["Build Lab Linux 6.1.0-portfolio x86_64"], commandLine);
  if (command === "date") return printLines([new Date().toString()], commandLine);
  if (command === "echo") return printLines([argument], commandLine);
  if (command === "ls") {
    const entries = childrenOf(state.cwd);
    const detailed = args.includes("-la") || args.includes("-al");
    const listing = entries.map((entry) => detailed ? `${entry.type === "dir" ? "dir " : "file"}  ${entry.name}${entry.type === "file" ? ` — ${files[`${state.cwd}/${entry.name}`]?.description || ""}` : ""}` : entry.type === "dir" ? `${entry.name}/` : entry.name);
    return printLines(listing, commandLine);
  }
  if (command === "cd") {
    const target = args[0] || "/home/george";
    const entry = resolveEntry(target === "~" ? "/home/george" : target);
    if (!entry || entry.type !== "dir") return printLines([`cd: no such directory: ${target}`], commandLine);
    state.cwd = entry.path;
    terminalPrompt.textContent = `george@build-lab:${displayPath()}$`;
    return printLines([displayPath()], commandLine);
  }
  if (command === "tree") return printLines([".", ...treeLines(state.cwd)], commandLine);
  if (command === "find") {
    const results = searchFiles(args[0] || "");
    return printLines(results.length ? results : ["find: no matching files"], commandLine);
  }
  if (["cat", "less", "head", "tail", "file", "stat", "grep"].includes(command)) {
    const target = args[command === "grep" ? 1 : 0];
    const entry = target && resolveEntry(target);
    if (!entry) return printLines([`${command}: no such file: ${target || "(missing filename)"}`], commandLine);
    if (entry.type === "dir") return printLines([`${command}: ${target} is a directory`], commandLine);
    if (command === "file") return printLines([`${entry.path}: virtual Markdown document`], commandLine);
    if (command === "stat") return printLines([`File: ${entry.path}`, "Type: virtual file", `Description: ${entry.description}`], commandLine);
    if (command === "grep") {
      const needle = args[0]?.toLowerCase() || "";
      return printLines(entry.content.split("\n").filter((line) => line.toLowerCase().includes(needle)).length ? entry.content.split("\n").filter((line) => line.toLowerCase().includes(needle)) : ["No matching lines."], commandLine);
    }
    const lines = entry.content.split("\n");
    return printLines(command === "head" ? lines.slice(0, 5) : command === "tail" ? lines.slice(-5) : lines, commandLine);
  }
  if (command === "history") return printLines(state.history.map((item, index) => `${index + 1}  ${item}`), commandLine);
  if (command === "help") return printLines(helpLines, commandLine);
  if (command === "man") {
    const topic = args[0];
    return printLines(commands.includes(topic) ? [`${topic}: supported by the Build Lab virtual workstation.`, topic === "cd" ? "Usage: cd <directory>" : topic === "cat" ? "Usage: cat <file>" : "Try it in the current directory."] : [`No manual entry for ${topic || "(missing command)"}`], commandLine);
  }
  if (command === "search") {
    const results = searchFiles(argument);
    return printLines(results.length ? results : [`No portfolio files matched "${argument}".`], commandLine);
  }
  if (command === "projects") {
    const filter = args[0];
    const names = ["SokoTally", "EcoLoop", "SmartLife AI", "dVoting"];
    return printLines(["Projects currently shown on the main portfolio:", ...names.map((name) => `• ${name}`), "Use project <name> to inspect one project in more detail."], commandLine);
  }
  if (command === "project") {
    const key = (args[0] || "").toLowerCase();
    const name = projectNames[key];
    if (!name) return printLines([`Unknown project: ${args[0] || "(missing name)"}`, "Try: project sokotally"], commandLine);
    const entry = resolveEntry(`/home/george/projects/${key}/overview.md`);
    return printLines([`PROJECT: ${name.toUpperCase()}`, "", ...(entry?.content.split("\n") || []), "", `Read more with: cat projects/${key}/overview.md`], commandLine);
  }
  if (command === "skills") {
    const skillPath = args[0] ? `/home/george/skills/${args[0].toLowerCase()}.md` : null;
    const entry = skillPath && resolveEntry(skillPath);
    return entry ? printLines([`Skill notes: ${args[0]}`, entry.description, "—", ...entry.content.split("\n")], commandLine) : printLines(["Skills grouped by focus:", "programming", "frontend", "backend", "cloud", "databases", "tools", "learning-roadmap", "Try skills cloud or skills programming to inspect a category."], commandLine);
  }
  if (command === "experience") return printLines(["Workplace and learning experience:", ...files["/home/george/experience/kpa-attachment.md"].content.split("\n"), "", ...files["/home/george/experience/responsibilities.md"].content.split("\n")], commandLine);
  if (command === "education") return printLines(["Academic background:", ...files["/home/george/about/education.md"].content.split("\n"), "The degree is presented as completed, not in progress."], commandLine);
  if (command === "certifications") return printLines(["Certification status:", files["/home/george/certifications/oracle-cloud.md"].content, "", files["/home/george/certifications/in-progress.md"].content], commandLine);
  if (command === "contact") {
    document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    return printLines([`Email: ${links.email}`, `GitHub: ${links.github}`, `LinkedIn: ${links.linkedin}`], commandLine);
  }
  if (command === "github") return openExternal(args[0] === "learning" ? links.learning : args[0] === "projects" ? `${links.github}?tab=repositories` : links.github);
  if (command === "linkedin") return openExternal(links.linkedin);
  if (command === "resume") return openExternal(links.resume);
  if (command === "website") {
    closeTerminal();
    return;
  }
  if (command === "mail") return handleMail(args, commandLine);
  const suggestion = similarity(command, commands);
  return printLines([`Command not found: ${command}. Did you mean ${suggestion}?`], commandLine);
}

function handleMail(args, commandLine) {
  const subcommand = args.shift();
  if (subcommand === "to") return printLines([links.email], commandLine);
  if (subcommand === "subject") {
    state.mail.subject = args.join(" ");
    return printLines([`Subject set: ${state.mail.subject}`], commandLine);
  }
  if (subcommand === "preview") return printLines([`To: ${links.email}`, `Subject: ${state.mail.subject || "(none)"}`, `Message: ${state.mail.message || "(none)"}`], commandLine);
  if (subcommand === "send") {
    const query = new URLSearchParams({ subject: state.mail.subject, body: state.mail.message });
    window.location.href = `mailto:${links.email}?${query.toString()}`;
    return printLines(["Opening your email application. The message has not been sent by this website."], commandLine);
  }
  if (subcommand === "compose") {
    const form = document.createElement("form");
    form.className = "mail-compose";
    form.innerHTML = '<label>Name<input name="name" required></label><label>Email<input name="email" type="email" required></label><label>Subject<input name="subject" required></label><label>Message<textarea name="message" rows="3" required></textarea></label><button type="submit">Prepare email ↗</button>';
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      state.mail = { name: data.get("name"), email: data.get("email"), subject: data.get("subject"), message: data.get("message") };
      const body = `From: ${state.mail.name} (${state.mail.email})\n\n${state.mail.message}`;
      window.location.href = `mailto:${links.email}?${new URLSearchParams({ subject: state.mail.subject, body })}`;
      printLines(["Opening your email application. The message has not been sent by this website."], "mail compose");
      form.remove();
    });
    terminalScreen.append(form);
    form.querySelector("input").focus();
    return;
  }
  return printLines(["mail · mail compose · mail subject \"Project collaboration\" · mail preview · mail send"], commandLine);
}

function closeTerminal() {
  terminal.hidden = true;
  terminalLauncher.hidden = false;
  terminalLauncher.setAttribute("aria-expanded", "false");
  document.body.classList.remove("terminal-open", "terminal-minimized", "terminal-maximized");
  terminalInput.value = "";
}

terminalLauncher.addEventListener("click", () => {
  terminal.hidden = false;
  terminalLauncher.hidden = true;
  terminalLauncher.setAttribute("aria-expanded", "true");
  document.body.classList.add("terminal-open", "terminal-maximized");
  terminalInput.focus();
});
terminalClose.addEventListener("click", (event) => {
  event.preventDefault();
  closeTerminal();
});
terminalMinimize.addEventListener("click", () => {
  document.body.classList.remove("terminal-open", "terminal-maximized");
  document.body.classList.add("terminal-minimized");
  terminalInput.blur();
});
terminalMaximize.addEventListener("click", () => {
  document.body.classList.remove("terminal-minimized");
  document.body.classList.add("terminal-open", "terminal-maximized");
  terminalInput.focus();
});
terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = terminalInput.value.trim();
  terminalInput.value = "";
  execute(command);
});
terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    state.historyIndex = Math.max(0, state.historyIndex - 1);
    terminalInput.value = state.history[state.historyIndex] || "";
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    state.historyIndex = Math.min(state.history.length, state.historyIndex + 1);
    terminalInput.value = state.history[state.historyIndex] || "";
  }
  if (event.key === "Tab") {
    event.preventDefault();
    const prefix = terminalInput.value.toLowerCase();
    const match = commands.find((item) => item.startsWith(prefix));
    if (match) terminalInput.value = match;
  }
  if (event.ctrlKey && event.key.toLowerCase() === "l") {
    event.preventDefault();
    terminalScreen.replaceChildren();
  }
});
terminalScreen.addEventListener("click", (event) => {
  const button = event.target.closest("[data-command]");
  if (!button) return;
  execute(button.dataset.command);
});

const sections = navigationLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => link.classList.toggle("is-active", link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

