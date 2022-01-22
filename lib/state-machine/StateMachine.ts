import {Edge, Graph} from "./Graph";
import {notUAN, typeIsFunction, typeIsString} from "../utils";

export class StateMachine {
  private _graph: Graph;
  private _currentState: string;
  get currentState(): string {
    return this._currentState;
  }
  set currentState(state: string) {
    if (this._currentState === state) return;

    this._previousState = this._currentState;
    this._currentState = state;

    if (!typeIsFunction(this[`onstatechange`])) return;

    this.onstatechange(this._currentState, this._previousState);
  }
  private _previousState: string;
  get previousState(): string {
    return this._previousState;
  }

  private _translationMap: Map<string, StateMachineTranslation>;

  constructor(config: StateMachineConfig) {
    this.currentState = config.init;

    const set = new Set<string>();
    for (let i = config.translations.length; i--;) {
      const translation = config.translations[i];
      translation.from.forEach((from) => set.add(from));
      if (typeIsString(translation.to)) set.add(translation.to);
    }

    const edges: Array<Edge> = [];
    config.translations.forEach((item) => typeIsString(item.to) && edges.push({from: item.from, to: item.to}));

    this._graph = new Graph([...set.values()], edges);
    this._translationMap = new Map<string, StateMachineTranslation>(config.translations.map((t) => ([t.name, t])));
  }

  translate(translationName: string): boolean {
    if (!this.isAllow(translationName)) return false;

    const translation = this._translationMap.get(translationName);
    if (
        translation
        /**
         * 如果{@link StateMachineTranslation.to}未指定, 状态转换时不会改变{@link currentState}
         */
        && typeIsString(translation.to)
    ) {
      this.currentState = translation.to;
    }
    return true;
  }

  isAllow(translationName: string): boolean {
    const translation = this._translationMap.get(translationName);

    if (!translation) return false;
    return translation.from.includes(this.currentState);


  }

  has(translationName: string): boolean {
    return this._translationMap.has(translationName);
  }

  /**
   * @event
   * @param state
   * @param oldState
   */
  onstatechange(state: string, oldState: string): void {
  //  todo
  }
}

export interface StateMachineConfig {
  init: string;
  translations: Array<StateMachineTranslation>;
}
export interface StateMachineTranslation {
  name: string;
  from: Array<string>;
  to?: string;
}
