import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Product } from '@app/models';
import { ProductService } from '@app/services';

@Component({
  selector: 'app-product-index',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductIndexComponent {
  private readonly productService = inject(ProductService);
  private readonly snackBar = inject(MatSnackBar);

  readonly element = 'product';
  readonly label = 'producto';

  columns = [
    {
      property: 'id',
      header: 'ID',
    },
    {
      property: 'code',
      header: 'CÓDIGO',
    },
    {
      property: 'name',
      header: 'NOMBRE',
    },
    // {
    //   property: 'description',
    //   header: 'DESCRIPCIÓN',
    // },
    {
      property: 'price',
      header: 'PRECIO',
    },
    {
      property: 'stock',
      header: 'STOCK',
    },
    {
      property: 'category',
      header: 'CATEGORÍA',
    },
    {
      property: 'supplier',
      header: 'PROVEEDOR',
    },
    {
      property: 'actions',
      header: 'ACCIONES',
    },
  ];
  displayedColumns = this.columns.map((c) => c.property);

  dataSource = new MatTableDataSource<Product>([]);
  products: Product[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  ngOnInit() {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
      this.totalItems = data.length;
      this.updateDataSource();
    });
  }

  delete(id: number) {
    this.productService.removeProduct(id).subscribe({
      next: (response) => {
        this.products = this.products.filter((item) => item.id !== id);
        this.totalItems = this.products.length;
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
    this.dataSource.data = this.products.slice(startIndex, endIndex);
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
