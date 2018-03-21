var synonyms = require("synonyms");

module.exports.synonyms = synonyms;

module.exports.find = (word) => {
    const moreWords = synonyms(word);
    //console.log(moreWords);
    return moreWords;
};