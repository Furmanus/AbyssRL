export function dispatchChangeEvent(element: HTMLElement): void {
  const event = new Event('change', {
    bubbles: true,
    cancelable: true,
  });

  element.dispatchEvent(event);
}
