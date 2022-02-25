import { InventoryController } from '../inventory/inventory.controller';
import { ContainerInventoryModalController } from '../modal/containerInventory/containerInventoryModal.controller';

export const globalInventoryController: InventoryController =
  new InventoryController();

export const globalContainerInventoryController: ContainerInventoryModalController =
  ContainerInventoryModalController.getInstance();
