const datamuse = require('datamuse');

const getSynonyms = ( wordOrPhrase ) => {
  return new Promise(function(resolve, reject) {
    datamuse.request('words?ml='+wordOrPhrase)
    .then((json) => {
      resolve(json);
      //do it!
    });
  });
}

const getAdjSynonymsArray = async ( wordOrPhrase ) => {
  const synonyms = await getSynonyms(wordOrPhrase);
  const adjSynonyms = [];
  synonyms.forEach((synObject) => {
    if ( synObject.tags.includes('syn') && synObject.tags.includes('adj') ){
      adjSynonyms.push(synObject.word);
    }
  });
  return adjSynonyms;
};

const getVerbSynonymsArray = async ( wordOrPhrase ) => {
  const synonyms = await getSynonyms(wordOrPhrase);
  const vSynonyms = [];
  synonyms.forEach((synObject) => {
    if ( synObject.tags.includes('syn') && synObject.tags.includes('v') ){
      vSynonyms.push(synObject.word);
    }
  });
  return vSynonyms;
  
};

const getNounSynonymsArray = async ( wordOrPhrase ) => {
  const synonyms = await getSynonyms(wordOrPhrase);
  const nSynonyms = [];
  synonyms.forEach((synObject) => {
    if ( synObject.tags.includes('syn') && synObject.tags.includes('n') ){
      nSynonyms.push(synObject.word);
    }
  });
  return nSynonyms;
  
};

module.exports = {
  getAdjSynonymsArray: getAdjSynonymsArray,
  getVerbSynonymsArray: getVerbSynonymsArray,
  getNounSynonymsArray: getNounSynonymsArray
};