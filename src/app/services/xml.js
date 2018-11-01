'use strict';

const maxLineLength = Infinity;
const tabsStr = '  ';

module.exports.parse = xmlParser;
module.exports.generate = xmlGenerator;

/**
 * Parses XML into a JS object
 * @param {string} xml the XML to be parsed
 * @return {object} the result
 */
function xmlParser(xml) {
  xml = xml
    .replace(/<\?.*\?>/g, '')
    .replace(/<!--([\s\S]*)-->/g, '')
    .replace(/[\n\r]/g, '')
    .replace(/  /g, ' ')
    .replace(/  /g, ' ')
    .replace(/  /g, ' ');

  let onelinerTags = ['input', 'br'];

  let nodes = {
    children: []
  };

  let tagOpen = false;
  let currentTag = '';
  let currentNode = null;
  let isCLosing = false;
  let text = '';
  let escaped = false;
  let oneliner = false;

  xml.split('').forEach(char => {
    if (!tagOpen && char === '<') {
      tagOpen = true;
    } else if (!escaped && tagOpen && char === '/' && !currentTag) {
      isCLosing = true;
    } else if (!escaped && tagOpen && char === '/' && currentTag) {
      oneliner = true;
    } else if (tagOpen && char === '"') {
      currentTag += char;
      escaped = !escaped;
    } else if (tagOpen && char === '>' && !escaped) {
      let top = currentNode || nodes;
      let tagLine = currentTag;
      let matches = tagLine.match(/([\S\n]*)/g);

      currentTag = matches.shift();

      let attribtues = matches.filter(item => !!item.trim()).join(' ');

      if (currentNode && text.trim()) {
        currentNode.children.push(text.trim());
        text = '';
      }

      if (onelinerTags.indexOf(currentTag) !== -1) {
        oneliner = true;
      }

      if (isCLosing) {
        currentNode = currentNode ? currentNode.parent : nodes;
      } else {
        let node = {
          tag: currentTag,
          parent: currentNode,
          oneliner: oneliner,
          attributes: parseAttribtues(attribtues),
          children: []
        };
        top.children.push(node);

        if (!oneliner) {
          currentNode = node;
        }
      }

      tagOpen = false;
      isCLosing = false;
      oneliner = false;
      currentTag = '';
    } else if (tagOpen) {
      currentTag += char;
    } else {
      text += char;
    }
  });

  return nodes;
}

/**
 * Parses Attributes of a XML Node
 * @param {*} str string of attributes
 * @return {object} attribtues as object
 */
function parseAttribtues(str) {
  let naming;
  let name;
  let started;
  let attrValue;
  let map = {};

  reset();
  str.split('').forEach(char => {
    if (naming && (char === ' ' || char === '\n' || char === '\r' || char === '\t')) {
      add(name);
      reset();
    } else if (naming && char === '=') {
      naming = false;
    } else if (naming) {
      name += char;
    } else if (!started && char === '"') {
      started = true;
    } else if (started && char === '"') {
      add(name, attrValue);
      reset();
    } else {
      attrValue += char;
    }
  });
  add(name);

  return map;

  /**
   * adds to the map
   * @private
   * @param {*} name
   * @param {*} value
   */
  function add(name, value) {
    if (name) {
      map[name] = value;
    }
  }

  /**
   * resets the attribute parser
   * @private
   */
  function reset() {
    naming = true;
    name = '';
    started = false;
    attrValue = '';
  }
}

/**
 * Generates valid XML from Nodes
 * @param {*} nodes the nodes to generate XML from
 * @return {string} the valid XML
 */
function xmlGenerator(nodes) {
  let lines = [];
  nodes.children.forEach(child => genLines(child));

  /**
   *
   * @param {*} node
   * @param {*} tabs
   * @private
   */
  function genLines(node, tabs) {
    tabs = tabs || '';

    if (typeof node === 'string') {
      addFormattedLine(tabs, node, true);
    } else {
      let attrStr = '';

      if (node.attributes) {
        attrStr = Object.getOwnPropertyNames(node.attributes)
          .sort()
          .map(key => {
            let out = key;
            if (typeof node.attributes[key] !== 'undefined') {
              out += `="${node.attributes[key]}"`;
            }
            return out;
          })
          .join(' ');
      }

      if (attrStr) {
        attrStr = ' ' + attrStr;
      }

      if (node.oneliner) {
        addFormattedLine(tabs, `<${node.tag}${attrStr}/>`);
      } else if (!node.children.length) {
        addFormattedLine(tabs, `<${node.tag}${attrStr}></${node.tag}>`);
      } else {
        addFormattedLine(tabs, `<${node.tag}${attrStr}>`);
        node.children.forEach(child => genLines(child, tabs + tabsStr));
        addFormattedLine(tabs, `</${node.tag}>`);
      }
    }
  }

  /**
   *
   * @param {*} tabs
   * @param {*} line
   * @param {*} ignoreBreak
   * @private
   */
  function addFormattedLine(tabs, line, ignoreBreak) {
    let split = breakDownLine(line);
    let outLines = [];
    let currentLine = tabs;

    split.forEach(partial => {
      if (partial.length + currentLine.length + 1 > maxLineLength && currentLine.trim()) {
        outLines.push(currentLine);
        currentLine = tabs;

        if (!ignoreBreak) {
          currentLine += tabsStr;
        }
      }

      if (currentLine.trim()) {
        currentLine += ' ';
      }

      currentLine += partial;
    });

    if (currentLine.trim()) {
      outLines.push(currentLine);
    }

    lines.push(outLines.join('\n'));
  }

  /**
   * Breakes down a line
   * @param {*} line
   * @return {*}
   * @private
   */
  function breakDownLine(line) {
    let out = [];
    let escaped = false;
    let current = '';

    line.split('').forEach(char => {
      if (char === '"') {
        escaped = !escaped;
        current += char;
      } else if (!escaped && char === ' ') {
        out.push(current);
        current = '';
      } else {
        current += char;
      }
    });

    out.push(current);

    return out;
  }
  return lines.join('\n');
}
