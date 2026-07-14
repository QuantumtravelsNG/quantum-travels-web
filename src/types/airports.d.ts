declare module "airports" {
  type AirportRecord = {
    iata?: string;
    name?: string;
    status?: number;
  };

  const airports: AirportRecord[];

  export default airports;
}
