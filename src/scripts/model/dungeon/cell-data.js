import {terrain} from '../../constants/sprites';

export default {

    "red_floor": {

        "key": "red_floor",
        "display": [terrain.RED_FLOOR],
        "blockMovement": false,
        "confirmMovement": false,
        "blockLos": false,
        "description": "a brick floor",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    },
    "wooden_floor": {

        "key": "wooden_floor",
        "display": [terrain.WOODEN_FLOOR_1, terrain.WOODEN_FLOOR_2],
        "blockMovement": false,
        "confirmMovement": false,
        "blockLos": false,
        "description": "a wooden floor",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null

    },
    "wooden_door": {

        "key": "doors",
        "display": [terrain.WOODEN_DOORS],
        "blockMovement": true,
        "confirmMovement": false,
        "blockLos": true,
        "description": "a wooden doors",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null

    },
    "gray_wall":{

        "key": "gray_wall",
        "display": [terrain.GRAY_WALL],
        "blockMovement": true,
        "confirmMovement": false,
        "blockLos": true,
        "description": "a stone wall",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    },
    "fountain": {

        "key": "fountain",
        "display": [terrain.FOUNTAIN],
        "blockMovement": true,
        "confirmMovement": false,
        "blockLos": false,
        "description": "a fountain",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    },
    "high_peaks": {

        "key": "high_peaks",
        "display": [terrain.HIGH_PEAKS],
        "blockMovement": true,
        "confirmMovement": false,
        "blockLos": true,
        "description": "a high mountain",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    },
    "mountain": {

        "key": "mountain",
        "display": [terrain.MOUNTAIN],
        "blockMovement": true,
        "confirmMovement": false,
        "blockLos": true,
        "description": "a mountain",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    },
    "grass": {

        "key": "grass",
        "display": [terrain.GRASS_2],
        "blockMovement": false,
        "confirmMovement": false,
        "blockLos": false,
        "description": "a grass",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    },
    "lava": {
        "key": "lava",
        "display": [terrain.LAVA],
        "blockMovement": false,
        "confirmMovement": true,
        "blockLos": false,
        "description": "a lava",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    },
    "test": {

        "key": "grass",
        "display": ["fighter"],
        "blockMovement": false,
        "confirmMovement": false,
        "blockLos": false,
        "description": "a grass",
        "walkMessage": "",
        "modifiers": null,
        "walkEffect": null
    }
};