import { InventoryService } from '../inventory/inventory.service';
import { ContainerInventoryModal } from '../modal/containerInventory/containerInventoryModal';

export const globalInventoryController: InventoryService =
  new InventoryService();

export const globalContainerInventoryController: ContainerInventoryModal =
  ContainerInventoryModal.getInstance();
