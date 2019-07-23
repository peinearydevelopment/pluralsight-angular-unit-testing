import { TestBed, inject } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { MessageService } from './message.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HeroService', () => {
  let mockMessageService;
  // let httpTestingController: HttpTestingController;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService }
      ]
    });

    // httpTestingController = TestBed.get(HttpTestingController);
  });

  describe('getHero', () => {
    it('should call get with the correct URL',
      inject([HeroService, HttpTestingController], (service: HeroService, controller: HttpTestingController) => {
        service.getHero(4).subscribe();
        // verify below protects agains this scenario where multiple calls are occurring, but only one is expected to be made
        // service.getHero(3).subscribe();

        const request = controller.expectOne('api/heroes/4');
        request.flush({ id: 4, name: 'Super Dude', strength: 100 });
        controller.verify();
      })
    );
  });
});
