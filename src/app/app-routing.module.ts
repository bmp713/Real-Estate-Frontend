import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { DetailsComponent } from './pages/details/details.component';

const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductsComponent },
    { path: 'details/:id', component: DetailsComponent },
];

@NgModule({
    // imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
    imports: [RouterModule.forRoot(
        routes,
        // {scrollPositionRestoration: 'enabled'}
        {anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'}
      ),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}



