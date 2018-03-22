/**
 * Created by Docent Furman on 2017-04-24.
 */

import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Class representing information section on game view. Section is split into two parts: first part is player information (hit points, stats, name), second part is about game
 * enviroment(visible monsters, objects).
 */
class Info{

    constructor(width, height){

        this.screen = document.getElementById("info");
        this.screen.style.width = width + 'px';
        this.screen.style.height = height + 'px';
    }

    /**
     * Function responsible for resizing info window size.
     * @param {number} newWidth New info window width in pixels.
     * @param {number} newHeight New info window height in pixels.
     */
    changeSize(newWidth, newHeight){

        this.screen.style.width = newWidth + 'px';
        this.screen.style.height = newHeight + 'px';
    }

    getScreen(){

        return this.screen;
    }
}

module.exports = Info;
