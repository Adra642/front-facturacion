import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';
import { emptyUser, Role, User } from '@app/models';
import { UserService } from '@app/services';
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

interface UserForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  state: FormControl<boolean>;
  role: FormControl<Role>;
}

@Component({
  selector: 'app-user-add-edit',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltip,
    ReactiveFormsModule,
  ],
  templateUrl: './user-add-edit.component.html',
  styleUrl: './user-add-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAddEditComponent {
  id = input<number>();

  roles = Object.keys(Role)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({ text: key, value: Role[key as keyof typeof Role] }));

  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly label = 'usuario';
  private readonly element = 'user';

  userToEdit = signal<User>(emptyUser);

  userForm: Signal<FormGroup> = computed(
    () =>
      new FormGroup<UserForm>({
        name: new FormControl(this.userToEdit().name, {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
        }),
        surname: new FormControl(this.userToEdit().surname, {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern('^[a-zA-Z ]+$')],
        }),
        email: new FormControl(this.userToEdit().email, {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        password: new FormControl(this.userToEdit().password, {
          nonNullable: true,
          validators: [
            Validators.min(5),
            Validators.pattern(
              '^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};\'":\\\\|,.<>\\/?]*$'
            ),
          ],
        }),
        state: new FormControl(this.userToEdit().state, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        role: new FormControl(this.userToEdit().role.id, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      })
  );

  ngOnInit() {
    if (this.id()) {
      this.userService.getUser(Number(this.id())).subscribe((user) => {
        this.userToEdit.set(user);
      });
    }
  }

  onSubmit(): void {
    if (this.userForm().valid) {
      const user = {
        ...(this.id() ? { id: Number(this.id()) } : {}),
        ...this.userForm().value,
        role: { id: this.userForm().value.role },
      };
      const methodToUse = this.id() ? 'updateUser' : 'addUser';

      this.userService[methodToUse](user).subscribe({
        next: () => {
          this.userForm().reset();
          this.router.navigate([`/${this.element}/index`]);
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        },
      });
    }
  }

  onCancel(): void {
    if (this.userForm().dirty) {
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

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
