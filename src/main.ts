import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations()]
}).catch(err => console.error(err));
