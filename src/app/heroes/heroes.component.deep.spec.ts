import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

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
        HeroComponent
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // this is to work with the issue of the missing app routing module
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
});
