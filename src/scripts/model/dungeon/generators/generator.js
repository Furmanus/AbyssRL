import Utility from '../../../helper/utility.js';
import {config} from '../../../global/config';

/**
 * @abstract
 */
export class Generator{

    /**
     * Method responsible for creating rectangle of specified cells on given level.
     * @param {Level} level - {@code Level} object in which we want to create rectangle
     * @param {number} x - horizontal(row) coordinate of upper left corner of rectangle
     * @param {number} y - vertical(column) coordinate of upper left corner of rectangle
     * @param {number} width - width of rectangle
     * @param {number} height - height of rectangle
     * @param {string} cellType - name of cell type we want to fill rectangle with. Name should be equal to keys from cell-data module
     * @param {string} borderType - name of cell type we want to be a border of rectangle. Name should be equal to keys from cell-data module
     * @param {boolean} isRoom - boolean indicating whether created rectangle should be stored in {@code Level} rooms array as room
     * @return {boolean} - Returns true if creation of room was successful, returns false otherwise
     */
    createRectangleRoom(level, x, y, width, height, cellType, borderType, isRoom){

        let startingX = x; //starting horizontal position. We store it in additional variable, because later we will modify x and y
        let startingY = y; //starting vertical position
        let changedCells = []; //we store information about changed cells in array. In the end, if operation was successful, we change those cells by calling map function on this array

        for(let i=0; i<width; i++){

            for(let j=0; j<height; j++){

                //if current cell is beyond view, we stop function
                if(x < 1 || y < 1 || x > config.LEVEL_WIDTH - 1 || y > config.LEVEL_HEIGHT - 1){

                    return false;
                }else if(level.isCellInRoom(x, y)){

                    return false; //if current cell is in space already occupied by other room, we stop function
                }else{
                    //if borderType was specified, and current cell is on border of rectangle
                    if(borderType && (x === startingX || y === startingY || x === startingX + width - 1 || y === startingY + height - 1)){

                        changedCells.push({x: x, y: y, type: borderType});
                    }else{
                        //we put object with coordinates of cell and its final cell type to changedCells array
                        changedCells.push({x: x, y: y, type: cellType});
                    }
                }

                if(y !== startingY + height - 1){

                    y++;
                }else {
                    //if y coordinate is at rectangle height, we reset it
                    y = startingY;
                }
            }

            x++;
        }

        changedCells.forEach(function(item){

            this.cells[item.x][item.y].changeCellType(item.type); //if above operation was successful for every cell, we commit changes to level

        }, level);

        if(isRoom){

            let roomInfo = {

                border: [],
                interior: []
            };

            for(let i=0; i<width; i++){

                for(let j=0; j<height; j++){

                    if(i === 0 || j === 0 || i === width - 1 || j === height - 1){

                        roomInfo.border.push({x: startingX + i, y: startingY + j});
                    }else{

                        roomInfo.interior.push({x: startingX + i, y: startingY + j});
                    }
                }
            }

            level.rooms.push({data: roomInfo, type: 'rectangle', x: startingX, y: startingY, width: width, height: height}); //we push information about rectangle to level object rooms array
        }

        return true;
    }

    /**
     * Method responsible for creating circle shaped rooms of certain tiles and optional border(walls).
     * @param {Level} level - {@code Level} object on which we want to create rectangle
     * @param {number} x - horizontal(row) coordinate of center of circle.
     * @param {number} y - vertical(column) coordinate of center of circle.
     * @param {number} radius - radius of circle.
     * @param {string} cellType - name of cell type we want to fill circle with. Name should be equal to keys from cell-data module.
     * @param {string} borderType - name of cell type we want to be a border of circle. Name should be equal to keys from cell-data module.
     * @param {boolean} isRoom - boolean indicating whether created rectangle should be stored in {@code Level} rooms array as room.
     * @return {boolean} - Returns true if creation of room was successful, returns false otherwise
     */
    createCircleRoom(level, x, y, radius, cellType, borderType, isRoom){

        let changedCells = []; //we store information about changed cells in array. In the end, if operation was successful, we change those cells by calling map function on this array

        //information about coordinates of rooms border and interior, later stored in Level rooms array, if isRoom variable was passed equal to true
        let roomInfo = {

            border: [],
            interior: []
        };

        //if circle at any point go off view, we terminate attempt
        if(x - radius < 0 || x + radius > game.options.LEVEL_WIDTH - 1 || y - radius < 0 || y + radius > game.options.LEVEL_HEIGHT - 1){

            return false;
        }else{

            /*
            / We examine every point in square of upper left coordinates {x: x-radius, y: y-radius}. If examined cell is not a part of already existing room and its distance from
            / center of circle is lesser than circle's radius, we mark cell as slated for change.
            */
            for(let i = x - radius; i <= x + radius; i++){

                for(let j = y - radius; j <= y + radius; j++){

                    if(Utility.getDistance(x, y, i, j) > radius - 1.5 && Utility.getDistance(x, y, i, j) < radius){

                        if(level.isCellInRoom(i, j)) {

                            return false;
                        }else {

                            changedCells.push({x: i, y: j, type: borderType});
                            roomInfo.border.push({x: i, y: j});
                        }
                    }else if(Utility.getDistance(x, y, i, j) < radius){

                        if(level.isCellInRoom(i, j)) {

                            return false;
                        }else {

                            changedCells.push({x: i, y: j, type: cellType});
                            roomInfo.interior.push({x: i, y: j});
                        }
                    }
                }
            }

            //if circle room can be successfully created, we change cell types of every cell from changedCells array
            changedCells.forEach(function(item){

                this.cells[item.x][item.y].changeCellType(item.type); //if above operation was successful for every cell, we commit changes to level

            }, level);

            //if created circle was declared as room by user, we push information about this room to Level rooms array
            if(isRoom){

                level.rooms.push({data: roomInfo, type: 'circle', x: x, y: y, radius: radius});
            }

            return true;
        }
    }
    //TODO naprawić buga z zalewaniem całego poziomu (punkt startu flood filla generuje się poza pomieszczeniem
    /**
     * Method responsible for creating rooms of irregular shape. Room is based on rectangle of upper left corner coordinates (x, y) certain width and height. In first step,
     * random points are chosen near every wall. Next those points are connected clock wise with bresenham line and that shape becomes border of room. Interior of room is created
     * by flood fill algorithm.
     * @param {Level} level - {@code Level} object on which we want to create irregular shaped room
     * @param {number} x - starting horizontal(row) coordinate of upper left corner of room(final upper left coordinate will be different)
     * @param {number} y - starting vertical(column) coordinate of upper left corner of room(final upper left coordinate will be different)
     * @param {number} width - starting width of room(final width will be different)
     * @param {number} height - starting height of room(final width will be different)
     * @param {number} deviation - highest possible distance difference between randomly chosen point and its corresponding wall
     * @param {string} cellType - name of cell type we want to fill room with. Name should be equal to keys from cell-data module.
     * @param {string} borderType - name of cell type we want to be a border of room. Name should be equal to keys from cell-data module.
     * @param {boolean} isRoom - boolean indicating whether created room should be stored in {@code Level} rooms array as room.
     * @return {boolean} - Returns true if creation of room was successful, returns false otherwise
     */
    createIrregularRoom(level, x, y, width, height, deviation, cellType, borderType, isRoom){

        //we check if inital upper left corner of room are within game map or are in another room. In case yes, we stop function
        if(!checkIfValidCoords(x, y)){

            return false;
        }

        if(x + width > game.options.LEVEL_WIDTH - 2 || y + height > game.options.LEVEL_HEIGHT){

            return false;
        }

        let originalX = x; //row(column) coordinate of start of algorithm. Stored in separate variable because x and y are later modified
        let originalY = y;

        let southPoints = []; //array of random points {x: x, y: y} on south wall of room
        let leftPoints = [];
        let rightPoints = [];
        let northPoints = [];

        let directionsArray = [northPoints, rightPoints, southPoints, leftPoints];
        let borderPoints = []; //array of border points {x: x, y: y} filled with bresenham algorithm
        let addedBorderPoints = []; //array of additional border points {x: x, y: y} which are set after points from borderPoints array

        let currentDirection = {x: null, y: null}; //direction of border changes(coordinates can take values only -1 and 1) used for filling border made by bresenham line

        let placementSuccessful = true; //boolean variable indicating whether room can be placed successfully
        let changedCells = []; //array of cells coordinates to be changed at the end of algorithm. Used if variable placementSuccessful remains true at the end of function

        //informations about this room that will be put into Level rooms property
        let roomInfo = {

            interior: [],
            border: []
        };

        generateRandomPoints('SOUTH');
        generateRandomPoints('LEFT');
        generateRandomPoints('RIGHT');
        generateRandomPoints('NORTH');

        Utility.sortArray(southPoints, 'x'); //we sort arrays and reverse south and left points, so we can make border with bresenham line in a clock-wise direction
        Utility.sortArray(leftPoints, 'y');
        Utility.sortArray(rightPoints, 'y');
        Utility.sortArray(northPoints, 'x');

        southPoints.reverse();
        leftPoints.reverse();

        //in case if any of array with random points would be empty, we fill it with one default point
        directionsArray.forEach(function(item, index){

            if(item.length === 0){

                switch(index){

                    case 0:

                        northPoints.push({x: originalX + Math.floor(width / 2), y: originalY});
                        break;

                    case 1:

                        rightPoints.push({x: originalX + width, y: originalY + Math.floor(height / 2)});
                        break;

                    case 2:

                        southPoints.push({x: originalX + Math.floor(width / 2), y: originalY + height});
                        break;

                    case 3:

                        leftPoints.push({x: originalX, y: originalY + Math.floor(height / 2)});
                        break;
                }
            }
        });

        //We connect every generated random point with next point (looking clock-wise) with bresenham line
        for(let n=0; n<directionsArray.length; n++){

            for(let i=0; i<directionsArray[n].length; i++){

                if(i < directionsArray[n].length - 1){

                    //connect all points within single wall(south, right, left, north), except for last point in single array
                    Utility.bresenhamLine(directionsArray[n][i].x, directionsArray[n][i].y, directionsArray[n][i+1].x, directionsArray[n][i+1].y, function(x, y){

                        //we don't do anything with starting point, to avoid doubling points
                        if(x === directionsArray[n][i].x && y === directionsArray[n][i].y){

                            return;
                        }

                        //if coordinates are valid(not beyond map, and not in currently existing room, we add examined cell to changedCells array
                        if(checkIfValidCoords(x, y)) {

                            borderPoints.push({x: x, y: y});
                            changedCells.push({x: x, y: y, cellType: borderType});
                        }else{

                            placementSuccessful = false;
                        }
                    });
                }else{

                    if(n < directionsArray.length - 1) {

                        //we connect last point in single array with first point of next array(for example last point from north wall with first point of right wall)
                        Utility.bresenhamLine(directionsArray[n][i].x, directionsArray[n][i].y, directionsArray[n + 1][0].x, directionsArray[n + 1][0].y, function (x, y) {

                            //we don't do anything with starting point, to avoid doubling points
                            if(x === directionsArray[n][i].x && y === directionsArray[n][i].y){

                                return;
                            }

                            if(checkIfValidCoords(x, y)) {

                                borderPoints.push({x: x, y: y});
                                changedCells.push({x: x, y: y, cellType: borderType});
                            }else{

                                placementSuccessful = false;
                            }
                        });
                    }else{

                        //for last array(left wall), we connect last point with first point of first array(north wall)
                        Utility.bresenhamLine(directionsArray[n][i].x, directionsArray[n][i].y, directionsArray[0][0].x, directionsArray[0][0].y, function (x, y) {

                            //we don't do anything with starting point, to avoid doubling points
                            if(x === directionsArray[n][i].x && y === directionsArray[n][i].y){

                                return;
                            }

                            if(checkIfValidCoords(x, y)) {

                                borderPoints.push({x: x, y: y});
                                changedCells.push({x: x, y: y, cellType: borderType});
                            }else{

                                placementSuccessful = false;
                            }
                        });
                    }
                }
            }
        }

        //we examine current border points and look for gaps in border(where border changes coordinates diagonally)
        for(let i=0; i<borderPoints.length - 1; i++){

            //direction in which border points changes(for example upper left equals to currentDirection.x = -1 and currentDirection.y = -1)
            currentDirection.x = borderPoints[i+1].x - borderPoints[i].x;
            currentDirection.y = borderPoints[i+1].y - borderPoints[i].y;

            //if border moved diagonally, we add border point next to one of currently existing points to fill the gap
            if(currentDirection.x !== 0 && currentDirection.y !== 0){

                if(checkIfValidCoords(borderPoints[i].x + currentDirection.x, borderPoints[i].y)) {

                    addedBorderPoints.push({x: borderPoints[i].x + currentDirection.x, y: borderPoints[i].y});
                    changedCells.push({x: borderPoints[i].x + currentDirection.x, y: borderPoints[i].y, cellType: borderType});
                }else{

                    placementSuccessful = false;
                }
            }
        }

        borderPoints = borderPoints.concat(addedBorderPoints); //merged added border points into original array with border points

        //if every cell was slated successfully for change
        if(placementSuccessful){
            //TODO lepiej wybrać punkt startowy, tak aby zawsze był w środku pomieszczenia, obecnie jest bug gdzie czasami wybiera punkt poza pokojem
            let wasCellChanged = false; //boolean variable indicating whether at least one cell was changed during flood fill algorithm(filling room)

            //we use flood fill algorithm to fill interior of room with chosen cell type. If at least one cell was successfully changed, we allow algorithm to continue further
            Utility.floodFill(borderPoints, originalX + Math.floor(width / 2), originalY + Math.floor(height / 2), function(x, y){

                level.cells[x][y].changeCellType(cellType);

                roomInfo.interior.push({x: x, y: y});

                if(!wasCellChanged){

                    wasCellChanged = true;
                }
            });

            //if room has no interior, we terminate function
            if(!wasCellChanged){

                return false;
            }

            //we change type of border cells. We don't store information about room in roomInfo object just yet. First we need to remove unnecessary border cells (so border always will)
            //be only one tile wide
            changedCells.forEach(function(item){

                level.cells[item.x][item.y].changeCellType(item.cellType);
            });

            /*
            / we remove unnecessary border cells. Often border will be generated like this:
            /
            /   #
            /   #
            /   ## <---
            /  ### <---
            /  #
            / those two border cells in above example are unnecessary
            */
            changedCells.forEach(function(item){

                //if examined border cell doesn't have any interior tile in its surroundings
                if(!checkIfInteriorNearby(item.x, item.y)){

                    //if border cell is unnecessary, we change it to type of nearest exterior (ie. not a border and not inside room) cell
                    level.cells[item.x][item.y].changeCellType(getExteriorTile(item.x, item.y));
                }else{

                    //if certain cell have room interior cells in its surroundings, it remains as valid border and info is stored in roomInfo object
                    roomInfo.border.push({x: item.x, y: item.y});
                }
            });

            if(isRoom) {

                level.rooms.push({data: roomInfo, type: "irregular"});
            }

            return true;
        }else{

            return false;
        }

        //returns type of exterior(ie. not a border and not a room interior) tile cell-data in surroundings of certain tile
        function getExteriorTile(x, y){

            for(let i=-1; i<=1; i++){

                for(let j=-1; j<=1; j++){

                    if(!isInteriorOrBorderTile(x + i, y + j)){

                        return level.cells[x+i][y+j].key;
                    }
                }
            }
        }

        //return boolean variable if certain cell belongs to room border or room interior
        function isInteriorOrBorderTile(x, y){

            for(let i=0; i<roomInfo.interior.length; i++){

                if(roomInfo.interior[i].x === x && roomInfo.interior[i].y === y){

                    return true;
                }
            }

            for(let i=0; i<changedCells.length; i++){

                if(changedCells[i].x === x && changedCells[i].y === y){

                    return true;
                }
            }

            return false;
        }

        //returns boolean variable indicating whether certain cell is nearby cell in room interior
        function checkIfInteriorNearby(x, y){

            for(let i=-1; i<=1; i++){

                for(let j=-1; j<=1; j++){

                    for(let n=0; n<roomInfo.interior.length; n++){

                        if(roomInfo.interior[n].x === x + i && roomInfo.interior[n].y === y + j){

                            return true;
                        }
                    }
                }
            }

            return false;
        }

        function checkIfValidCoords(x, y){

            if(x < 1 || y < 1 || x > game.options.LEVEL_WIDTH - 2 || y > game.options.LEVEL_HEIGHT - 2){

                return false;
            }

            if(level.isCellInRoom(x, y)){

                return false;
            }

            return true;
        }

        function generateRandomPoints(wallDirection){

            let currentPoint = {x: null, y: null};

            for(let i=0; i<ROT.RNG.getUniformInt(1, 3); i++) {

                let generatedPoint = {x: null, y: null};

                switch (wallDirection) {

                    case 'SOUTH':

                        generatedPoint.x = ROT.RNG.getUniformInt(x, x + width - 1);
                        generatedPoint.y = ROT.RNG.getUniformInt(y - 1 + height, y + height - 1 + deviation);

                        if(generatedPoint.x !== currentPoint.x && checkIfValidCoords(generatedPoint.x, generatedPoint.y)) {

                            southPoints.push({x: generatedPoint.x, y: generatedPoint.y});

                            currentPoint.x = generatedPoint.x;
                            currentPoint.y = generatedPoint.y;
                        }
                        break;

                    case 'LEFT':

                        generatedPoint.x = ROT.RNG.getUniformInt(x - deviation, x);
                        generatedPoint.y = ROT.RNG.getUniformInt(y, y + height - 1);

                        if(generatedPoint.y !== currentPoint.y && checkIfValidCoords(generatedPoint.x, generatedPoint.y)) {

                            leftPoints.push({x: generatedPoint.x, y: generatedPoint.y});

                            currentPoint.x = generatedPoint.x;
                            currentPoint.y = generatedPoint.y;
                        }
                        break;

                    case 'RIGHT':

                        generatedPoint.x = ROT.RNG.getUniformInt(x - 1 + width, x - 1 + width + deviation);
                        generatedPoint.y = ROT.RNG.getUniformInt(y, y + height - 1);

                        if(generatedPoint.y !== currentPoint.y && checkIfValidCoords(generatedPoint.x, generatedPoint.y)) {

                            rightPoints.push({x: generatedPoint.x, y: generatedPoint.y});

                            currentPoint.x = generatedPoint.x;
                            currentPoint.y = generatedPoint.y;
                        }
                        break;

                    case 'NORTH':

                        generatedPoint.x = ROT.RNG.getUniformInt(x, x + width - 1);
                        generatedPoint.y = ROT.RNG.getUniformInt(y - deviation, y);

                        if(generatedPoint.x !== currentPoint.y && checkIfValidCoords(generatedPoint.x, generatedPoint.y)) {

                            northPoints.push({x: generatedPoint.x, y: generatedPoint.y});

                            currentPoint.x = generatedPoint.x;
                            currentPoint.y = generatedPoint.y;
                        }
                        break;
                }
            }
        }
    }

    //TODO zrobić drugie połączenie jeżeli pierwsze nie wypaliło
    //TODO znowu coś się pierdoli z połączeniami, gdy pokoje leżą w jednej poziomej lub pionowej linii
    connectRooms(level, room1, room2, cellType, borderType){

        const centerRoom1 = room1.data.interior.random(); //we pick one random point for each room
        const centerRoom2 = room2.data.interior.random();

        let chosenWaypoint; //waypoint chosen from two possible waypoints
        let canConnect = true; //boolean variable indicating whether two rooms can be connected or not(changed to false whether algorithm encounters another room or corridor on its way)

        let direction = null; //direction of next step of making corridor. Can be HORIZONTAL or VERTICAL
        const lastPosition = {x: null, y: null}; //last position we marked cell to change its type

        const changedCells = []; //array of cells slated to change if algorithm worked successfully

        /*
        / We define two waypoints. Waypoints are based on centerRoom points. First waypoint has x coordinate from first centerRoom point, and y coordinate from another(and vice versa
        / for second point)
        /
        /   ####
        /   #  #
        /   # O#---------X
        /   ####         |
        /     |          |
        /     |          |
        /     |      ##########
        /     |      #   |    #
        /     X------#---O    #
        /            #        #
        /            ##########
        /
        / O - centerRoom points
        / X - waypoints
        */
        let waypoint1 = {x: centerRoom1.x, y: centerRoom2.y, valid: true};
        let waypoint2 = {x: centerRoom2.x, y: centerRoom1.y, valid: true};

        //We verify whether waypoints are in other existing rooms on level. If yes, our connecting corridor can't lead through them.
        for(let i=0; i<level.rooms.length; i++){

            if(level.rooms[i] === room1 || level.rooms[i] === room2){

                continue;
            }

            //check which waypoint(or both) is valid
            if(Utility.findCoords(level.rooms[i].data.border, waypoint1.x, waypoint1.y) || Utility.findCoords(level.rooms[i].data.interior, waypoint1.x, waypoint1.y)){

                waypoint1.valid = false;
            }else{

                waypoint1.valid = true;
            }

            if(Utility.findCoords(level.rooms[i].data.border, waypoint2.x, waypoint2.y) || Utility.findCoords(level.rooms[i].data.interior, waypoint2.x, waypoint2.y)){

                waypoint2.valid = false;
            }else{

                waypoint2.valid = true;
            }
        }

        //if both waypoints are in other rooms, we can't connect our rooms and terminate function
        if(waypoint1.valid === false && waypoint2.valid === false){

            return false;
        }

        //we chose waypoint. If both are valid we chose one randomly
        if(waypoint1.valid){

            chosenWaypoint = waypoint1;
        }else{

            chosenWaypoint = waypoint2;
        }

        if(waypoint1.valid && waypoint2.valid && Math.random() < 0.5){

            chosenWaypoint = waypoint2;
        }

        //we make a line from centerRoom1 point to chosenWaypoint with bresenham line
        Utility.bresenhamLine(centerRoom1.x, centerRoom1.y, chosenWaypoint.x, chosenWaypoint.y, function(x, y){

            let directionX = x - lastPosition.x; //horizontal direction of current move(compared to last move)
            let directionY = y - lastPosition.y;

            //if horizontal direction is equal to 0 it means that movement was vertical(and vice versa)
            if(directionX === 0){

                direction = 'VERTICAL';
            }else{

                direction = 'HORIZONTAL';
            }

            //if currently examined cell is on border of first room, we mark it as possible door location
            if(isCellRoomBorder(room1, x, y)){

                changedCells.push({x: x, y: y, cellType: cellType, door: room1});

                lastPosition.x = x;
                lastPosition.y = y;

                return;

            //if currently examined cell is in one of both rooms interior, we don't do anything
            }else if(isCellRoomInterior(room1, x, y) || isCellRoomInterior(room2, x, y)){

                return;
            }else{

                //otherwise we check if currently examined cell is any other of level rooms interior or border. If it is, connection can't be made
                level.rooms.forEach(function(item){

                    if(item !== room1 && item !== room2){

                        if(isCellRoomBorder(item, x, y) || isCellRoomInterior(item, x, y)){

                            canConnect = false;
                        }
                    }
                });
            }


            if(x === chosenWaypoint.x && y === chosenWaypoint.y){

                if(borderType) {
                    //we calculate last direction and direction of next move, to look where corridor will turn and which cells we have to change to border cells
                    /*
                    /   C - chosen waypoint, B - border, X - corridor path
                    /
                    /      BXB
                    /   BBBBXB
                    /   XXXXC <--- those two cells have to be changed to border manually
                    /   BBBBB <---
                    /   Last direction: (1, 0)
                    /   New direction: (0, -1)
                    /   Borders has to be set at points:
                    /   {x: chosenWaypoint.x + 1, y: chosenWaypoint.y + 0} and
                    /   {x: chosenWaypoint.x + 1, y: chosenWaypoint.y + 1}
                    */
                    let lastDirection = Utility.convertCoordsToDirection(lastPosition, chosenWaypoint);
                    let newDirection = Utility.convertCoordsToDirection(chosenWaypoint, centerRoom2);

                    changedCells.push({
                        x: chosenWaypoint.x + lastDirection.x,
                        y: chosenWaypoint.y + lastDirection.y,
                        cellType: borderType
                    });
                    changedCells.push({
                        x: chosenWaypoint.x + lastDirection.x - newDirection.x,
                        y: chosenWaypoint.y + lastDirection.y - newDirection.y,
                        cellType: borderType
                    });
                }
                return;
            }

            changedCells.push({x: x, y: y, cellType: cellType});

            //we place borders on both sides of created corridor
            placeBorders(x, y);

            lastPosition.x = x;
            lastPosition.y = y;
        });

        direction = null; //reset direction variable before drawing another line

        Utility.bresenhamLine(chosenWaypoint.x, chosenWaypoint.y, centerRoom2.x, centerRoom2.y, function(x, y){

            let directionX = x - lastPosition.x;
            let directionY = y - lastPosition.y;

            if(directionX === 0){

                direction = 'VERTICAL';
            }else if(directionY === 0){

                direction = 'HORIZONTAL';
            }

            if(isCellRoomBorder(room2, x, y)){

                changedCells.push({x: x, y: y, cellType: cellType, door: room2});
            }else if(isCellRoomInterior(room2, x, y) || isCellRoomInterior(room1, x, y)){

                return;
            }else{

                //we check if current point belongs to any other room in level
                level.rooms.forEach(function(item){

                    if(item !== room1 && item !== room2){

                        if(isCellRoomBorder(item, x, y) || isCellRoomInterior(item, x, y)){

                            canConnect = false;
                        }
                    }
                });
            }

            if(x === chosenWaypoint.x && y === chosenWaypoint.y){

                lastPosition.x = null;
                lastPosition.y = null;
            }

            changedCells.push({x: x, y: y, cellType: cellType});

            if(direction) {

                placeBorders(x, y);
            }

            lastPosition.x = x;
            lastPosition.y = y;
        });

        if(canConnect){

            changedCells.forEach(function(item){

                level.cells[item.x][item.y].changeCellType(item.cellType);

                if(item.door){

                    level.rooms[level.rooms.indexOf(item.door)].doors = {x: item.x, y: item.y};
                }
            });

            return true;
        }else{

            return false;
        }

        //UTILITY FUNCTIONS

        function isCellRoomBorder(room, x, y){

            for(let i=0; i<room.data.border.length; i++){

                if(room.data.border[i].x === x && room.data.border[i].y === y){

                    return true;
                }
            }

            return false;
        }

        function isCellRoomInterior(room, x, y){

            for(let i=0; i<room.data.interior.length; i++){

                if(room.data.interior[i].x === x && room.data.interior[i].y === y){

                    return true;
                }
            }

            return false;
        }

        function placeBorders(x, y){

            if(borderType) {

                if (direction === 'HORIZONTAL') {

                    changedCells.push({x: x, y: y - 1, cellType: borderType});
                    changedCells.push({x: x, y: y + 1, cellType: borderType});
                } else if (direction === 'VERTICAL') {

                    changedCells.push({x: x - 1, y: y, cellType: borderType});
                    changedCells.push({x: x + 1, y: y, cellType: borderType});
                }
            }
        }
    }
}