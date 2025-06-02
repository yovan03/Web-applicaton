import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {
  heritage: any = {
    name: '',
    type: '',
    location: '',
    built: '',
    builder: '',
    description: '',
    image: ''
  };
  isEditMode = false;
  message = '';

  constructor(private searchService: SearchService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.searchService.getById(id).subscribe({
        next: (res: any) => (this.heritage = res),
        error: (err: any) => console.error('Грешка при вчитување за уредување', err)
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.searchService.updateHeritage(this.heritage._id, this.heritage).subscribe({
        next: () => (this.message = 'Објектот е успешно ажуриран.'),
        error: (err) => console.error('Грешка при ажурирање', err)
      });
    } else {
      this.searchService.createHeritage(this.heritage).subscribe({
        next: () => {
          this.message = 'Нов објект е успешно додаден.';
          this.resetForm();
        },
        error: (err) => console.error('Грешка при додавање', err)
      });
    }
  }

  private resetForm(): void {
    this.heritage = {
      name: '',
      type: '',
      location: '',
      built: '',
      builder: '',
      description: '',
      image: ''
    };
  }
}
