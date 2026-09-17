import { conspiraseaRoles, type ConspiraSeaRole } from "../data/conspirasea-roles";

const storageKey = "willchai.projects.conspirasea-role-deck.v1";

type StoredDeck = { remaining: string[] };

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const selected = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[selected]] = [copy[selected], copy[index]];
  }
  return copy;
}

function readDeck() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(storageKey) || "{}") as StoredDeck;
    const valid = new Set(conspiraseaRoles.map((role) => role.id));
    if (Array.isArray(stored.remaining))
      return stored.remaining.filter((id) => valid.has(id));
  } catch {}
  return [] as string[];
}

function startRoleDeck(scene: HTMLElement) {
  const buttons = [...scene.querySelectorAll<HTMLButtonElement>("[data-character]")];
  const refresh = scene.querySelector<HTMLButtonElement>("[data-role-refresh]")!;
  const status = scene.querySelector<HTMLElement>("[data-role-status]")!;
  const roles = new Map(conspiraseaRoles.map((role) => [role.id, role]));
  let remaining = readDeck();

  function save() {
    sessionStorage.setItem(storageKey, JSON.stringify({ remaining } satisfies StoredDeck));
  }

  if (!remaining.length) {
    const visible = new Set(buttons.map((button) => button.dataset.character));
    remaining = shuffle(conspiraseaRoles.map((role) => role.id).filter((id) => !visible.has(id)));
    save();
  }

  function takeThree() {
    const chosen: ConspiraSeaRole[] = [];
    while (chosen.length < buttons.length) {
      if (!remaining.length) remaining = shuffle(conspiraseaRoles.map((role) => role.id));
      const id = remaining.shift();
      const role = id ? roles.get(id) : undefined;
      if (role && !chosen.some((item) => item.id === role.id)) chosen.push(role);
    }
    save();
    return chosen;
  }

  function render(rolesForCards: ConspiraSeaRole[], announce: boolean) {
    buttons.forEach((button, index) => {
      const role = rolesForCards[index];
      const image = button.querySelector<HTMLImageElement>("img")!;
      const name = button.querySelector<HTMLElement>(".crewName")!;
      button.dataset.character = role.id;
      button.dataset.roleCard = role.card;
      button.setAttribute("aria-label", `Present ${role.name}`);
      button.setAttribute("aria-pressed", "false");
      image.src = role.card;
      name.textContent = role.name;
    });
    if (announce) status.textContent = "Three new roles are ready.";
    scene.dispatchEvent(new CustomEvent("conspirasearoleschange", { bubbles: true }));
  }

  refresh.addEventListener("click", () => render(takeThree(), true));
}

const scene = document.querySelector<HTMLElement>("#conspirasea");
if (scene) startRoleDeck(scene);
