import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type IconSize = 'small' | 'medium' | 'large' | 'logo';
export type IconColor = 'primary' | 'secondary' | 'tertiary';

export interface Case {
  id?: string;
  title: string;
  slug: string;
  launch: string;
  tag: string;
  home: boolean;
  homePage: {
    imageUrl: string;
    title: string;
  };
  imageCardUrl: string;
  imageCardSvg?: string;
  videoUrl?: string;
  page: {
    mainImgUrl: string;
    sideImgUrl: string;
    textField: string[];
  };
  archive?: boolean;
}

export interface CaseFileUrls {
  mainImgUrl?: string;
  sideImgUrl?: string;
  imageCardUrl?: string;
  videoUrl?: string;
  imageCardSvg?: string;
}

export interface CaseFormData {
  title: string;
  launch: string;
  tag: string;
  textFields: string[];
  mainImg: File | null;
  sideImg: File | null;
  imageCard: File | null;
  video: File | null;
  svg: File | null;
}

export type CaseFormGroup = FormGroup<{
  title: FormControl<string>;
  launch: FormControl<string>;
  tag: FormControl<string>;
  textFields: FormArray<FormControl<string>>;
  mainImg: FormControl<File | null>;
  sideImg: FormControl<File | null>;
  imageCard: FormControl<File | null>;
  video: FormControl<File | null>;
  svg: FormControl<File | null>;
}>;
