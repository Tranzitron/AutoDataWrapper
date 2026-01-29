import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AllBrandsItemComponent} from './all-brands-item.component';

describe('BrandItem', () => {
  let component: AllBrandsItemComponent;
  let fixture: ComponentFixture<AllBrandsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllBrandsItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AllBrandsItemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
