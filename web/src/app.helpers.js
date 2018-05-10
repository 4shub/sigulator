export const translateCode = code => code
    .split(';')
    .map(code => code
        .replace(/([a-z0-9 *&<>]*) ([a-z0-9]*) = ([a-z0-9]*)/i, (match, p1, p2, p3) => {
            if (!p1.trim().length) {
                return match;
            }

            return `let ${p2} = ${p3}`;
        })
        .replace(/(->|::)/g, '.')
        .replace(/\s([0-9.]{1,99})(d|f)/g, match => parseFloat(match))
        .replace(/([a-z ]*)<< (.*)/, (match, p1, p2) =>
            `gsout(${p2.replace(/<</g, ' + ')})`)
        .replace(/new\s(.*)\((.*)\)(\s|$)/gi, (match, p1, p2) => {
            console.log(p2);
            return `new ${p1}(${p2})`;
        }))
    .join(';');
