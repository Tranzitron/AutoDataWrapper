import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BrandItem} from './brand-item';

describe('BrandItem', () => {
  let component: BrandItem;
  let fixture: ComponentFixture<BrandItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandItem]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BrandItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
