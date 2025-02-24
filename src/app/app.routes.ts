import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./main-container/components/').then((m) => m.HomeComponent),
  },
  {
    path: 'category/index',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.CategoryIndexComponent
      ),
  },
  {
    path: 'category/add',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.CategoryAddEditComponent
      ),
  },
  {
    path: 'category/edit/:id',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.CategoryAddEditComponent
      ),
  },
  {
    path: 'supplier/index',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.SupplierIndexComponent
      ),
  },
  {
    path: 'supplier/add',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.SupplierAddEditComponent
      ),
  },
  {
    path: 'supplier/edit/:id',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.SupplierAddEditComponent
      ),
  },
  {
    path: 'user/index',
    loadComponent: () =>
      import('./main-container/components/').then((m) => m.UserIndexComponent),
  },
  {
    path: 'user/add',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.UserAddEditComponent
      ),
  },
  {
    path: 'user/edit/:id',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.UserAddEditComponent
      ),
  },
  {
    path: 'product/index',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.ProductIndexComponent
      ),
  },
  {
    path: 'product/add',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.ProductAddEditComponent
      ),
  },
  {
    path: 'product/edit/:id',
    loadComponent: () =>
      import('./main-container/components/').then(
        (m) => m.ProductAddEditComponent
      ),
  },
];
