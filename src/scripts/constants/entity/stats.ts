import { EntityStats } from './monsters';

export const statusModifierToMessage = {
  negative: {
    [EntityStats.Strength]: '{{entity}} looks weaker.',
    [EntityStats.Dexterity]: '{{entity}} looks less agile.',
    [EntityStats.Intelligence]: '{{entity}} looks dumber.',
    [EntityStats.Toughness]: '{{entity}} seems to be more fragile.',
    [EntityStats.Perception]: '{{entity}} seems to be less perceptive.',
    [EntityStats.Speed]: '{{entity}} moves slower.',
  },
  positive: {
    [EntityStats.Strength]: '{{entity}} regains his strength.',
    [EntityStats.Dexterity]: '{{entity}} looks more agile again.',
    [EntityStats.Intelligence]: '{{entity}} looks smarter.',
    [EntityStats.Toughness]: '{{entity}} looks tougher.',
    [EntityStats.Perception]: '{{entity}} seems to be more perceptive.',
    [EntityStats.Speed]: '{{entity}} moves faster.',
  },
};
