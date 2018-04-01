/**
 * Created by Docent Furman on 2017-04-24.
 */
export class MessagesView{

    constructor(width, height){
        this.screen = document.getElementById('messages');
        this.screen.style.width = width + 'px';
        this.screen.style.height = height + 'px';
        this.messagesList = []; //array of all logged messages
    }
    /**
     * Function responsible for resizing messages window size.
     * @param {number}  newWidth    New messages window width in pixels.
     * @param {number}  newHeight   New messages window height in pixels.
     */
    changeSize(newWidth, newHeight){
        this.screen.style.width = newWidth + 'px';
        this.screen.style.height = newHeight + 'px';
    }
    /**
     * Method which puts {@code String} text message to message view. Message will be put in new line.
     * @param {string}  text        Text which is to be displayed.
     * @param {string}  colour      Optional: colour for displayed message. Default value is 'silver'.
     * @param {string}  font        Optional: font name of displayed text. Default value is 'Monospace'.
     * @param {string}  weight      Optional: font weight of displayed text. Default value is 'normal'.
     * @param {string}  style       Optional: font style of displayed text. Default value is 'normal'. Other possible values are italic or oblique.
     */
    addMessage(text, colour = 'silver', font = 'Courier new', weight = 'normal', style = 'normal'){
        const messagesListElement = document.getElementById('messagesList');
        let messageNode;
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

                messagesListElement.lastChild.innerText = this.messagesList[this.messagesList.length - 1] + ' x ' + sameMessageCount;
                this.messagesList.push(text); //we store message in messageList array

                return;
            }
        }

        messageNode = document.createElement('li');

        messageNode.style.color = colour; // add styles to DOM node
        messageNode.style.font = font;
        messageNode.style.fontWeight = weight;
        messageNode.style.fontStyle = style;
        messageNode.style.fontSize = '18px';
        messageNode.innerText = text;
        messagesListElement.appendChild(messageNode);

        this.messagesList.push(text); //we store message in messageList array

        messagesListElement.scrollTop = messageNode.offsetTop; //we make scrollbar scroll to the bottom of messages list
    }
    /**
     * Method which appends given {@code String} text to last message.
     * @param {string}  text    Text message to append to last displayed message.
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