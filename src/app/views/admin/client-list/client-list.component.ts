import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface IUser {
  _id: number;
  username: string;
  lastname: string;
  email: string;
  telephone1: string;
  telephone2?: string;
  dateOfBirth: string;
  role: string;
}

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {

  searchQuery: string = '';
  addUserForm: FormGroup;
  updateUserForm: FormGroup;
  @ViewChild('addUserModal') addUserModal: any;
  @ViewChild('updateUserModal') updateUserModal: any; 
  currentUser: any;
  users: IUser[] = [];
  filteredUsers: IUser[] = [];

  constructor(
    private fb: FormBuilder,
    // private modalService: NgbModal, // Comment out the modal service if not needed for static testing
    // private toastr: ToastrService, // Comment out toastr for testing
    // private _authService: AuthService // Comment out the auth service for testing
  ) {
    // Initialize forms
    this.addUserForm = this.fb.group({
      username: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone1: ['', [Validators.required, Validators.pattern('^\\d{8,15}$')]],
      telephone2: [''],
      dateOfBirth: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.updateUserForm = this.fb.group({
      username: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone1: ['', [Validators.required, Validators.pattern('^\\d{8,15}$')]],
      telephone2: [''],
      dateOfBirth: ['', [Validators.required]],
    });
  }

  closeModal() {
    // Mock close modal
    console.log('Modal closed');
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openAddUserModal() {
    this.addUserForm.reset(); // Reset form for adding
    console.log('Opening Add User Modal');
    // this.modalService.open(this.addUserModal); // Uncomment if using actual modal
  }

  openUpdateUserModal(user: IUser) {
    this.updateUserForm.patchValue(user); // Patch values for updating
    console.log('Opening Update User Modal for:', user);
    // this.modalService.open(this.updateUserModal); // Uncomment if using actual modal
  }

  ngOnInit(): void {
    // Mock user data for testing
    this.users = [
      { _id: 1, username: 'John', lastname: 'Doe', email: 'john@example.com', telephone1: '12345678', dateOfBirth: '1990-01-01', role: 'Client' },
      { _id: 2, username: 'Jane', lastname: 'Smith', email: 'jane@example.com', telephone1: '87654321', dateOfBirth: '1985-02-15', role: 'Client' },
      { _id: 3, username: 'Mike', lastname: 'Johnson', email: 'mike@example.com', telephone1: '11223344', dateOfBirth: '1995-05-25', role: 'Client' },
    ];
    this.filteredUsers = this.users;
  }

  deleteUser(user: IUser) {
    this.users = this.users.filter(u => u._id !== user._id);
    this.filterUsers();
    console.log('User deleted:', user);
    // this.toastr.error('Utilisateur supprimé', 'Supprimé'); // Uncomment if using actual toastr
  }

  saveUser(): void {
    if (this.addUserForm.invalid) return;
    const user = { ...this.addUserForm.value, _id: Date.now(), role: 'Client' };
    this.users.push(user);
    console.log('User added:', user);
    // this.toastr.success('Nouvel utilisateur ajouté avec succès', 'Succès'); // Uncomment for toastr
    // this.modalService.dismissAll(); // Uncomment if using actual modal
    this.filterUsers();
  }

  updateUser(): void {
    if (this.updateUserForm.invalid) return;
    const updatedUser = { ...this.updateUserForm.value, _id: this.updateUserForm.value._id };
    const index = this.users.findIndex(u => u._id === updatedUser._id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      console.log('User updated:', updatedUser);
      // this.toastr.success('Utilisateur modifié avec succès', 'Succès'); // Uncomment for toastr
      // this.modalService.dismissAll(); // Uncomment if using actual modal
      this.filterUsers();
    }
  }
}
