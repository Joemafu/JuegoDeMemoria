import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonContent, IonButton, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Firestore, collection, addDoc, query, where, orderBy, getDocs, limit } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonHeader, IonToolbar, IonContent, CommonModule],
})
export class GameComponent  implements OnInit {

  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  cards: any[] = [];
  flippedCards: number[] = [];
  timer: number = 0;
  interval: any;
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  firstMove: boolean = true;
  milisegundos: number = 0;
  tiempoRegistrado: number = 0;
  firestore: Firestore = inject(Firestore);

  startTime: number = 0;

  constructor() { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.difficulty = params['difficulty'];
      this.preloadImages();
      this.setupGame();
    });
  }

  preloadImages() {
    const imagesToPreload = [...this.images.easy, ...this.images.medium, ...this.images.hard];
    imagesToPreload.forEach(imagePath => {
      const img = new Image();
      img.src = imagePath;
    });
  }

  images = {
    'easy': ['assets/img/animales/ardilla.png', 'assets/img/animales/gato.png', 'assets/img/animales/perro.png'],
    'medium': ['assets/img/herramientas/angular.png', 'assets/img/herramientas/androidstudio.png', 'assets/img/herramientas/html5.png', 'assets/img/herramientas/php.png', 'assets/img/herramientas/cs.png'],
    'hard': ['assets/img/frutas/anana.png', 'assets/img/frutas/banana.png', 'assets/img/frutas/durazno.png', 'assets/img/frutas/kiwi.png', 'assets/img/frutas/manzana.png', 'assets/img/frutas/naranja.png', 'assets/img/frutas/pera.png', 'assets/img/frutas/sandia.png']
  };

  setupGame() {
    const pairs = this.images[this.difficulty];
    this.cards = this.shuffleArray([...pairs, ...pairs]).map(image => ({ image, flipped: false }));
    const grid = document.querySelector('.game-grid');
    if (grid) {
      grid.classList.remove('easy', 'medium', 'hard'); 
      grid.classList.add(this.difficulty); 
    }
  }

  flipCard(index: number) {

    if (this.firstMove) {
      this.startTimer();
      this.firstMove = false;
    }

    if (this.flippedCards.length < 2 && !this.cards[index].flipped) {
      this.cards[index].flipped = true;
      this.flippedCards.push(index);

      if (this.flippedCards.length === 2) {
        this.checkMatch();
      }
    }
  }

  checkMatch() {
    const [firstIndex, secondIndex] = this.flippedCards;
  
    if (this.cards[firstIndex].image === this.cards[secondIndex].image) {
      this.flippedCards = [];
      if (this.cards.every(card => card.flipped)) {
        clearInterval(this.interval);
        this.tiempoRegistrado = this.timer + this.milisegundos / 1000;
        this.endGame();
      }
    } else {
      setTimeout(() => {
        this.cards[firstIndex].flipped = false;
        this.cards[secondIndex].flipped = false;
        this.flippedCards = [];
      }, 1000);
    }
  }

  startTimer() {
    this.startTime = Date.now();
    this.interval = setInterval(() => {
      this.updateTimer();
    }, 1);
  }

  updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;
  
    // Calcular los segundos y milisegundos transcurridos
    this.timer = Math.floor(elapsedTime / 1000);  // Segundos transcurridos
    this.milisegundos = elapsedTime % 1000;  // Milisegundos transcurridos
  }
  
  stopTimer() {
    clearInterval(this.interval);
  }

  shuffleArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  goBack() {
    clearInterval(this.interval);
    this.timer = 0;
    this.milisegundos = 0;
    this.firstMove = true;
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
  }

  async endGame() {
    clearInterval(this.interval);
  
    const dificultad = this.translateDifficulty();
  
    const playerRecord = {
      Correo: this.authService.currentUser,
      Tiempo: this.tiempoRegistrado,
      Dificultad: dificultad,
      Fecha: new Date().toISOString(),
      Usuario: this.authService.currentUser.split('@')[0]
    };
  
    try {
      const col = collection(this.firestore, 'records');
      const queryCol = query(col, where('Dificultad', '==', dificultad), orderBy('Tiempo', 'asc'), limit(5));
      const querySnapshot = await getDocs(queryCol);
  
      const bestTimes = querySnapshot.docs.map(doc => doc.data());
  
      if (bestTimes.length < 5 || this.tiempoRegistrado < bestTimes[bestTimes.length - 1]['Tiempo']) {
        const records = collection(this.firestore, 'records');
        const docRef = await addDoc(records, playerRecord);
  
        Swal.fire({
          title: '¡Felicitaciones!',
          text: `Entraste al podio de los mejores 5! Tu tiempo de ${this.tiempoRegistrado} segundos. Entraste en el salón de la fama!`,
          icon: 'success',
          confirmButtonText: 'Ok',
          heightAuto: false,
          background: '#515e82',
          color: '#151a28',
          confirmButtonColor: '#151a28',
        });
  
        return docRef.id;
      } else {
  
        Swal.fire({
          title: '¡Sigue intentando!',
          text: `Tu tiempo de ${this.tiempoRegistrado} segundos no fue suficiente para entrar al podio de los mejores 5.`,
          icon: 'info',
          confirmButtonText: 'Ok',
          heightAuto: false,
          background: '#515e82',
          color: '#151a28',
          confirmButtonColor: '#151a28',
        });
        return '';
      }
    } catch (e) {
      console.error('Error al obtener documentos o agregar nuevo registro:', e);
      return '';
    }
  }
  
  translateDifficulty() {
    switch (this.difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
    }
  }
}
