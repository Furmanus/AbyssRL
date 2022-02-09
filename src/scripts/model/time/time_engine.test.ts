import { IActor } from '../../interfaces/entity/entity_interfaces';
import { TimeEngine } from './time_engine';

class FakeActor implements IActor {
  public constructor(
    private speed: number,
    private readonly actCallback?: () => void,
  ) {}

  act() {
    this.actCallback?.();
  }

  getSpeed() {
    return this.speed;
  }
}

describe('Time engine', () => {
  it('should call all actors in order', () => {
    const actorsAction: string[] = [];
    const engine = new TimeEngine();
    const actorFirst = new FakeActor(70, () => {
      actorsAction.push('first');
      engine.lockEngine();
    });
    const actorSecond = new FakeActor(100, () => {
      actorsAction.push('second');
    });
    const actorThird = new FakeActor(150, () => {
      actorsAction.push('third');
    });

    engine.addActor(actorFirst, true);
    engine.addActor(actorSecond, true);
    engine.addActor(actorThird, true);

    engine.startEngine();

    expect(actorsAction).toStrictEqual(['third', 'second', 'third', 'third']);
  });
  it('should remove non repeatable actors', () => {
    const actorsAction: string[] = [];
    const engine = new TimeEngine();
    const actorFirst = new FakeActor(100, () => {
      actorsAction.push('first');
      engine.lockEngine();
    });
    const actorSecond = new FakeActor(150, () => {
      actorsAction.push('second');
    });
    const actorThird = new FakeActor(120, () => {
      actorsAction.push('third');
    });

    engine.addActor(actorFirst, true);
    engine.addActor(actorSecond, false);
    engine.addActor(actorThird, true);

    engine.startEngine();

    expect(actorsAction).toStrictEqual(['second', 'third', 'first']);
  });
  it('fast actor should act multiple times before slow actor', () => {
    const actorsAction: string[] = [];
    const engine = new TimeEngine();
    const actorFirst = new FakeActor(20, () => {
      actorsAction.push('first');
      engine.lockEngine();
    });
    const actorThird = new FakeActor(99, () => {
      actorsAction.push('third');
    });

    engine.addActor(actorFirst, true);
    engine.addActor(actorThird, true);

    engine.startEngine();

    expect(actorsAction).toStrictEqual([
      'third',
      'third',
      'third',
      'third',
      'first',
    ]);
  });
  it('lock and unlock engine should work correctly', () => {
    const actorsAction: string[] = [];
    const engine = new TimeEngine();
    const actorFirst = new FakeActor(20, () => {
      actorsAction.push('first');
      engine.lockEngine();
    });

    engine.addActor(actorFirst, true);
    engine.startEngine();
    engine.unlockEngine();
    engine.unlockEngine();

    expect(actorsAction).toStrictEqual(['first', 'first', 'first']);
  });
});
