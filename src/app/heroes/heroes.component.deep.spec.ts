import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'Spider Dude', strength: 8 },
      { id: 2, name: 'Wonderful Woman', strength: 24 },
      { id: 3, name: 'Super Dude', strength: 55 }
    ];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      // schemas: [NO_ERRORS_SCHEMA] // this is to work with the issue of the missing app routing module
    });

    fixture = TestBed.createComponent(HeroesComponent);
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
  });

  it('should render each hero as a hero component', () => {
    fixture.detectChanges();

    const heroComponentsDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentsDebugElements.length).toBe(3);
    expect(heroComponentsDebugElements[0].componentInstance.hero.name).toEqual(HEROES[0].name);
    expect(heroComponentsDebugElements[1].componentInstance.hero.name).toEqual(HEROES[1].name);
    expect(heroComponentsDebugElements[2].componentInstance.hero.name).toEqual(HEROES[2].name);

    heroComponentsDebugElements.forEach(
      (heroComponentDebugElement, i) => expect(heroComponentDebugElement.componentInstance.hero).toBe(HEROES[i])
    );
  });

  it('should call heroService.deleteHero when the Hero Component\'s delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'delete');
    fixture.detectChanges();

    const heroComponentsDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
    heroComponentsDebugElements[0].query(By.css('button'))
                                  .triggerEventHandler('click', { stopPropagation: () => {} });

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should call heroService.deleteHero when the Hero Component\'s delete button is clicked v2', () => {
    spyOn(fixture.componentInstance, 'delete');
    fixture.detectChanges();

    const heroComponentsDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
    (heroComponentsDebugElements[0].componentInstance as HeroComponent).delete.emit(undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should call heroService.deleteHero when the Hero Component\'s delete button is clicked v3', () => {
    spyOn(fixture.componentInstance, 'delete');
    fixture.detectChanges();

    const heroComponentsDebugElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
    heroComponentsDebugElements[0].triggerEventHandler('delete', undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the hero list when the add button is clicked', () => {
    fixture.detectChanges();
    const name = 'Mr. Ice';
    mockHeroService.addHero.and.returnValue(of({ id: 5, name: name, strength: 4 }));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', undefined);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('ul')).nativeElement.textContent).toContain(name);
  });

  it('should have the correct route for the first hero', () => {
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    const routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveStub))
                                      .injector
                                      .get(RouterLinkDirectiveStub);
    heroComponents[0].query(By.css('a')).triggerEventHandler('click', undefined);

    expect(routerLink.navigatedTo).toBe(`/detail/${HEROES[0].id}`);
  });
});
