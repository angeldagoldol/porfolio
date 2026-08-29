import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import portfolioData from "../src/data/portfolioData.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const getMember = (id) =>
  portfolioData.members.find((member) => member.id === id);

test("the group portfolio contains exactly three unique member chapters", () => {
  assert.equal(portfolioData.members.length, 3);
  assert.equal(new Set(portfolioData.members.map((member) => member.id)).size, 3);
  assert.deepEqual(
    portfolioData.members.map((member) => member.chapter),
    ["01", "02", "03"],
  );
});

test("all three group members have complete profiles", () => {
  assert.equal(getMember("angel").status, "complete");
  assert.equal(getMember("mike").status, "complete");
  assert.equal(getMember("member-3").status, "complete");
});

test("Mike's supplied profile information remains separate and complete", () => {
  const mike = getMember("mike");
  assert.equal(mike.name, "Mike Jaspher P. Liggayu");
  assert.equal(mike.age, 20);
  assert.equal(mike.location, "Davao City, Davao del Sur");
  assert.equal(mike.yearLevel, "Second Year");
  assert.equal(mike.school, "St. John Paul of Davao City");
  assert.equal(mike.skills.length, 10);
  assert.equal(mike.projects.length, 5);
  assert.equal(mike.achievements.length, 4);
  assert.equal(mike.hobbies.length, 7);
  assert.equal(mike.contact.email, "mikejaspherliggayu@gmail.com");
  assert.equal(mike.photoStatus, "provided");
  assert.match(mike.profileImage, /mike-liggayu-profile-480\.webp$/);
});

test("Van Yowrick's supplied profile information is complete", () => {
  const yowrick = getMember("member-3");
  assert.equal(yowrick.name, "Van Yowrick B. Eapina");
  assert.equal(yowrick.age, 19);
  assert.equal(yowrick.location, "Davao City, Davao del Sur");
  assert.equal(yowrick.school, "St. John Paul of Davao City");
  assert.equal(yowrick.contact.email, "evanyowrick@gmail.com");
  assert.equal(yowrick.skills.length, 12);
  assert.equal(yowrick.projects.length, 8);
  assert.equal(yowrick.achievements.length, 7);
  assert.equal(yowrick.hobbies.length, 10);
  assert.equal(yowrick.photoStatus, "provided");
  assert.match(yowrick.profileImage, /van-yowrick-eapina-profile-480\.webp$/);
});

test("only supplied, valid external URLs become links", () => {
  for (const member of portfolioData.members) {
    for (const project of member.projects) {
      if (project.url) assert.equal(new URL(project.url).protocol, "https:");
    }
    for (const social of member.contact.socials) {
      if (social.url) assert.equal(new URL(social.url).protocol, "https:");
    }
  }

  const mike = getMember("mike");
  assert.ok(mike.contact.socials.every((social) => social.url === null));
  const yowrick = getMember("member-3");
  assert.ok(yowrick.contact.socials.every((social) => social.url === null));
});

test("shared interface copy identifies a group rather than a personal portfolio", async () => {
  const files = [
    "index.html",
    "src/components/Header.jsx",
    "src/components/Hero.jsx",
    "src/components/Footer.jsx",
  ];
  const text = (
    await Promise.all(files.map((file) => readFile(join(ROOT, file), "utf8")))
  ).join("\n");

  assert.match(text, /Three Chapters, One Canvas/);
  assert.doesNotMatch(text, /Explore my work|About me|Send me an email/);
});

test("JSX uses external styles and supplied data contains no invisible direction marks", async () => {
  const componentFiles = await readdir(join(ROOT, "src/components"));
  const jsxFiles = ["src/App.jsx", ...componentFiles.filter((file) => file.endsWith(".jsx")).map((file) => `src/components/${file}`)];
  const jsxSource = (
    await Promise.all(jsxFiles.map((file) => readFile(join(ROOT, file), "utf8")))
  ).join("\n");

  assert.doesNotMatch(jsxSource, /style\s*=\s*\{\{/);
  assert.doesNotMatch(JSON.stringify(portfolioData), /[\u200e\u200f\ufeff]/u);
});

test("responsive and reduced-motion fallbacks remain present", async () => {
  const responsiveCss = await readFile(
    join(ROOT, "src/styles/responsive.css"),
    "utf8",
  );
  const motionCss = await readFile(join(ROOT, "src/styles/motion.css"), "utf8");

  assert.match(responsiveCss, /@media \(max-width: 1199px\)/);
  assert.match(responsiveCss, /@media \(max-width: 760px\)/);
  assert.match(responsiveCss, /overflow-x:\s*auto/);
  assert.match(responsiveCss, /scroll-snap-type:\s*x mandatory/);
  assert.match(motionCss, /@media \(prefers-reduced-motion: reduce\)/);
});
