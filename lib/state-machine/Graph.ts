import {typeIsString} from '../utils';

export class Graph {
  vertexSet: Set<string>;
  edgeMap: Record<string, Array<string>>;

  constructor(vertexes: Array<string>, edges: Array<Edge>) {
    this.vertexSet = new Set<string>(vertexes);
    this.edgeMap = {};

    for (let i = edges.length; i--;) {
      const edge = edges[i];

      if (typeIsString(edge.from)) edge.from = [edge.from];

      for (let j = edge.from.length; j--;) {
        const from = edge.from[j];
        if (!this.edgeMap[from]) this.edgeMap[from] = [];

        this.edgeMap[from].push(edge.to);
      }
    }
  }

  hasVertex(name: string): boolean {
    return this.vertexSet.has(name);
  }
}

export interface Vertex {
  id: string;
}
export interface Edge {
  from: string | Array<string>;
  to: string;
}
