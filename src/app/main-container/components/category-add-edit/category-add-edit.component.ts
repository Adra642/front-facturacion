import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';
import { Category, emptyCategory } from '@app/models';
import { CategoryService } from '@app/services';
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

interface CategoryForm {
  name: FormControl<string>;
}

@Component({
  selector: 'app-category-add-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltip,
    ReactiveFormsModule,
  ],
  templateUrl: './category-add-edit.component.html',
  styleUrl: './category-add-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryAddEditComponent {
  id = input<number>();

  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  readonly label = 'categoría';
  private readonly element = 'category';

  categoryToEdit = signal<Category>(emptyCategory);

  categoryForm: Signal<FormGroup> = computed(
    () =>
      new FormGroup<CategoryForm>({
        name: new FormControl(this.categoryToEdit().name, {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
        }),
      })
  );

  ngOnInit() {
    if (this.id()) {
      this.categoryService
        .getCategory(Number(this.id()))
        .subscribe((category) => {
          this.categoryToEdit.set(category);
        });
    }
  }

  onSubmit(): void {
    if (this.categoryForm().valid) {
      const category = {
        ...(this.id() ? { id: Number(this.id()) } : {}),
        ...this.categoryForm().value,
      };
      const methodToUse = this.id() ? 'updateCategory' : 'addCategory';

      this.categoryService[methodToUse](category).subscribe({
        next: () => {
          this.categoryForm().reset();
          this.router.navigate([`/${this.element}/index`]);
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        },
      });
    }
  }

  onCancel(): void {
    if (this.categoryForm().dirty) {
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
