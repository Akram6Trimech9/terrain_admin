import { Component } from '@angular/core';
import { ServicesTableComponent } from '../../components/services-table/services-table.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ ServicesTableComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

}
