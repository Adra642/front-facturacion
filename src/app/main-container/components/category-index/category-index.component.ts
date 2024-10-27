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
import { Category } from '@app/models';
import { CategoryService } from '@app/services';

@Component({
  selector: 'app-category-index',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './category-index.component.html',
  styleUrl: './category-index.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryIndexComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar = inject(MatSnackBar);

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
      property: 'actions',
      header: 'ACCIONES',
    },
  ];
  displayedColumns = this.columns.map((c) => c.property);

  dataSource = new MatTableDataSource<Category>([]);
  categories: Category[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
      this.totalItems = data.length;
      this.updateDataSource();
    });
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this.categories.slice(startIndex, endIndex);
  }

  pageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateDataSource();
  }

  delete(id: number) {
    this.categoryService.removeCategory(id).subscribe({
      next: (response) => {
        this.categories = this.categories.filter((item) => item.id !== id);
        this.totalItems = this.categories.length;
        this.updateDataSource();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.snackBar.open(
          'No se puede eliminar la categoría debido a que esta relacionado a otra entidad',
          'Cerrar',
          { duration: 5000 }
        );
      },
      complete: () => {
        this.snackBar.open(
          'La categoría fue eliminado correctamente',
          'Cerrar',
          { duration: 5000 }
        );
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
