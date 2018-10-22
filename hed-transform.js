var syn = require("./syn");
var sentence = require('./sentence');
var datamuse = require('./datamuse');

const fromOneMany = async (source) => {
    const set = [];
    var fixedSource = source
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
    sentence.init(fixedSource);
    sentence.normalizeIt();
    sentence.deContract();
    const normalizedSource = sentence.out();
    set.push(normalizedSource);
    console.log('Normalized:', normalizedSource);
    sentence.init(normalizedSource);
    // const contractedSentence = sentence.contract();
    // if ('' !== contractedSentence){
    //  set.push(contractedSentence);
    // }
    console.log('Contracted:', sentence.contract());
    sentence.init(normalizedSource);
    let promisesAll = [];
    var verbSet = {};
    promisesAll = sentence.findVerbs().map(async (element) => {
        console.log('Found Verb:', element);
        try {
            const synVerbs = syn.find(element).v;
            const dataMuseVerbs = await datamuse.getVerbSynonymsArray(element);
            let verbs = [];
            if (synVerbs && Array.isArray(synVerbs)){
              verbs = dataMuseVerbs.concat(synVerbs);
            } else {
              verbs =  dataMuseVerbs;
            }
            if (verbs == [] || verbs === undefined) {
                return;
            }
            
            console.log('verb synonyms', verbs);
            verbs.shift();
            verbSet[element] = verbs;
            return verbs;
          
        } catch (error) { return false; } finally {}
    });
    await Promise.all(promisesAll);
  
    var adjSet = {};
    promisesAll = sentence.findAdjectives().map(async (element) => {
        console.log('Found Adj:', element);
        try {
            const synAdjs = syn.find(element).s;
            const dataMuseAdjs = await datamuse.getAdjSynonymsArray(element);
            let adjs = [];
            if (synAdjs && Array.isArray(synAdjs)){
              adjs = dataMuseAdjs.concat(synAdjs);
            } else {
              adjs =  dataMuseAdjs;
            }
            if (adjs == [] || adjs === undefined) {
                return;
            }
            console.log('adj synonyms', adjs);
            promisesAll = promisesAll.concat(adjs);
            adjs.shift();
            adjSet[element] = adjs;
        } catch (error) {} finally {}
    });
    await Promise.all(promisesAll);
  
    var both = [];
    
    for (const prop in verbSet) {
        if (verbSet.hasOwnProperty(prop)) {
            var alternates = verbSet[prop];
            alternates.forEach((element) => {
                var newSent = normalizedSource.replace(prop, element);
                console.log('New Sentence:', newSent);
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
                console.log('New Sentence:', newSent);
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

// module.exports.fromOneMany = fromOneMany;

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const shuffleTheReturn = async (aString) => {
  const theSet = await fromOneMany(aString);
  console.log('set o heds ', theSet);
  var filteredSetFirstPass = theSet.filter(function (el) {
    return el != null;
  });
  var filteredSet = filteredSetFirstPass.filter(function (el) {
    return el != '';
  });
  const theSelection = Math.floor(Math.random() * filteredSet.length );
  const lowerCaseHed = filteredSet[theSelection];
  return toTitleCase(lowerCaseHed);
}

module.exports = {
  shuffleTheReturn: shuffleTheReturn,
  fromOneMany: fromOneMany
};

// console.log(fromOneMany("Sudan, the Last Male Northern White Rhino, Dies in Kenya."));