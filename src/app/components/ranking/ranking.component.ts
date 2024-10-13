import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, query, orderBy, where, getDocs, limit } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCardSubtitle, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonFooter, IonButtons, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonList,  IonButtons, IonFooter, IonButton, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonHeader, IonToolbar, IonTitle, IonContent, DatePipe, CommonModule ]
})
export class RankingComponent  implements OnInit {

  bestTimes: any[] = [];
  firestore: Firestore = inject(Firestore);
  router: Router = inject(Router);

  selectedDifficulty: string = 'Fácil';  // Iniciar con la dificultad 'Fácil'
  difficulties = ['Fácil', 'Medio', 'Difícil'];  // Las opciones de dificultad

  authService: AuthService = inject(AuthService);

  constructor() { }

  ngOnInit() {
    this.getBestTimes(this.selectedDifficulty);
  }

  async getBestTimes(difficulty: string) {
    const col = collection(this.firestore, 'records');
    const queryCol = query(col, where('Dificultad', '==', difficulty), orderBy('Tiempo', 'asc'), limit(5)); // Filtrar por dificultad
    const querySnapshot = await getDocs(queryCol);
    
    this.bestTimes = querySnapshot.docs.map(doc => doc.data());
  }

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.getBestTimes(difficulty);  // Cargar los puntajes de la dificultad seleccionada
  }

  atras() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}