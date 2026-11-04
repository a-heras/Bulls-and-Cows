type ElementOptions = {
  className?: string;
  text?: string;
  attrs?: Record<string, string>;
  on?: Partial<Record<keyof HTMLElementEventMap, (event: Event) => void>>;
  children?: Node[];
};

export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (options.className) node.className = options.className;
  if (options.text !== undefined) node.textContent = options.text;
  for (const [name, value] of Object.entries(options.attrs ?? {})) {
    node.setAttribute(name, value);
  }
  for (const [event, handler] of Object.entries(options.on ?? {})) {
    if (handler) node.addEventListener(event, handler);
  }
  for (const child of options.children ?? []) node.append(child);
  return node;
};

export const clear = (node: HTMLElement): void => {
  while (node.firstChild) node.removeChild(node.firstChild);
};
