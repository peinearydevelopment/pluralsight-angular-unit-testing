import { HeroesComponent } from './heroes.component';
import { of } from 'rxjs';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'Spider Dude', strength: 8 },
      { id: 2, name: 'Wonderful Woman', strength: 24 },
      { id: 3, name: 'Super Dude', strength: 55 }
    ];

    // creates mock hero service with methods provided in string array
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    component = new HeroesComponent(mockHeroService);
  });

  // state test
  describe('delete', () => {
    it('should remove the indicated hero from the heroes list', () => {
      // delete method calls subscribe on the the hero service deteleHero method, so need to mock that and its result out
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.find(hero => hero.id === HEROES[2].id)).toBeUndefined();
      expect(component.heroes.find(hero => hero.id === HEROES[0].id)).not.toBeUndefined();
      expect(component.heroes.find(hero => hero.id === HEROES[1].id)).not.toBeUndefined();
    });

    // interaction test, asserts that external call is made with expected parameters passed
    it('should call deleteHero with correct hero', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    });

    it('should call subscribe on result of deleteHero', () => {
    const mockDeleteHeroMethod = jasmine.createSpyObj(['subscribe']);
    mockHeroService.deleteHero.and.returnValue(mockDeleteHeroMethod);
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(mockDeleteHeroMethod.subscribe).toHaveBeenCalledWith();
    });
  });
});
