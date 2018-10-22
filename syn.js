var synonymsLib = require("synonyms");

const synonyms = synonymsLib;

// https://www.datamuse.com/api/
// https://www.wordsapi.com
// https://words.bighugelabs.com/api.php

const find = (word) => {
    const moreWords = synonyms(word);
    //console.log(moreWords);
    return moreWords;
};

 
module.exports = {
  find: find,
  synonyms: synonyms
};