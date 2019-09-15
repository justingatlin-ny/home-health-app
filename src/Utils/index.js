const replaceAll = (replace, text) => {
    const re = new RegExp(replace,'g');
    return text.replace(re, ' ');
}

export { replaceAll };