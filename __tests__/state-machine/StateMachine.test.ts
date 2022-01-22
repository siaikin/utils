import {StateMachine, StateMachineConfig} from "../../lib/state-machine/StateMachine";

describe('[class: StateMachine] usage case', function () {
  describe('test [function: translate] usage case', function () {
    let sm;

    beforeEach(() => {
      const config: StateMachineConfig = {
        init: 'init',
        translations: [
          {name: 'login', from: ['init'], to: 'login'},
          {name: 'join', from: ['login', 'conferenceLeave'], to: 'conferenceJoin'},
          {name: 'leave', from: ['conferenceJoin'], to: 'conferenceLeave'},
          {name: 'logout', from: ['login', 'conferenceJoin', 'conferenceLeave'], to: 'logout'},
        ]
      };

      sm = new StateMachine(config);
    })

    it('test normal process', function () {
      expect(sm.translate('login')).toBe(true);
      expect(sm.translate('join')).toBe(true);
      expect(sm.translate('leave')).toBe(true);
      expect(sm.translate('logout')).toBe(true);
    });

    it('test abnormal process', function () {
      expect(sm.translate('join')).toBe(false);
      expect(sm.translate('login')).toBe(true);
      expect(sm.translate('leave')).toBe(false);
      expect(sm.translate('logout')).toBe(true);
    });

    it('test abnormal process', function () {
      expect(sm.translate('join')).toBe(false);
      expect(sm.translate('login')).toBe(true);
      expect(sm.translate('leave')).toBe(false);
      expect(sm.translate('logout')).toBe(true);
    });
  });
});
