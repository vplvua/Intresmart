export type IconSize = 'small' | 'medium' | 'large' | 'logo';
export type IconColor = 'primary' | 'secondary' | 'tertiary';

export interface Case {
  id: number;
  home: boolean;
  homePage: {
    imageUrl: string;
    title: string;
  };
  imageCardUrl: string;
  imageCardSvg: string;
  launch: string;
  tag: string;
  title: string;
  videoUrl?: string;
}
