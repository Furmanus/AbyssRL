let tileset: HTMLImageElement;

interface ITilesObject {
    tileset: HTMLImageElement;
}

export const tilesetObject: ITilesObject = {
    get tileset(): HTMLImageElement {
        return tileset;
    },
    set tileset(tilesImage: HTMLImageElement) {
        tileset = tilesImage;
    },
};
