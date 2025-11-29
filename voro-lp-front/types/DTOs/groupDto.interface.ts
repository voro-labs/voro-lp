export interface GroupDto {
  id: string;
  subject: string;
  subjectOwner: string;
  subjectTime: number;
  pictureUrl?: string;
  size: number;
  creation: number;
  owner: string;
  restrict: boolean;
  announce: boolean;
  isCommunity: boolean;
  isCommunityAnnounce: boolean;
}
