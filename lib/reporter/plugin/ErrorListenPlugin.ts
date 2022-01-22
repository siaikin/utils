import {Reporter} from "../Reporter";
import {isBrowser, notUAN} from "../../utils/Index";

export class ErrorListenPlugin {
  static reporter = new Reporter('ErrorListenPlugin');

  type: ListenType;
  webErrorListener: (ev: ErrorEvent) => void = ({message, filename, lineno, colno}) => this._reporter.error('%s\n%s, %s:%s', message, filename, lineno, colno);
  weChatErrorListener: (ev: ErrorEvent) => void;
  _reporter: Reporter;
  _unuse: () => void;

  constructor(type: ListenType) {
    this.type = type;

    ErrorListenPlugin.reporter.info('instance created\ttype: %s', type);
  }

  use(): void {
    ErrorListenPlugin.reporter.info('invoke use');
    switch (this.type) {
      case ListenType.WEB:
        this._unuse = this.addWebListener();
        break;
      case ListenType.WE_CHAT:
        this._unuse = this.addWeChatListener();
        break;
      default:
        ErrorListenPlugin.reporter.warning('listen type unknown!');
        break;
    }
  }

  unuse(): void {
    notUAN(this._unuse) && this._unuse();
  }

  addWebListener(): () => void {
    ErrorListenPlugin.reporter.info('invoke addWebListener');
    let result;
    if (isBrowser) {
      this._reporter = new Reporter('Window');
      result = window.addEventListener('error', this.webErrorListener);
    } else {
      ErrorListenPlugin.reporter.warning('script running non browser environment, instance create fail');
    }

    return result;
  }

  addWeChatListener(): () => void {
    return () => ({});
  }
}

export enum ListenType {
  WEB = 'Web',
  WE_CHAT = 'WeChat'
}
