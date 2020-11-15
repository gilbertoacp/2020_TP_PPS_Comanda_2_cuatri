import { TestBed } from '@angular/core/testing';

import { EncuestaEmpleadoService } from './encuesta-empleado.service';

describe('EncuestaEmpleadoService', () => {
  let service: EncuestaEmpleadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncuestaEmpleadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
