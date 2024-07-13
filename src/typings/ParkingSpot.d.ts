interface IParkingSpot {
  id: string;
  name: string;
}

interface IParkingSpotInteractor {
  createParkingSpot(parkingSpot: IParkingSpot): Promise<IParkingSpot>;
  getParkingSpot(id: string): Promise<IParkingSpot>;
  updateParkingSpot(
    id: string,
    parkingSpot: IParkingSpot
  ): Promise<IParkingSpot>;
  deleteParkingSpot(id: string): Promise<IParkingSpot>;
}
