export enum EntityStatuses {
  Bleeding = 'bleeding',
  Poisoned = 'poisoned',
  Paralyzed = 'paralyzed',
  Fallen = 'prone',
  Stunned = 'stunned',
}

export const entityStatusToDamageText = {
  [EntityStatuses.Bleeding]: '{{description}} loses blood!',
  [EntityStatuses.Stunned]: '{{description}} is stunned by a force of attack!',
};
