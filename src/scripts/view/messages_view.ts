/**
 * Created by Lukasz Lach on 2017-04-24.
 */
export class MessagesView {
    private screenElement: HTMLDivElement = document.getElementById('messages') as HTMLDivElement;
    private messagesListElement: HTMLUListElement = document.getElementById('messagesList') as HTMLUListElement;
    private messagesList: string[] = []; // array of all logged messages;

    constructor(width: number, height: number) {
        this.screenElement.style.width = `${width}px`;
        this.screenElement.style.height = `${height}px`;
    }
    /**
     * Function responsible for resizing messages window size.
     * @param   newWidth    New messages window width in pixels.
     * @param   newHeight   New messages window height in pixels.
     */
    public changeSize(newWidth: number, newHeight: number): void {
        this.screenElement.style.width = newWidth + 'px';
        this.screenElement.style.height = newHeight + 'px';
    }
    /**
     * Method which puts text message to message view. Message will be put in new line.
     *
     * @param   text        Text which is to be displayed.
     * @param   colour      Optional: colour for displayed message. Default value is 'silver'.
     * @param   font        Optional: font name of displayed text. Default value is 'Monospace'.
     * @param   weight      Optional: font weight of displayed text. Default value is 'normal'.
     * @param   style       Optional: font style of displayed text. Default value is 'normal'. Other possible
     *                      values are italic or oblique.
     */
    public addMessage(
        text: string,
        colour: string = 'silver',
        font: string = 'Courier new',
        weight: string = 'normal',
        style: string = 'normal',
    ): void {
        const messagesListElement: HTMLUListElement = this.messagesListElement;
        let messageNode: HTMLLIElement;
        /*
        * We check if message we want to add isn't exactly same as currently displayed last message. If it is, instead
        * of placing same message again, we append ' x <number>' string to last message.
        */
        if (this.messagesList.length > 0) {
            const messagesList = this.messagesList;
            let sameMessageCount = 1; // variable counting how many same messages have been entered
            let counter = messagesList.length - 1; // pointer to currently examined element of messagesList array.
            let examinedMessage = messagesList[counter];

            while (examinedMessage === text && counter >= 0) {
                sameMessageCount++;
                counter--;
                examinedMessage = messagesList[counter];
            }

            if (sameMessageCount > 1) {
                (messagesListElement.lastChild as HTMLLIElement).innerText = `${messagesList[messagesList.length - 1]}\
                 x ${sameMessageCount}`;
                this.messagesList.push(text); // we store message in messageList array

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

        this.messagesList.push(text); // we store message in messageList array

        messagesListElement.scrollTop = messageNode.offsetTop; // we make scrollbar scroll to the bottom of messages list
    }
    /**
     * Method which appends given text to last message.
     * @param   text    Text message to append to last displayed message.
     */
    public appendMessage(text: string): void {
        this.messagesList[this.messagesList.length - 1] += ' ' + text;
        (this.messagesListElement.lastChild as HTMLElement).innerText += ` ${text}`;
        this.messagesListElement.scrollTop = ( this.messagesListElement.lastChild as HTMLElement).offsetTop;
    }
    /**
     * Removes last displayed message.
     */
    public removeLastMessage(): void {
        this.messagesList.pop();

        if (this.messagesListElement.hasChildNodes()) {
            this.messagesListElement.removeChild(this.messagesListElement.lastChild);
        }
    }
    /**
     * Returns DOM node element where messages are displayed.
     */
    public getScreen(): HTMLDivElement {
        return this.screenElement;
    }
}
