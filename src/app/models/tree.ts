const uuid = require('uuid/v1');

export class TreeNode {
  id: string;
  parent: TreeNode;
  data: any;
  hasChildren = false;
  isRoot = true;
  children: TreeNode[] = [];

  constructor(data?: any) {
    this.id = uuid();
    this.data = data;
  }

  createChild(data?: any): TreeNode {
    const child = new TreeNode(data);
    child.parent = this;
    child.isRoot = false;
    this.hasChildren = true;
    this.children.push(child);
    return child;
  }

  getChild(id: string): TreeNode {
    return this.children.find(child => child.id === id);
  }

  removeChild(id): TreeNode {
    const arrId = this.children.findIndex(child => child.id === id);
    this.children.splice(arrId, 1);
    return this;
  }

  getParent(): TreeNode {
    return this.parent;
  }

  getSibling(): TreeNode {
    const thisId = this.parent.children.findIndex(node => node.id === this.id);
    const nextId = (thisId + 1) % this.parent.children.length;
    return nextId === thisId ? undefined : this.parent.children[nextId];
  }

  toJSON(): any {
    const json = { data:  this.dataAsJSON()};
    this.children.forEach(child => {
      json[child.id] = child.toJSON();
    });
    return Object.values(json).length > 0 ? json : undefined;
  }

  private dataAsJSON(): any {
    const json = {};
    Object.keys(this.data).forEach(key => json[key] = this.data[key]);
    return json;
  }
}
