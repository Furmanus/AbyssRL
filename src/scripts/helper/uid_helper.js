export function uid() {
    return `${Date.now()}${Math.random()}${Math.random()}`;
}