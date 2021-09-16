import { InventoryController } from '../controller/inventory_controller';
import { ContainerInventoryModalController } from '../controller/container_inventory_modal_controller';

export const globalInventoryController: InventoryController =
  new InventoryController();

export const globalContainerInventoryController: ContainerInventoryModalController =
  ContainerInventoryModalController.getInstance();
