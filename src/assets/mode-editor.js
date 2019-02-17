define("ace/mode/st_hightlight_rules", ["require","exports","module","ace/lib/oop","ace/lib/lang"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var lang = require("../lib/lang");
  
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

  exports.StHighlightRules = SongmachineHighlightRules;
});

define("ace/mode/st", ["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/st_highlight_rules", "ace/worker/worker_client"], function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;
  var SongmachineHighlightRules = require("./st_highlight_rules").SongmachineHighlightRules;
  var WorkerClient = require("../worker/worker_client").WorkerClient;
  
  var Mode = function() {
      this.HighlightRules = SongmachineHighlightRules;
  };
  oop.inherits(Mode, TextMode);
  
  (function() {
  
      this.createWorker = function(session) {
          var worker = new WorkerClient(["ace"], "ace/mode/st_worker", "Worker");
          worker.attachToDocument(session.getDocument());
  
          worker.on("annotate", function(e) {
              session.setAnnotations(e.data);
          });
  
          worker.on("terminate", function() {
              session.clearAnnotations();
          });
  
          return worker;
      };
  
      this.$id = "ace/mode/st";
  }).call(Mode.prototype);
  
  exports.Mode = Mode;
});

(function() {
  window.require(["ace/mode/st"], function(m) {
      if (typeof module == "object" && typeof exports == "object" && module) {
        module.exports = m;
      }
  });
})();
