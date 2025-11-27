import { Injectable } from '@angular/core';
import { Formation } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  computeDistanceForFormation(formation: Formation, userAddress: string): number {
    return Math.floor(1 + Math.random() * 200);
  }
}
