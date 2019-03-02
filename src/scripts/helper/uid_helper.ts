export function uid(): string {
    return `${Date.now()}${Math.random()}${Math.random()}`;
}
