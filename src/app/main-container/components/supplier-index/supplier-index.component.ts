import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Supplier } from '@app/models';
import { SupplierService } from '@app/services';

@Component({
  selector: 'app-supplier-index',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './supplier-index.component.html',
  styleUrl: './supplier-index.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupplierIndexComponent implements OnInit {
  private readonly supplierService = inject(SupplierService);
  private readonly snackBar = inject(MatSnackBar);

  readonly element = 'supplier';
  readonly label = 'proveedor';

  columns = [
    {
      property: 'id',
      header: 'ID',
    },
    {
      property: 'ruc',
      header: 'RUC',
    },
    {
      property: 'name',
      header: 'NOMBRE',
    },
    {
      property: 'email',
      header: 'EMAIL',
    },
    {
      property: 'phone',
      header: 'TELÉFONO',
    },
    {
      property: 'address',
      header: 'DIRECCIÓN',
    },
    {
      property: 'actions',
      header: 'ACCIONES',
    },
  ];
  displayedColumns = this.columns.map((c) => c.property);

  dataSource = new MatTableDataSource<Supplier>([]);
  suppliers: Supplier[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  ngOnInit(): void {
    this.supplierService.getAllSuppliers().subscribe((data) => {
      this.suppliers = data;
      this.totalItems = data.length;
      this.updateDataSource();
    });
  }

  delete(id: number) {
    this.supplierService.removeSupplier(id).subscribe({
      next: (response) => {
        this.suppliers = this.suppliers.filter((item) => item.id !== id);
        this.totalItems = this.suppliers.length;
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
    this.dataSource.data = this.suppliers.slice(startIndex, endIndex);
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
