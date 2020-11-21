import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaDeEsperaMetreClienteComponent } from './lista-de-espera-metre-cliente.component';

describe('ListaDeEsperaMetreClienteComponent', () => {
  let component: ListaDeEsperaMetreClienteComponent;
  let fixture: ComponentFixture<ListaDeEsperaMetreClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaDeEsperaMetreClienteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaDeEsperaMetreClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
