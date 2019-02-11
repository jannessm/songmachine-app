define(function(require, exports, module) {
  "use strict";
  
  var SongmachineHighlightRules = function() {

    this.getRules = () => this.$rules;
  
    this.highlightStates = {
      color: "",
      italic: false,
      bold: false,
      resetColor: false,
      resetItalic: false,
      resetBold: false
    };
    
    this.resetStates = function() {
      this.highlightStates = {
        color: "",
        italic: false,
        bold: false,
        resetColor: false,
        resetItalic: false,
        resetBold: false
      };
    }
      
    this.getClasses = function(){
      let italic = this.highlightStates.italic ? "italic" : "";
      let bold = this.highlightStates.bold ? "bold" : "";
      
      let color = (!!this.highlightStates.color || !!italic || !!bold) ? this.highlightStates.color : 'text';
      if(this.highlightStates.resetColor){
        this.highlightStates.color = "";
      }
      if(this.highlightStates.resetItalic){
        this.highlightStates.italic = false;
      }
      if(this.highlightStates.resetBold){
        this.highlightStates.bold = false;
      }
      return [color, italic, bold].filter(val => !!val).join('_');
    }
    
    this.setColor = function(color){
      if (this.highlightStates.color === color) {
        this.highlightStates.resetColor = true;
      } else {
        this.highlightStates.color = color;
      }
    }
  
    this.$rules = {
      "start" : [
          {token : "br_block", regex : /(\[)(?=[^\]]*?:.*\])/, next: "br_block"},
          {token : "chord_start", regex : /(\[)(?![^\]]*?:)(?=[^\]]*\])/, next: "chord"},
          //colors
          {token : () => {
              this.setColor("red")
              return this.getClasses();
          }, regex : /<r>[^\|\[]*?/},
          {token : () => {
              this.setColor("green")
              return this.getClasses();
          }, regex : /<g>[^\|\[]*?/},
          {token : () => {
              this.setColor("blue")
              return this.getClasses();
          }, regex : /<b>[^\|\[]*?/},
          
          {token : () => {
            if (this.highlightStates.italic) {
              this.highlightedStates.resetItalic = true;
            } else {
              this.highlightStates.italic = true;
            }
            return this.getClasses();
          }, regex : /\*(?!\*)/},
          {token : () => {
            if (this.highlightStates.bold) {
              this.highlightedStates.resetBold = true;
            } else {
              this.highlightStates.bold = true;
            }
            return this.getClasses();
          }, regex : /\*\*(?!\*)/},
          {token : () => {
            if (this.highlightStates.italic) {
              this.highlightedStates.resetItalic = true;
            } else {
              this.highlightStates.italic = true;
            }
            if (this.highlightStates.bold) {
              this.highlightedStates.resetBold = true;
            } else {
              this.highlightStates.bold = true;
            }
            return this.getClasses();
          }, regex : /\*\*\*(?!\*)/},
          {token: () => {
              return this.getClasses();
          }, regex: /[^\|]/},
          {token : () => {this.resetStates(); return 'text';}, regex : /$/},
          {token : () => {this.resetStates(); return 'text';}, regex : "|", next: "annotations"},
          {defaultToken : "text"},
          {caseInsensitive: true}
      ],
      "br_block": [
          {token: "br_block", regex: /[^:]/},
          {token: "br_block", regex: /:/, next: "br"},
          {token: "value", regex: /./},
      ],
      "br": [
          {token: "br", regex: /[^;\]]/},
          {token: "br_block", regex: /;/, next: "br_block"},
          {token: "br_block", regex: "]", next: "start"},
      ],
      "chord": [
          {token: "chord_start", regex: "]", next: "start"},
          {token: "chord", regex : /[^\]]/},
      ],
      "annotations": [
        //colors
        {token : () => {
          this.setColor("red")
          return this.getClasses();
        }, regex : /<r>[^\|;]*?/},
        {token : () => {
          this.setColor("green")
          return this.getClasses();
        }, regex : /<g>[^\|;]*?/},
        {token : () => {
          this.setColor("blue")
          return this.getClasses();
        }, regex : /<b>[^\|;]*?/},
        
        {token : () => {
          if (this.highlightStates.italic) {
            this.highlightedStates.resetItalic = true;
          } else {
            this.highlightStates.italic = true;
          }
          return this.getClasses();
        }, regex : /\*(?!\*)/},
        {token : () => {
          if (this.highlightStates.bold) {
            this.highlightedStates.resetBold = true;
          } else {
            this.highlightStates.bold = true;
          }
          return this.getClasses();
        }, regex : /\*\*(?!\*)/},
        {token : () => {
          if (this.highlightStates.italic) {
            this.highlightedStates.resetItalic = true;
          } else {
            this.highlightStates.italic = true;
          }
          if (this.highlightStates.bold) {
            this.highlightedStates.resetBold = true;
          } else {
            this.highlightStates.bold = true;
          }
          return this.getClasses();
        }, regex : /\*\*\*(?!\*)/},
        {token: () => {
          return this.getClasses();
        }, regex: /[^\|;]/},
        {token : () => {this.resetStates(); return 'text';}, regex : /$/, next: "start"},
        {token : () => {this.resetStates(); return 'text';}, regex : /;|\|/},
        {defaultToken : "text"},
        {caseInsensitive: true}
      ]
    };
  };
  
  exports.SongmachineHighlightRules = SongmachineHighlightRules;
});
  