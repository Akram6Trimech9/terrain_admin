import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from '../views/admin/admin-panel/admin-panel.component';
import { ClientListComponent } from '../views/admin/client-list/client-list.component';
 

const routes: Routes = [
 
{
  path:'dashboard',
  component:AdminPanelComponent
},
{
  path:'users',
  component:ClientListComponent
},
// 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
