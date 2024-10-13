import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonButtons } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports:  [IonButton, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons],
})
export class HomePage implements OnInit {

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  imagenAleatoria: string = 'assets/img/animales/ardilla.png';

  constructor() { }

  ngOnInit() {
    this.randomizeImage();
  }

  startGame(difficulty: string) {
    this.router.navigate(['/game'], { queryParams: { difficulty: difficulty } });
  }

  logout() {
    this.authService.logout();
  }

  goToRanking()
  {
    this.router.navigate(['/ranking']);
  }

  randomizeImage() {
    const images = [
      'assets/img/animales/ardilla.png', 
      'assets/img/animales/gato.png', 
      'assets/img/animales/perro.png', 
      'assets/img/herramientas/angular.png', 
      'assets/img/herramientas/androidstudio.png', 
      'assets/img/herramientas/html5.png', 
      'assets/img/herramientas/php.png', 
      'assets/img/herramientas/cs.png', 
      'assets/img/frutas/anana.png', 
      'assets/img/frutas/banana.png', 
      'assets/img/frutas/durazno.png', 
      'assets/img/frutas/kiwi.png', 
      'assets/img/frutas/manzana.png', 
      'assets/img/frutas/naranja.png', 
      'assets/img/frutas/pera.png', 
      'assets/img/frutas/sandia.png'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    this.imagenAleatoria = images[randomIndex];
  }











  
  /* authService: AuthService = inject(AuthService);
  usuario: string = '';
  public subscription: Subscription = new Subscription();



  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          mail: user.email!,
          pass: "",
          nombre: "", 
          apellido: "",
        });
        this.usuario = user.email!;        
      } else {
        this.usuario="";
        this.authService.currentUserSig.set(null);    
      }
    });
  } */
}
