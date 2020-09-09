import {ThemePalette} from '@angular/material/core';

export interface CategoryFilter {
  name: string;
  completed: boolean;
  color: ThemePalette;
  categories?: CategoryFilter[];
}
