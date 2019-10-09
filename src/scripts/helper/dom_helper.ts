export function clearElement(element: HTMLElement): void {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
/**
 * Method which for given array of HTML Unordered lists returns array of HTML List Items.
 *
 * @param list  Array of lists
 */
export function getHTMLListsChildrensArray(list: HTMLUListElement[]): HTMLLIElement[] {
    return list.reduce((previous: HTMLLIElement[], current: HTMLUListElement) => {
        Array.from(current.children).forEach((listItem: HTMLLIElement) => {
            previous.push(listItem);
        });

        return previous;
    }, []);
}
