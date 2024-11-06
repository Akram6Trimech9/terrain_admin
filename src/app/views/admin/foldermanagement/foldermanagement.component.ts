import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DossiersService } from '../../../services/dossiers.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AffaireService } from '../../../services/affaire.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { IUser } from '../../../core/models/user';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HonorrairesComponent } from './modals/honorraires/honorraires.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment } from '../../../../environments/environment';
import { intervenantService } from '../../../services/inventaire.service';
import { AffaireStatus } from '../../../utils/justification';
import { ToastrService } from 'ngx-toastr';
import { CreditService } from '../../../services/credit.service';
import { AffairesComponent } from './components/affaires/affaires.component';
import { CategoryComponent } from './components/category/category.component';
import { ProcesService } from '../../../services/proces.service';
import { CabinetService } from '../../../services/cabinet.service';
declare var window: any;

@Component({
  selector: 'app-foldermanagement',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent, AffairesComponent,
    CategoryComponent,
    NgSelectModule],
  templateUrl: './foldermanagement.component.html',
  styleUrls: ['./foldermanagement.component.scss']
})
export class FoldermanagementComponent implements OnInit {
  dossiers: any[] = [];
  selectedFolder: any = null;
  affaires: any[] = [];
  selectedAffaire: any = null;
  modal: any;
  intervenants!: any[]
  folderForm!: FormGroup;
  clients: any[] = []
  currentUser !: any | null;
  selectedClient : any ;
  adminId: any;
  users: any[] = [];
  page: number = 1;
  limit: number = 3;
  search: string = '';
  status: string = '';
  isRectified: boolean | undefined;
  isExecuted: boolean | undefined;
  errorMessage: string = '';
  totalFolders: number = 0;  
  selectedFolderName: any
  totalPages: number = 0;  
  onFolderSelected(folder: string) {
    this.selectedFolderName = folder;
  }

  // Navigate to the next page
  nextPage() {
    if (this.page * this.limit < this.totalFolders) {
      this.page++;
      this.getFoldersByAdmin();
    }
  }

  // Navigate to the previous page
  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.getFoldersByAdmin();
    }
  }




  selectedFolderId: any;
  @ViewChild('userSelectionModal') userSelectionModal!: TemplateRef<any>;
 

  sousAdmins!:any[]

  constructor(
    private fb: FormBuilder,
    private _folderService: DossiersService,
    private _userService: AuthService,
    private affaireService: AffaireService,
    private _creditService: CreditService,
    private _authService: AuthService,
    private _intervenantService: intervenantService,
    private modalService: NgbModal,
    private _procesService : ProcesService,
    private  _cabinetService :CabinetService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
   ) {

    }
    folderId : any

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser()
   
    if (this.currentUser?._id) {
      this.adminId = this.currentUser?._id
      this.getClients(this.adminId)
      this._cabinetService.getCabinet(this.adminId).subscribe({ 
        next:(value)=>{
          this.sousAdmins = value.sousAdmins
          
        },error:(err)=>{ 
           console.log(err)
        }
    })
    this.getFoldersByAdmin();

    }
 
  
    this.initializeForms();
    this.modal = new window.bootstrap.Modal(
      document.getElementById('addAffaireModal')
    );
    this.getInterventaire()

    
  }

  getInterventaire() {
    this._intervenantService.getAllintervenant().subscribe({
      next: (value: any) => {
        this.intervenants = value.data
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  getClients(id: any) {
    this._userService.getAllClients(id).subscribe({
      next: (value: any) => {
        this.clients = value.data
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  initializeForms() {

    this.folderForm = this.fb.group({
      titleFolder: ['', Validators.required],
      numberFolder: ['', Validators.required],
      client: ['', Validators.required],

    });
  }
  sendAction(id: any) {
    this.selectedFolderId = id;
    this.modalService.open(this.userSelectionModal);
  }
 selectedUser : any ;
 message : any
 confirmSendAction(modal: any) {
  const record = {
    folderId: this.selectedFolderId,
    fromUserId: this.currentUser._id,
    toUserId: this.selectedUser,
    message: this.message,
  };


  this._folderService.transfertFolder(record).subscribe({
    next: (value) => {
      console.log('Dossier envoyé avec succès');
      // Display a success toastr
      this.toastr.success('Dossier envoyé avec succès', 'Succès');

      // Remove the folder from the list after sending
      this.dossiers = this.dossiers.filter(dossier => dossier._id !== this.selectedFolderId);

      // Close the modal
      modal.dismiss('Close click');
    },
    error: (err) => {
      console.log(err);
      // Display an error toastr
      this.toastr.error('Erreur lors de l\'envoi du dossier', 'Erreur');
    }
  });
}

openFolderById(folderId: any) {
  if (!folderId) return;  
  console.log(folderId,"ok" ,'dossiers',this.dossiers)
  const folder = this.dossiers.find(d => d._id === folderId);
  console.log(folder)
  if (folder) {
    this.selectedFolder = folder;
    this.selectedClient = this.selectedFolder.client;
    this.getAffairesByDossierId(folder._id);
  } else {
    console.error('Folder not found for ID:', folderId);
  }
}
searchNumber: any ;
searchTitle: string =''
clientId:any 

getFoldersByAdmin(): void {
  this._folderService.getFolderByAdminId(
 this.currentUser._id,
     this.page,
    this.limit,
    this.searchNumber,     
    this.searchTitle,     
    this.clientId,  
    this.isRectified,
    this.isExecuted
  ).subscribe({
    next: (response: any) => {
      this.dossiers = response.folders;
      this.totalFolders = response.totalItems;  
      this.totalPages = Math.ceil(this.totalFolders / this.limit); 
    },
    error: (error) => {
      this.errorMessage = 'Error fetching folders';
      console.error(error);  
    },
    complete:()=>{
      this.isLoading = false;  

    }
  });
}
isLoading: boolean = false;  
searchByTitle() {
  this.isLoading = true;

 setTimeout(() => {
  this.getFoldersByAdmin();

 }, 1000);
}

searchByNumber() {
  this.isLoading = true;
  setTimeout(() => {
    this.getFoldersByAdmin();
  
   }, 1000);
}

searchByStatus() {
  this.isLoading = true;
  if(this.status== 'executed' ) {
     this.isExecuted = true
     setTimeout(() => {
      this.getFoldersByAdmin();
    
     }, 1000);
  }else if(this.status== 'rectified' ){ 
    this.isRectified = true

    setTimeout(() => {
      this.getFoldersByAdmin();
    
     }, 1000);
  }else{ 
    this.isRectified = false
    this.isExecuted = false

    setTimeout(() => {
      this.getFoldersByAdmin();
    
     }, 1000);
  }
}
 



searchByClient() {
  this.isLoading = true;
  setTimeout(() => {
    this.getFoldersByAdmin();
  
   }, 1000);
}
isCurrentPage(page: number): boolean {
  return this.page === page;
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.page = page;
    this.getFoldersByAdmin();
  }
}

  checkQueryParams() {
    this.route.queryParams.subscribe((params: any) => {
        if (params.folderId) {
            this.folderId = params.folderId;
            this.openFolderById(this.folderId);
        }
    });
}
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  openFolder(folder: any) {
    this.router.navigate([], { queryParams: { folderId: folder._id } }); // Update the URL with the selected folder ID
    this.selectedFolder = folder;
    this.selectedClient = this.selectedFolder.client;
    this.getAffairesByDossierId(folder._id);
  }



  executeAction(id: any, isExecuted: boolean) {
    const params = !isExecuted;

    this._folderService.updateExecuted(id, params).subscribe({
      next: (value) => {
        console.log(value);
        const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isExecuted = params; // Update the isExecuted property
        }
      },
      error: (err) => {
        console.log(err);
        const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isExecuted = isExecuted; // Revert if the API call fails
        }
      }
    });
  }

  rectifyAction(id: any, isRectified: boolean) {
    const params = !isRectified;
    this._folderService.updateReactified(id, params).subscribe({
      next: (value) => {
        console.log(value);

        const dossierIndex = this.dossiers.findIndex(d => d._id === id);
        if (dossierIndex !== -1) {
          this.dossiers[dossierIndex].isRectified = params;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goBack() {
    this.selectedFolder = null;
    this.selectedAffaire = null;
  }

  getAffairesByDossierId(dossierId: number) {
    this.affaireService.fetchAffaires(dossierId).subscribe({
      next: (affaires: any) => {
        this.affaires = affaires.data;
      },
      error: (err) => {
        this.affaires = []
        console.error(err);
      }
    });
  }





  openFolderModal() {
    this.folderForm.reset();
    this.modal = new window.bootstrap.Modal(
      document.getElementById('addFolderModal')
    );
    this.modal.show();
  }

  addNewFolderAction() {
    if (this.folderForm.valid) {
      const newFolder = this.folderForm.value;
      console.log(this.folderForm.value, this.adminId, "adminId")
      this._folderService.createDossier({ ...newFolder, avocat: this.adminId }).subscribe({
        next: (folder) => {
          this.dossiers.push(folder);
          this.modal.hide();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  } 
 
  trackByFn(index: number, item: any) {
    return item.id || index;
  }


  takeAdminToClient(){
    this.modal.hide();
    
    this.router.navigateByUrl('/administrator/users')
  }





}
