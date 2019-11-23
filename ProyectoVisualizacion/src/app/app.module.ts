import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { MainWindowWidgetComponent } from './main-window-widget/main-window-widget.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { GenreWidgetComponent } from './pages/genres/widgets/genre-widget/genre-widget.component';
import { GenresComponent } from './pages/genres/genres.component';
import { FormsModule } from '@angular/forms';
import { MusicComponent } from './pages/music/music.component';
import { NodeService } from './services/node.service';

@NgModule({
  declarations: [
    AppComponent,
    MainWindowComponent,
    MainWindowWidgetComponent,
    ArtistComponent,
    GenreWidgetComponent,
    GenresComponent,
    MusicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SlimLoadingBarModule,
    NgbModule,
    FormsModule
  ],
  providers: [ NodeService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
