/**
 * Main controller. Responsible for taking user keyboard input, processing it, and triggering appriopiate methods from other sub controllers. Also responsible for managing all
 * sub controllers.
 */
export class MainController{

    constructor(){
        this.gameController = new GameController();
        this.infoController = new InfoController();
        this.miniMapController = new MiniMapController();
        this.messagesController = new MessagesController();
    }
}