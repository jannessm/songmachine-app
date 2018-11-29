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
    return this.reduceTree(this.root, tag, keepChars);
  }

  private reduceTree(currentNode: TreeNode, tag: string, keepChars: boolean): string {
    let html = '';

    currentNode.children.sort((a, b) => a.children.length - b.children.length);
    currentNode.children.forEach(node => {
      if (keepChars && !node.data.isState) {
        const cssParent = !!node.getParent() ? node.getParent().data.content : '';
        const cssSibling = !!node.getSibling() ? node.getSibling().data.content : '';
        const longerState = cssParent.length > cssSibling.length ? cssParent : cssSibling;
        const css = this.cssClasses[longerState];
        const content = GrammarParser.escapeHTML(node.data.content);
        html += `<${tag} class="${css}">${content}</${tag}>`;

      } else if (!node.data.isState && !this.testRegexs(node.data.content)) {
        const css = this.cssClasses[node.getSibling().data.content];
        const content = GrammarParser.escapeHTML(node.data.content);
        html += `<${tag} class="${css}">${content}</${tag}>`;

      } else {
        html += this.reduceTree(node, tag, keepChars);
      }
    });
    return html;
  }

  private buildTree(input: string): void {
    this.root = new TreeNode({content: this.grammarStart, isState: true});
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
          currNode.createChild({content: lookahead.substring(0, ignoreNext + 1), isState: false});
          currNode = currNode.createChild({content: currState, isState: true});
          matched = true;
          break;
        }
      }

      if (!matched) {
        if (!currNode.isRoot) {
          if (!this.testRegexs(currNode.getSibling().data.content)) {
            currNode.getSibling().data.content += arr[i];
          } else {
            currNode.createChild({content: arr[i], isState: false});
            currNode = currNode.createChild({content: currState, isState: true});
          }
        } else {
          currNode.createChild({content: arr[i], isState: false});
          currNode = currNode.createChild({content: currState, isState: true});
        }
      }
    });
  }

  private testRegexs(input: string) {
    return this.regexs.reduce((reduced: boolean, val: GrammarRegex) => reduced || val.regex.test(input), false);
  }
}
