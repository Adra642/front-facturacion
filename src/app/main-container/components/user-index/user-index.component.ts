import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { User } from '@app/models';
import { UserService } from '@app/services';

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserIndexComponent {
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  readonly element = 'user';
  readonly label = 'usuario';

  columns = [
    {
      property: 'id',
      header: 'ID',
    },
    {
      property: 'name',
      header: 'NOMBRE',
    },
    {
      property: 'surname',
      header: 'APELLIDO',
    },
    {
      property: 'email',
      header: 'EMAIL',
    },
    {
      property: 'password',
      header: 'CONTRASEÑA',
    },
    {
      property: 'state',
      header: 'ESTADO',
    },
    {
      property: 'role',
      header: 'ROL',
    },
    {
      property: 'actions',
      header: 'ACCIONES',
    },
  ];
  displayedColumns = this.columns.map((c) => c.property);

  dataSource = new MatTableDataSource<User>([]);
  users: User[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
      this.totalItems = data.length;
      this.updateDataSource();
    });
  }

  delete(id: number) {
    this.userService.removeUser(id).subscribe({
      next: (response) => {
        this.users = this.users.filter((item) => item.id !== id);
        this.totalItems = this.users.length;
        this.updateDataSource();
      },
      error: (error) => {
        console.error(`Error deleting ${this.element}:`, error);
        this.snackBar.open(
          `No se puede eliminar el ${this.label}  debido a que esta relacionado a otra entidad`,
          'Cerrar',
          { duration: 5000 }
        );
      },
      complete: () => {
        this.snackBar.open(
          `El ${this.label} fue eliminado correctamente`,
          'Cerrar',
          { duration: 5000 }
        );
      },
    });
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this.users.slice(startIndex, endIndex);
  }

  pageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
