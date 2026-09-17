export type ConspiraSeaRole = {
  id: string;
  name: string;
  source: string;
  card: string;
};

const sourceRoot = "/assets/projects-v6/conspirasea-roles";

export const conspiraseaRoles: ConspiraSeaRole[] = [
  ["arsonist", "Arsonist", "Arsonist.png"],
  ["auditor", "Auditor", "Auditor.png"],
  ["captain", "Captain", "Captain.png"],
  ["cook-chemist", "Cook/Chemist", "Cook_Chemist.png"],
  ["crew", "Crew", "Crew.png"],
  ["executioner", "Executioner", "Executioner.png"],
  ["imp-clam", "Imp Clam", "Imp_Clam.png"],
  ["imp-master", "Imp Master", "Imp_Master.png"],
  ["imp-minion", "Imp Minion", "Imp_Minion.png"],
  ["imp-oyster", "Imp Oyster", "Imp_Oyster.png"],
  ["impling", "Impling", "Impling.png"],
  ["implipus", "Implipus", "Implipus.png"],
  ["investigator", "Investigator", "Investigator.png"],
  ["jester", "Jester", "Jester.png"],
  ["judge", "Judge", "Judge.png"],
  ["legacy", "Legacy", "Legacy.png"],
  ["medic", "Medic", "Medic.png"],
  ["private-eye", "Private Eye", "Private_Eye.png"],
  ["rainmaker", "Rainmaker", "Rainmaker.png"],
  ["rogue", "Rogue", "Rogue.png"],
  ["sheriff", "Sheriff", "Sheriff.png"],
  ["spy", "Spy", "Spy.png"],
  ["trapper", "Trapper", "Trapper.png"],
  ["veteran", "Veteran", "Veteran.png"],
  ["wasteman", "Wasteman", "Wasteman.png"],
  ["witch", "Witch", "Witch.png"],
  ["yandere", "Yandere", "Yandere.png"],
] .map(([id, name, source]) => ({
  id,
  name,
  source,
  card: `${sourceRoot}/${id}.webp`,
}));
