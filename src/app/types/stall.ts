export type Stall = {
    profileId:string;
    stallName: string;
    stallDescription?: string;
    stallImage?: string[];
};

export interface StallDto extends Stall {
  id: string;
}