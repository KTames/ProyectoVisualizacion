import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainWindowComponent } from './main-window/main-window.component';
import { ArtistComponent } from './pages/artist/artist.component';
import { GenresComponent } from './pages/genres/genres.component';
import { MusicComponent } from './pages/music/music.component';


const routes: Routes = [
  {path: '', component: MainWindowComponent},
  {path: 'artist', component: ArtistComponent},
  {path: 'genres', component: GenresComponent},
  {path: 'music', component: MusicComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
