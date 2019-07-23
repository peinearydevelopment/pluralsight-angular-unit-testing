import { TestBed, ComponentFixture, fakeAsync, tick, flush, async } from '@angular/core/testing';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroService } from '../hero.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('HeroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>,
      mockActivatedRoute,
      mockHeroService,
      mockLocation;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => '3'
        }
      }
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    fixture = TestBed.createComponent(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'Super Dude', strength: 100 }));
  });

  it('should render the hero name in an h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPER DUDE');
  });

  // this works to test async code, but the more of these there are the more time it will take the tests to run
  it('should call updateHero when save is called', ((done) => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();

    setTimeout(
      () => {
        expect(mockHeroService.updateHero).toHaveBeenCalled();
        done();
      },
      300
    );
  }));

  // this makes the async test sync and uses zone.js to allow us to fastforward time to simulate a wait
  it('should call updateHero when save is called v2', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    tick(250);

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  it('should call updateHero when save is called v3', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    flush(); // figure out what tasks are waiting to run and run them immediately

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  // async only works with promises, fakeasync works with either
  it('should call updateHero when save is called with promise', async(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.savePromise();

    fixture.whenStable().then(() => expect(mockHeroService.updateHero).toHaveBeenCalled());
  }));
});
