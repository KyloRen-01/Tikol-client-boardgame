import FireIcon from "../../../assets/game-icons/Fire.svg";
import GasIcon from "../../../assets/game-icons/Gas.svg";
import LiquidIcon from "../../../assets/game-icons/Liquid.svg";
import SolidIcon from "../../../assets/game-icons/Solid.svg";
import type { CharacterId } from "../../types/game";

type CharacterIconProps = {
  characterId: CharacterId;
  size: number;
};

const ICONS: Record<CharacterId, typeof SolidIcon> = {
  Solid: SolidIcon,
  Liquid: LiquidIcon,
  Gas: GasIcon,
  Fire: FireIcon,
};

export function CharacterIcon({ characterId, size }: CharacterIconProps) {
  const Icon = ICONS[characterId] ?? SolidIcon;

  return <Icon width={size} height={size} />;
}
