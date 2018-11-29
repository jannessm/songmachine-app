import { TreeNode } from '../tree';
import { GrammarRegex, GrammarTransitions, GrammarCssClasses, Grammar } from './generalModels';

export class GrammarParser {

  private regexs: GrammarRegex[];
  private transitions: GrammarTransitions;
  private grammarStart: string;
  private cssClasses: GrammarCssClasses;

  private root: TreeNode;

  public static escapeHTML(char: string): string {
    if (char.length === 1) {
      const entityMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '\'': '&#39;',
          '/': '&#x2F;',
          '`': '&#x60;',
          '=': '&#x3D;',
          '|': '&#124;',
          '♮': '&#9838;'
      };
      return entityMap[char] ? entityMap[char] : char;
    } else {
      return char.split('').map(c => this.escapeHTML(c)).join('');
    }
  }

  constructor(grammar: Grammar) {
    this.regexs = grammar.regexs;
    this.transitions = grammar.transitions;
    this.grammarStart = grammar.start;
    this.cssClasses = grammar.cssClasses;
  }

  public parse(input: string, keepChars: boolean = false, tag: string = 'pre') {
    this.buildTree(input);
    console.log(this.root);
    return this.reduceTree(this.root, tag, keepChars);
  }

  private reduceTree(currentNode: TreeNode, tag: string, keepChars: boolean): string {
    let html = `<${tag}>`;

    currentNode.children.sort((a, b) => a.children.length - b.children.length);
    currentNode.children.forEach(node => {
      // if editorParsing and markdown data
      if (keepChars && !node.hasChildren && this.testRegexs(node.data)) {
        if (node.getSibling() && (node.getSibling().data.length < this.root.data.length || node.getSibling().data === 'S')) {
          html += GrammarParser.escapeHTML(node.data);
          html += `</${tag}><${tag} class="${this.cssClasses[node.getSibling().data]}">`;
        } else if (node.getSibling()) {
          html += `</${tag}><${tag} class="${this.cssClasses[node.getSibling().data]}">`;
          html += GrammarParser.escapeHTML(node.data);
        } else {
          html += GrammarParser.escapeHTML(node.data);
        }
      // if not editorParsing and not markdown data
      } else if (!node.hasChildren && !this.testRegexs(node.data)) {
        html += GrammarParser.escapeHTML(node.data);
      } else if (!node.hasChildren && node.getSibling()) {
        html += `</pre><pre class="${this.cssClasses[node.getSibling().data]}">`;
      // if node has children, look at it.
      } else {
        html += this.reduceTree(node, tag, keepChars);
      }
    });
    return html + `</${tag}>`;
  }

  private buildTree(input: string): void {
    this.root = new TreeNode(this.grammarStart);
    let ignoreNext = 0;
    let currTransitions: string[] = this.transitions[this.grammarStart];
    let currState = this.grammarStart;
    let currNode: TreeNode = this.root;

    input.split('').forEach((char, i, arr) => {
      if (ignoreNext > 0) {
        ignoreNext--;
        return;
      }

      let lookahead = char;
      let matched = false;
      lookahead += arr[i + 1] ? arr[i + 1] : '';
      lookahead += arr[i + 2] ? arr[i + 2] : '';

      for (const regex of this.regexs) {
        if (regex && regex.regex.test(lookahead)) {
          ignoreNext = regex.ignoreNext;
          currState = currTransitions[regex.id];
          currTransitions = this.transitions[currState];
          currNode.createChild(lookahead.substring(0, ignoreNext + 1));
          if (i + ignoreNext + 1 < arr.length) {
            currNode = currNode.createChild(currState);
          }
          matched = true;
          break;
        }
      }

      if (!matched) {
        currNode.createChild(arr[i]);
        if (i + 1 < arr.length) {
          currNode = currNode.createChild(currState);
        }
      }
    });
  }

  private testRegexs(input: string) {
    return this.regexs.reduce((reduced: boolean, val: GrammarRegex) => reduced || val.regex.test(input), false);
  }
}
