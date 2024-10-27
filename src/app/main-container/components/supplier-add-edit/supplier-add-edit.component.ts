import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';
import { emptySupplier, Supplier } from '@app/models';
import { SupplierService } from '@app/services';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

interface SupplierForm {
  name: FormControl<string>;
  ruc: FormControl<string>;
  phone: FormControl<string>;
  email: FormControl<string>;
  address: FormControl<string>;
}

@Component({
  selector: 'app-supplier-add-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltip,
    ReactiveFormsModule,
  ],
  templateUrl: './supplier-add-edit.component.html',
  styleUrl: './supplier-add-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierAddEditComponent {
  id = input<number>();

  private readonly supplierService = inject(SupplierService);
  private readonly router = inject(Router);

  readonly label = 'proveedor';
  private readonly element = 'supplier';

  supplierToEdit = signal<Supplier>(emptySupplier);

  supplierForm: Signal<FormGroup> = computed(
    () =>
      new FormGroup<SupplierForm>({
        name: new FormControl(this.supplierToEdit().name, {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9 #%&*(),.":]+$'),
          ],
        }),
        ruc: new FormControl(this.supplierToEdit().ruc, {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern('^[0-9]{11}$')],
        }),
        phone: new FormControl(this.supplierToEdit().phone, {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern('^[0-9]{9}$')],
        }),
        email: new FormControl(this.supplierToEdit().email, {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        address: new FormControl(this.supplierToEdit().address, {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9 ,.-/#]+$'),
          ],
        }),
      })
  );

  ngOnInit() {
    if (this.id()) {
      this.supplierService
        .getSupplier(Number(this.id()))
        .subscribe((supplier) => {
          this.supplierToEdit.set(supplier);
        });
    }
  }

  onSubmit(): void {
    if (this.supplierForm().valid) {
      const supplier = {
        ...(this.id() ? { id: Number(this.id()) } : {}),
        ...this.supplierForm().value,
      };
      const methodToUse = this.id() ? 'updateSupplier' : 'addSupplier';

      this.supplierService[methodToUse](supplier).subscribe({
        next: () => {
          this.supplierForm().reset();
          this.router.navigate([`/${this.element}/index`]);
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        },
      });
    }
  }

  onCancel(): void {
    if (this.supplierForm().dirty) {
      if (
        confirm(
          '¿Está seguro de que desea cancelar? Los cambios no guardados se perderán.'
        )
      ) {
        this.router.navigate([`/${this.element}/index`]);
      }
    } else {
      this.router.navigate([`/${this.element}/index`]);
    }
  }
}
