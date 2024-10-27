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
];
