import {StateMachine, StateMachineConfig} from '../../lib';

describe('[class: StateMachine] usage case', function () {
  describe('test [function: translate] usage case', function () {
    const config: StateMachineConfig = {
      init: 'init',
      translations: [
        {name: 'login', from: ['init'], to: 'login'},
        {name: 'join', from: ['login', 'conferenceLeave'], to: 'conferenceJoin'},
        {name: 'leave', from: ['conferenceJoin'], to: 'conferenceLeave'},
        {name: 'logout', from: ['login', 'conferenceJoin', 'conferenceLeave'], to: 'logout'},
      ]
    };

    it('test normal process', function () {
      expect.hasAssertions();

      const sm = new StateMachine(config);

      expect(sm.translate('login')).toBe(true);
      expect(sm.translate('join')).toBe(true);
      expect(sm.translate('leave')).toBe(true);
      expect(sm.translate('logout')).toBe(true);
    });

    it('test abnormal process, join before login', function () {
      expect.hasAssertions();

      const sm = new StateMachine(config);

      expect(sm.translate('join')).toBe(false);
      expect(sm.translate('login')).toBe(true);
      expect(sm.translate('leave')).toBe(false);
      expect(sm.translate('logout')).toBe(true);
    });
  });
});
