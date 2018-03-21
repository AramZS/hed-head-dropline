var nlp = require('compromise');

var subject = '';

module.exports.nlp = nlp;

module.exports.init = (sentence) => {
    subject = nlp(sentence);
}

module.exports.findProperNouns = () => {
    const nounData = subject.topics().data();
    const nouns = [];
    nounData.forEach((element) => {
        nouns.push(element.text)
    });
    console.log(nouns);
    return nouns;
}

module.exports.findNumberValue = () => {
    return subject.values().out('array');
}

module.exports.sentenceSplit = () => {
    return subject.sentences().out('array');
}

module.exports.normalizeIt = () => {
    return subject.normalize().out('text');
}

module.exports.findVerbs = () => {
    return subject.verbs().out("array");
}

module.exports.findAdjectives = () => {
    return subject.adjectives().out('array');
}

module.exports.deContract = () => {
    return subject.contractions().expand().out();
}

module.exports.contract = () => {
    return subject.contractions().contract().out();
}

module.exports.out = () => {
    return subject.out('text');
}