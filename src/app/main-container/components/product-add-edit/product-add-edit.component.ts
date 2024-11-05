import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';
import { Category, emptyProduct, Product, Supplier } from '@app/models';
import {
  CategoryService,
  ProductService,
  SupplierService,
} from '@app/services';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

interface ProductForm {
  code: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<number>;
  stock: FormControl<number>;
  category: FormControl<number>;
  supplier: FormControl<number>;
}

@Component({
  selector: 'app-product-add-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltip,
    ReactiveFormsModule,
  ],
  templateUrl: './product-add-edit.component.html',
  styleUrl: './product-add-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddEditComponent {
  id = input<number>();

  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);

  private readonly router = inject(Router);

  readonly label = 'producto';
  private readonly element = 'product';

  suppliers: Supplier[] = [];
  categories: Category[] = [];

  productToEdit = signal<Product>(emptyProduct);

  productForm: Signal<FormGroup> = computed(
    () =>
      new FormGroup<ProductForm>({
        code: new FormControl(this.productToEdit().code, {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9]+$'),
            Validators.minLength(5),
            Validators.maxLength(5),
          ],
        }),
        name: new FormControl(this.productToEdit().name, {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern('^[a-zA-Z]+$')],
        }),
        description: new FormControl(this.productToEdit().description, {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(255)],
        }),
        price: new FormControl(this.productToEdit().price, {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$'),
          ],
        }),
        stock: new FormControl(this.productToEdit().stock, {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern('^[0-9]+$')],
        }),
        supplier: new FormControl(this.productToEdit().supplier.id, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        category: new FormControl(this.productToEdit().category.id, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      })
  );

  ngOnInit() {
    if (this.id()) {
      this.productService.getProduct(Number(this.id())).subscribe((product) => {
        this.productToEdit.set(product);
      });
    }

    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });

    this.supplierService.getAllSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
  }

  onSubmit(): void {
    if (this.productForm().valid) {
      const user = {
        ...(this.id() ? { id: Number(this.id()) } : {}),
        ...this.productForm().value,
        supplier: { id: this.productForm().value.supplier },
        category: { id: this.productForm().value.category },
      };
      const methodToUse = this.id() ? 'updateProduct' : 'addProduct';

      this.productService[methodToUse](user).subscribe({
        next: () => {
          this.productForm().reset();
          this.router.navigate([`/${this.element}/index`]);
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        },
      });
    }
  }

  onCancel(): void {
    if (this.productForm().dirty) {
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
