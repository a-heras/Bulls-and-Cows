export const el = (tag, options = {}) => {
    const node = document.createElement(tag);
    if (options.className)
        node.className = options.className;
    if (options.text !== undefined)
        node.textContent = options.text;
    for (const [name, value] of Object.entries(options.attrs ?? {})) {
        node.setAttribute(name, value);
    }
    for (const [event, handler] of Object.entries(options.on ?? {})) {
        if (handler)
            node.addEventListener(event, handler);
    }
    for (const child of options.children ?? [])
        node.append(child);
    return node;
};
export const clear = (node) => {
    while (node.firstChild)
        node.removeChild(node.firstChild);
};
//# sourceMappingURL=dom.js.map