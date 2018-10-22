var nlp = require('compromise');

//var subject = '';

module.exports = {
  
  subject: '',

  init: (sentence) => {
      this.subject = nlp(sentence);
  },

  findProperNouns: () => {
      const nounData = this.subject.topics().data();
      const nouns = [];
      nounData.forEach((element) => {
          nouns.push(element.text)
      });
      console.log(nouns);
      return nouns;
  },

  findNumberValue: () => {
      return this.subject.values().out('array');
  },

  sentenceSplit: () => {
      return this.subject.sentences().out('array');
  },

  normalizeIt: () => {
      return this.subject.normalize().out('text');
  },

  findVerbs: () => {
      return this.subject.verbs().out("array");
  },

  findAdjectives: () => {
      return this.subject.adjectives().out('array');
  },
  
  deContract: () => {
      return this.subject.contractions().expand().out();
  },

  contract: () => {
      return this.subject.contractions().contract().out();
  },

  out: () => {
      return this.subject.out('text');
  }

};