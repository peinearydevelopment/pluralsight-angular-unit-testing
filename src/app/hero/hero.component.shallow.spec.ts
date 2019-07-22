import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('HeroComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    // importing a routing module isn't straight forward
    // routerLink in our template shouldn't be live, we don't want it to actually try to route anywhere throughout our tests

    // need to be careful with this though as it can hide other issues, for instance, if we mistype element names/attributes
    TestBed.configureTestingModule({
      declarations: [ HeroComponent ],
      schemas: [NO_ERRORS_SCHEMA] // tells angular that for this module, don't fail if you encounter an unknown element or attribute
    });

    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = { id: 1, name: 'Spider Dude', strength: 3 };

    expect(fixture.componentInstance.hero.name).toEqual('Spider Dude');
  });

  it('should render the hero name in an anchor tag', () => {
    fixture.componentInstance.hero = { id: 1, name: 'Spider Dude', strength: 3 };
    fixture.detectChanges();

    // these two examples do the exact same thing, but in two different ways
    // nativeElement is a regular DOM element
    expect(fixture.nativeElement.querySelector('a').textContent).toContain('Spider Dude');

    // debugElement is more like a wrapper around the nativeElement, more similar to jQuery
    expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('Spider Dude');
  });
});
