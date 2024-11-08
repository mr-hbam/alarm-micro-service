export interface DashboardRepository {
  getAverageBusesPerMonth(namespace: string): Promise<
    {
      month: number;
      year: number;
      count: number;
    }[]
  >;
  getAverageBusesDensityPerMonth(
    namespace: string,
    type: 'pickup' | 'drop-off',
  ): Promise<
    {
      month: number;
      year: number;
      avgOperators: number;
    }[]
  >;
  getExcessiveSpeedingCountPerMonth(namespace: string): Promise<
    {
      month: number;
      year: number;
      avgSpeedsCount: number;
    }[]
  >;

  getNonRespectPickup(namespace: string): Promise<number>;
  countClaimsByGroup(
    namespace: string,
  ): Promise<{ _id: string; count: number }[]>;
}
