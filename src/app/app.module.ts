import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    environment.production ? [] : AkitaNgDevtools.forRoot({ shallow: false }),
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
