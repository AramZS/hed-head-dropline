var syn = require("./syn");
var sentence = require('./sentence');

const fromOneMany = (source) => {
    const set = [];
    sentence.init(source);
    sentence.normalizeIt();
    sentence.deContract();
    const normalizedSource = sentence.out();
    set.push(normalizedSource);
    //console.log('Normalized:', normalizedSource);
    sentence.init(normalizedSource);
    set.push(sentence.contract());
    //console.log('Contracted:', sentence.contract());
    sentence.init(normalizedSource);
    var verbSet = {};
    sentence.findVerbs().forEach((element) => {
        // console.log('Found Verb:', element);
        try {
            const verbs = syn.find(element).v;
            if (verbs == [] || verbs === undefined) {
                return;
            }
            verbs.shift();
            verbSet[element] = verbs;
        } catch (error) {} finally {}
    });
    var adjSet = {};
    sentence.findAdjectives().forEach((element) => {
        // console.log('Found Adj:', element);
        try {
            const adjs = syn.find(element).s;
            if (adjs == [] || adjs === undefined) {
                return;
            }
            adjs.shift();
            adjSet[element] = adjs;
        } catch (error) {} finally {}
    });
    var both = [];
    for (const prop in verbSet) {
        if (verbSet.hasOwnProperty(prop)) {
            var alternates = verbSet[prop];
            alternates.forEach((element) => {
                var newSent = normalizedSource.replace(prop, element);
                //console.log('New Sentence:', newSent);
                set.push(newSent);
                both.push(newSent);
            });
        }
    }
    for (const prop in adjSet) {
        if (adjSet.hasOwnProperty(prop)) {
            var alternates = adjSet[prop];
            alternates.forEach((element) => {
                var newSent = normalizedSource.replace(prop, element);
                set.push(newSent);
                //console.log('New Sentence:', newSent);
                both.forEach((sentAlt) => {
                    var otherNewSent = sentAlt.replace(prop, element);
                    set.push(otherNewSent);
                    console.log('New Sentence:', otherNewSent);
                });
            });
        }
    }
    return set;
};

module.exports.fromOneMany = fromOneMany;

console.log(fromOneMany("Sudan, the Last Male Northern White Rhino, Dies in Kenya."));