const uuid = require('uuid/v1');

export class GraphNode {
  id: string;
  data: any;
  edges: GraphEdge[];

  constructor(edges?: GraphEdge[], data?: any) {
    this.id = uuid();
    this.data = data;
    this.edges = edges;
  }

  getNextNode(input: string): GraphNode {
    this.edges.forEach(edge => {
      if (edge.regex.test(input)) {
        return edge.nextNode;
      }
    });
    return this;
  }
}

export interface GraphEdge {
  regex: RegExp;
  nextNode: GraphNode;
}
