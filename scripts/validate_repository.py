#!/usr/bin/env python3
"""Validate skill packaging and repository-local contracts."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path


TEXT_SUFFIXES = {
    ".cjs",
    ".css",
    ".html",
    ".js",
    ".json",
    ".jsx",
    ".md",
    ".mjs",
    ".py",
    ".svelte",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}
REFERENCE_SUFFIXES = {
    ".json",
    ".md",
    ".mjs",
    ".py",
    ".yaml",
    ".yml",
}
REFERENCE_PREFIXES = ("references/", "scripts/", "agents/", "../", "../../")
FRONTMATTER_PATTERN = re.compile(r"\A---\n(?P<body>.*?)\n---\n", re.DOTALL)
FRONTMATTER_FIELD_PATTERN = re.compile(r"^(?P<key>[a-zA-Z_][\w-]*):\s*(?P<value>.+)$")
MARKDOWN_LINK_PATTERN = re.compile(r"\[[^\]]+\]\((?P<target>[^)]+)\)")
CODE_PATH_PATTERN = re.compile(r"`(?P<target>[^`\n]+)`")
COMMAND_PATH_PATTERN = re.compile(
    r"(?m)^\s*(?:python3?|node)\s+(?P<target>(?:scripts/|\.\./)[^\s\\]+)"
)
README_SKILL_PATTERN = re.compile(r"^\|\s*`(?P<name>[a-z0-9-]+)`\s*\|", re.MULTILINE)


@dataclass(frozen=True)
class Finding:
    path: Path
    message: str


def parse_frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    match = FRONTMATTER_PATTERN.match(text)
    if match is None:
        return {}
    fields: dict[str, str] = {}
    for line in match.group("body").splitlines():
        field_match = FRONTMATTER_FIELD_PATTERN.match(line)
        if field_match:
            fields[field_match.group("key")] = field_match.group("value").strip()
    return fields


def iter_text_files(root: Path) -> list[Path]:
    return sorted(
        path
        for path in root.rglob("*")
        if path.is_file()
        and ".git" not in path.parts
        and path.suffix.lower() in TEXT_SUFFIXES
    )


def normalize_reference(raw: str) -> str | None:
    target = raw.strip().split("#", maxsplit=1)[0]
    if not target or target.startswith(("http://", "https://", "mailto:", "#")):
        return None
    if "<" in target or ">" in target or " " in target:
        return None
    if not target.startswith(REFERENCE_PREFIXES):
        return None
    if Path(target).suffix.lower() not in REFERENCE_SUFFIXES:
        return None
    return target


def validate_references(path: Path) -> list[Finding]:
    text = path.read_text(encoding="utf-8")
    findings: list[Finding] = []
    candidates = [
        match.group("target") for match in MARKDOWN_LINK_PATTERN.finditer(text)
    ]
    candidates.extend(match.group("target") for match in CODE_PATH_PATTERN.finditer(text))
    candidates.extend(match.group("target") for match in COMMAND_PATH_PATTERN.finditer(text))
    checked: set[str] = set()
    for raw in candidates:
        target = normalize_reference(raw)
        if target is None or target in checked:
            continue
        checked.add(target)
        base = path.parent
        if target.startswith(("references/", "scripts/", "agents/")):
            for candidate in (path.parent, *path.parents):
                if (candidate / "SKILL.md").exists():
                    base = candidate
                    break
        resolved = (base / target).resolve()
        if not resolved.exists():
            findings.append(Finding(path, f"missing local reference: {target}"))
    return findings


def validate_skill(skill_dir: Path) -> list[Finding]:
    findings: list[Finding] = []
    skill_file = skill_dir / "SKILL.md"
    fields = parse_frontmatter(skill_file)
    if not fields:
        findings.append(Finding(skill_file, "missing or malformed YAML frontmatter"))
        return findings
    if fields.get("name") != skill_dir.name:
        findings.append(
            Finding(
                skill_file,
                f"frontmatter name '{fields.get('name', '')}' must equal folder '{skill_dir.name}'",
            )
        )
    description = fields.get("description", "")
    if len(description) < 40:
        findings.append(Finding(skill_file, "description is missing or too short"))

    agent_file = skill_dir / "agents" / "openai.yaml"
    if agent_file.exists():
        agent_text = agent_file.read_text(encoding="utf-8")
        for field in ("display_name:", "short_description:", "default_prompt:"):
            if field not in agent_text:
                findings.append(Finding(agent_file, f"missing interface field: {field[:-1]}"))
    return findings


def validate_malformed_content(path: Path) -> list[Finding]:
    text = path.read_text(encoding="utf-8")
    findings: list[Finding] = []
    if re.search(r"^(<<<<<<<|=======|>>>>>>>)(?: .*)?$", text, re.MULTILINE):
        findings.append(Finding(path, "contains a merge-conflict marker"))
    if re.search(r"^\s*\d+→", text, re.MULTILINE):
        findings.append(Finding(path, "contains a pasted line-number artifact"))
    if "\x00" in text:
        findings.append(Finding(path, "contains a NUL byte"))
    return findings


def validate_json(path: Path) -> list[Finding]:
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        return [Finding(path, f"invalid JSON: {error}")]
    return []


def validate_readme(root: Path, skill_names: set[str]) -> list[Finding]:
    readme = root / "README.md"
    text = readme.read_text(encoding="utf-8")
    catalog = set(README_SKILL_PATTERN.findall(text))
    findings = [
        Finding(readme, f"catalog entry has no skill directory: {name}")
        for name in sorted(catalog - skill_names)
    ]
    findings.extend(
        Finding(readme, f"skill directory is missing from catalog: {name}")
        for name in sorted(skill_names - catalog)
    )
    return findings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="repository root",
    )
    args = parser.parse_args()
    root = args.root.resolve()
    skill_dirs = sorted(
        path for path in root.iterdir() if path.is_dir() and (path / "SKILL.md").exists()
    )
    skill_names = {path.name for path in skill_dirs}

    findings: list[Finding] = []
    for skill_dir in skill_dirs:
        findings.extend(validate_skill(skill_dir))
    for path in iter_text_files(root):
        findings.extend(validate_malformed_content(path))
        if path.suffix == ".md" and path != root / "README.md":
            findings.extend(validate_references(path))
        elif path.suffix == ".json":
            findings.extend(validate_json(path))
    findings.extend(validate_readme(root, skill_names))

    if findings:
        for finding in findings:
            print(f"{finding.path.relative_to(root)}: {finding.message}")
        print(f"\nFAIL: {len(findings)} finding(s)")
        return 1

    print(
        f"PASS: {len(skill_dirs)} skills, "
        f"{len(iter_text_files(root))} text files, and README catalog validated"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
