/**
 * Created by Docent Furman on 2017-04-24.
 */
class Messages{

    constructor(width, height){

        this.screen = document.getElementById('messages');
        this.screen.style.width = width + 'px';
        this.screen.style.height = height + 'px';
        this.messagesList = []; //array of all logged messages 
    }

    /**
     * Function responsible for resizing messages window size.
     * @param newWidth New messages window width in pixels.
     * @param newHeight New messages window height in pixels.
     * @return Returns nothing.
     */
    changeSize(newWidth, newHeight){

        this.screen.style.width = newWidth + 'px';
        this.screen.style.height = newHeight + 'px';
    }

    /**
     * Method which puts {@code String} text message to message view. Message will be put in new line.
     * @param text {@code String} text which is to be displayed.
     * @param colour {@code String} Optional: colour for displayed message. Default value is 'silver'.
     * @param font {@code String} Optional: font name of displayed text. Default value is 'Monospace'.
     * @param weight {@code String} Optional: font weight of displayed text. Default value is 'normal'.
     * @param style {@code String} Optional: font style of displayed text. Default value is 'normal'.
     */
    addMessage(text, colour, font, weight, style){

        /*
        * We check if message we want to add isn't exactly same as currently displayed last message. If it is, instead of placing same message again, we append ' x <number' String to
        * last message.
        */
        if(this.messagesList.length > 0) {

            let sameMessageCount = 1; //variable counting how many same messages have been entered
            let counter = this.messagesList.length - 1; //pointer to currently examined element of messagesList array. We start from last element.
            let examinedMessage = this.messagesList[counter];

            while(examinedMessage === text && counter >= 0){

                sameMessageCount++;
                counter--;
                examinedMessage = this.messagesList[counter];
            }

            if(sameMessageCount > 1){

                document.getElementById('messagesList').lastChild.innerText = this.messagesList[this.messagesList.length - 1] + ' x ' + sameMessageCount;
                this.messagesList.push(text); //we store message in messageList array

                return;
            }
        }

        let messageNode = document.createElement('li');
        let fontColour = colour ? colour : 'silver'; //sets font color
        let fontName = font ? font : 'Courier new'; //sets font name
        let fontWeight = weight ? weight : 'normal'; //sets font weight
        let fontStyle = style ? style : 'normal'; //sets font style (italic or oblique)

        messageNode.style.color = fontColour; // add styles to DOM node
        messageNode.style.font = fontName;
        messageNode.style.fontWeight = fontWeight;
        messageNode.style.fontStyle = fontStyle;
        messageNode.style.fontSize = '18px';
        messageNode.innerText = text;
        document.getElementById('messagesList').appendChild(messageNode);

        this.messagesList.push(text); //we store message in messageList array

        document.getElementById('messagesList').scrollTop = messageNode.offsetTop; //we make scrollbar scroll to the bottom of messages list
    }

    /**
     * Method which appends given {@code String} text to last message.
     * @param text {@code String} text message to append to last displayed message.
     */
    appendMessage(text){

        this.messagesList[this.messagesList.length - 1] += ' ' + text;
        document.getElementById('messagesList').lastChild.innerText += ' ' + text;
        document.getElementById('messagesList').scrollTop = document.getElementById('messagesList').lastChild.offsetTop; //we make scrollbar scroll to the bottom of messages list
    }

    /**
     * Returns DOM node element where messages are displayed.
     * @return {Element|*}
     */
    getScreen(){

        return this.screen;
    }
}

module.exports = Messages;