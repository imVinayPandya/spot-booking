import { IParkingSpot } from "../../../typings/ParkingSpot";

/**
 * Parking spot entity class
 */
export class ParkingSpot implements Readonly<IParkingSpot> {
  constructor(public id: string, public name: string) {}
}
